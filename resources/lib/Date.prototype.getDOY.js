
// A new Prototype to return the Day of the Year.
// Taken from: http://javascript.about.com/library/bldayyear.htm
Date.prototype.getDOY = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((this - onejan) / 86400000);
}
