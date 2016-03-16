function Board() {
  this.NOCHESS = 0;
  this.BLACK = 1;
  this.WHITE = 2;
  this.chessArray = new Array(15 * 15);
  this.clear();
}

Board.prototype.clear = function () {
  var i;
  for(i = 0; i < 15 * 15; i ++)
    this.chessArray[i] = this.NOCHESS;
}

Board.prototype.seq = function (x, y) {
  return x + (15 * y);
}

Board.prototype.hasChess = function (x, y) {
  return this.chessArray[this.seq(x, y)] != this.NOCHESS;
}

Board.prototype.putChess = function (x, y, isBlack) {
  this.chessArray[this.seq(x, y)] = (isBlack ? this.BLACK : this.WHITE);
}


