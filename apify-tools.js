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
        if (pageIndex > 2) {
            break;
        }
    }

    return result;
};


module.exports = { loadItems };
