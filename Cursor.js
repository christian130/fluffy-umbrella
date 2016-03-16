/*
 * show the cursor of another player
 * usage:
 *   cursor = new Cursor(document.getElementById("cursor"));
 *   cursor.moveTo(10, 20);
 */

function Cursor(htmlDiv) {
  this.htmlDiv = htmlDiv;
}

Cursor.prototype.toPX = function (i) {
  return "" + i + "px";
}

Cursor.prototype.moveTo = function (x, y) {
  this.htmlDiv.style.top = this.toPX(y);
  this.htmlDiv.style.left = this.toPX(x);
}
