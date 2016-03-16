/* DOM obj */
var useBlack, useWhite, client, canvas, text, cursor, board;
/* const */
var SERVER_IP = "192.168.99.183";
var SERVER_PORT = 8080;
var BLACK = true, WHITE = false;
/* variable */
var myColor = undefined, turn = BLACK;

function get(id) {
  return document.getElementById(id);
}

function hide(obj) {
  obj.style.display = "none";
}

function show(obj) {
  obj.style.display = "inline";
}

function onClientReady() {
  hide(get("connectServer"));
  show(get("chooseColor"));
}

function onClientCmd(cmd) {
  switch(cmd.cmd) {
    case Cmd.USE_BLACK:
      useWhite.checked = true;
      break;
    case Cmd.USE_WHITE:
      useBlack.checked = true;
      break;
    case Cmd.START_GAME:
      onStartGame();
      break;
    case Cmd.PUT_CHESS:
      canvas.drawChess(Cmd.getX(cmd), Cmd.getY(cmd), !myColor);
      board.putChess(Cmd.getX(cmd), Cmd.getY(cmd), !myColor);
      turn = myColor;
      break;
    case Cmd.MOUSE_MOVE:
      cursor.moveTo(Cmd.getX(cmd), Cmd.getY(cmd));
      break;
    case Cmd.END_GAME:
      useBlack.checked = false;
      useWhite.checked = false;
      hide(get("errMsg"));
      show(get("chooseColor"));
      hide(get("playChess"));
      break;
  }
}

function onClientClose() {
  showText("server is offline");
}

function onClientError() {
  showText("server error");
}

/* receive START_GAME command */
function onStartGame() {
  canvas.clear();
  board.clear();
  turn = BLACK;
  hide(get("chooseColor"));
  show(get("playChess"));
  showText(useBlack.checked ? "I use BLACK" : "I use WHITE");
  myColor = useBlack.checked ? BLACK : WHITE;
}

function startGameOnClick() {
  if(!useBlack.checked && !useWhite.checked)
    show(get("errMsg"));
  else {
    client.send(Cmd.startGame());
    onStartGame();
  }
}

function useBlackOnClick() {
  client.send(Cmd.useBlack());
}

function useWhiteOnClick() {
  client.send(Cmd.useWhite());
}

function showText(s) {
  text.innerHTML = s;
}

function isMyTurn() {
  return myColor == turn;
}

function onCanvasClick(x, y) {
  if(turn == myColor && !board.hasChess(x, y)) {
    canvas.drawChess(x, y, myColor);
    board.putChess(x, y, myColor);
    client.send(Cmd.putChess(x, y));
    turn = !myColor;
  }
}

function onCanvasMouseMove(x, y) {
  client.send(Cmd.mouseMove(x, y));
}

window.onload = function () {
  useBlack = get("useBlack");
  useWhite = get("useWhite");
  client = new Client("ws://" + SERVER_IP + ":" + SERVER_PORT + "/");
  client.setCallback(onClientReady, onClientCmd, onClientClose, onClientError);
  canvas = new Canvas(get("canvas"));
  canvas.clear();
  canvas.setCallback(onCanvasClick, onCanvasMouseMove);
  text = get("text");
  cursor = new Cursor(get("cursor"));
  board = new Board();
}

window.onunload = function () {
  client.send(Cmd.endGame());
}
