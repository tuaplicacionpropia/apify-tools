const Apify = require('apify');

String.prototype.queGuay = function() {
    return "que guay " + this;
};

String.prototype.removePrefix = function(prefix) {
    return this.trim().substring(prefix.length).trim();
};


String.prototype.bookId = function() {
    var result = null;
    result = this;
    result = result.substring(result.indexOf('book/') + 'book/'.length);
    result = result.substring(0, result.indexOf('/'));
    return result;
};

String.prototype.bookName = function() {
    var result = null;
    result = this;
    result = result.substring(result.indexOf('book/') + 'book/'.length);
    result = result.substring(result.indexOf('/') + 1);
    var bookNameIndex = result.indexOf("?");
    if (bookNameIndex > 0) {
        result = result.substring(0, bookNameIndex);
    }
    return result;
};

const loadItems = async ( page, goOnSelector, listSelector, fnReadItem ) => {
    var result = [];

    var goOn = true;
    var pageIndex = 1;

    //var goOnSelector = "a:contains('Siguiente')";
    //const goOnSelector = "div[onclick*='pSiguiente']";
    console.log(">>>>>>>>>>>>> " + typeof fnReadItem);
    while (goOn) {
        console.log("reading page " + pageIndex);

        //https://stackoverflow.com/questions/46088351/puppeteer-pass-variable-in-evaluate
        const pageItems = await page.evaluate((selector2, myFnReadItem) => {
          var selector4 = selector2 + " " + myFnReadItem;
          //const func = new Function(`return ${myFnReadItem}.apply(null, arguments)`);
          //const func = new Function("self", "return {title: 'periquito'};");
          const func = new Function("return " + myFnReadItem)();          
          return $(selector2).map(function(self) {
              //return {title: 'HOLA'};
              return func(this);
              //return {title: selector4};
              //return {title: selector4 + ">>>>>>>>>>" + (typeof func)};
          }).get();
          //return $(selector2).map(func).get();
        }, listSelector, fnReadItem.toString());
        //console.log("pageItems = " + pageItems);
        result = result.concat(pageItems);

        goOn = await page.evaluate((selector) => { 
            return $(selector).length;
        }, goOnSelector);
        if (goOn) {
            await page.click(goOnSelector);
            await Apify.utils.sleep(10000);
            console.log("GO ON NEXT PAGE on remote");
        }

        pageIndex += 1;
        if (false && pageIndex > 2) {
            break;
        }
    }

    return result;
};

const saveScreenshot = async ( page, target ) => {
  const screenshotBuffer = await page.screenshot();
  await Apify.setValue(target + ".png", screenshotBuffer, { contentType: 'image/png' });
};

const keyEnter = async ( page, selector ) => {
  await page.type(selector, String.fromCharCode(13));
};

const setValue = async ( page, selector, newValue ) => {
  await page.evaluate((sel, value) => {
    $(sel).val(value);
  }, selector, newValue);
};

const attr = async ( page, selector, attrName ) => {
  return await page.evaluate((sel, aName) => {
    return $(sel).attr(aName);
  }, selector, attrName);
};

const writeKeys = async ( page, selector, keys ) => {
  await page.type(selector, keys);
};

const click = async ( page, element ) => {
  await page.click(element);
};

const waitMs = async ( ms ) => {
  await Apify.utils.sleep(ms);
};

const runMain = async ( fn, startUrl ) => {
  //console.log("AAAAAAAAAA  func = " + fn.toString());
  //console.log("AAAAAAAAAA  startUrl = " + startUrl);
  Apify.main(async () => {

    // Get input of the actor.
    // If you'd like to have your input checked and generate a user
    // interface for it, add INPUT_SCHEMA.json file to your actor.
    // For more information, see https://docs.apify.com/actor/input-schema
    const input = await Apify.getInput();
    console.log('Input:');
    console.dir(input);

    // Do something useful here...

    console.log('Launching Puppeteer...');
    const browser = await Apify.launchPuppeteer();

    const page = await browser.newPage();
    
    if (startUrl != null) {
      console.log(`Opening URL: ${startUrl}`);
      await page.goto(startUrl);
    }
    
    // Save output
    const output = await fn(input, page, browser, startUrl);
    //console.log(">>>>>>>>>>> fn = " + fn.toString());
    //console.log(">>>>>>>>>>> startUrl = " + startUrl);
    //const output= {hola: "adios"};
    console.log('Output:');
    console.dir(output);
    await Apify.setValue('OUTPUT', output);
  });

};




module.exports = { 
  loadItems, 
  saveScreenshot, 
  keyEnter, 
  setValue, 
  attr, 
  writeKeys, 
  click, 
  runMain, 
  waitMs
};
//const { loadItems, saveScreenshot, keyEnter, setValue, attr, writeKeys, click, runMain, waitMs } = require('./utils');
