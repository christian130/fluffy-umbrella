/*
 * drawer of board and chess
 * usage: var canvas = new Canvas(document.getElementById("canvas"));
 * interface: clear() -- clear and redraw the board
 *            drawChess(x, y, isBlack) -- draw chess
 *              throw InvalidLocation if "x" or "y" is invalid location
 */

function InvalidLocation(x, y) {
  var err = Error.call(this);
  err.name = "InvalidLocation";
  err.x = x;
  err.y = y;
  return err;
}

InvalidLocation.prototype = Object.create(Error.prototype, {
  constructor: { value: InvalidLocation }
});

function Canvas(HTMLCanvas) {
  this.gridSize = 40;
  this.dotRadius = 0.125;
  this.chessRadius = 0.4;
  this.margin = 0.75;
  this.canvas = HTMLCanvas;
  HTMLCanvas.canvasObj = this;
  this.g = this.canvas.getContext("2d");
  var self = this;
  this.canvas.onclick = function (event) {
    self.canvasOnClick(event);
  };
  this.canvas.onmousemove = function (event) {
    self.canvasOnMouseMove(event);
  };
  this.clickCallback = undefined;
  this.mouseMoveCallback = undefined;
}

Canvas.prototype.canvasOnClick = function(event) {
  if(!this.clickCallback)
    return;
  var x, y;
  x = this.loc(event.pageX - this.canvas.offsetLeft);
  y = this.loc(event.pageY - this.canvas.offsetTop);
  if(this.locIsValid(x) && this.locIsValid(y))
    this.clickCallback(x, y);
}

Canvas.prototype.canvasOnMouseMove = function(event) {
  if(!this.mouseMoveCallback)
    return;
  var x, y;
  x = event.pageX - this.canvas.offsetLeft;
  y = event.pageY - this.canvas.offsetTop;
  this.mouseMoveCallback(x, y);
}

Canvas.prototype.clear = function () {
  this.adjustCanvasSize();
  this.drawBoard();
}

Canvas.prototype.setCallback = function (clickCallback, mouseMoveCallback) {
  this.clickCallback = clickCallback;
  this.mouseMoveCallback = mouseMoveCallback;
}

Canvas.prototype.pos = function (x) {
  return (this.gridSize * this.margin) + x * this.gridSize;
}

Canvas.prototype.loc = function (x) {
  return Math.round((x / this.gridSize) - this.margin);
}

Canvas.prototype.locIsValid = function (x) {
  return 0 <= x && x < 15;
}

Canvas.prototype.adjustCanvasSize = function () {
  this.canvas.width = this.gridSize * (14 + 2 * this.margin);
  this.canvas.height = this.gridSize * (14 + 2 * this.margin);
}

Canvas.prototype.drawLines = function () {
  var i;
  for(i = 0; i < 15; i ++) {
    this.g.moveTo(this.pos(0), this.pos(i));
    this.g.lineTo(this.pos(14), this.pos(i));
    this.g.moveTo(this.pos(i), this.pos(0));
    this.g.lineTo(this.pos(i), this.pos(14));
  }
  this.g.stroke();
}

Canvas.prototype.drawDot = function (x, y) {
  this.g.beginPath();
  this.g.arc(this.pos(x), this.pos(y), this.gridSize * this.dotRadius, 0,
             2*Math.PI);
  this.g.fill();
}

Canvas.prototype.drawDots = function () {
  this.drawDot(3, 3);
  this.drawDot(7, 7);
  this.drawDot(11, 11);
  this.drawDot(3, 11);
  this.drawDot(11, 3);
}

Canvas.prototype.drawBoard = function () {
  this.drawLines();
  this.drawDots();
}

Canvas.prototype.drawChess = function (x, y, isBlack) {
  if(!this.locIsValid(x) || !this.locIsValid(y))
    throw new InvalidLocation(x, y);
  this.g.beginPath();
  this.g.arc(this.pos(x), this.pos(y), this.chessRadius * this.gridSize, 0,
             2*Math.PI);
  this.g.fillStyle = isBlack ? "#000000" : "#ffffff";
  this.g.fill();
  this.g.stroke();
}

