/*
 * Command sent between server and client
 */
function Cmd(cmd, arg) {
  this.cmd = cmd;
  this.arg = arg;
}

Cmd.USE_BLACK   = 1;
Cmd.USE_WHITE   = 2;
Cmd.START_GAME  = 3;
Cmd.PUT_CHESS   = 4;
Cmd.END_GAME    = 5;
Cmd.MOUSE_MOVE  = 6;

Cmd.getX = function (cmd) {
  return cmd.arg[0];
}

Cmd.getY = function (cmd) {
  return cmd.arg[1];
}

Cmd.useBlack = function () {
  return new Cmd(Cmd.USE_BLACK);
}

Cmd.useWhite = function () {
  return new Cmd(Cmd.USE_WHITE);
}

Cmd.startGame = function () {
  return new Cmd(Cmd.START_GAME);
}

Cmd.putChess = function (x, y) {
  return new Cmd(Cmd.PUT_CHESS, [x, y]);
}

Cmd.endGame = function () {
  return new Cmd(Cmd.END_GAME);
}

Cmd.mouseMove = function (x, y) {
  return new Cmd(Cmd.MOUSE_MOVE, [x, y]);
}
