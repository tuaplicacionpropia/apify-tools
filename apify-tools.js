
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

