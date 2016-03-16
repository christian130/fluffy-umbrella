/* a client talking to the server
 * interface:
 *   Client(url): connect to websocket url
 *   send(obj):   send an object to server
 *   setCallback(onOpen, onMessage, onClose, onError):
 *     function onOpen ()
 *     function onMessage (obj): a callback receiving an object
 *     function onClose ():      a callback
 *     function onError ():      a callback
 *   close():     disconnect
 */

function Client(url) {
  this.onOpen = undefined;
  this.onMessage = undefined;
  this.onClose = undefined;
  this.onError = undefined;
  this.webSocket = new WebSocket(url);
  var self = this;
  this.webSocket.onopen = function () {
    if(self.onOpen)
      self.onOpen();
  }
  this.webSocket.onmessage = function(msg) {
    if(self.onMessage) {
      var obj = JSON.parse(msg.data);
      self.onMessage(obj);
    }
  }
  this.webSocket.onclose = function() {
    if(self.onClose)
      self.onClose();
  }
  this.webSocket.onerror = function(error) {
    if(self.onError)
      self.onError(error);
  }
}

Client.CONNECTING = 0;
Client.OPEN = 1;
Client.CLOSING = 2;
Client.CLOSED = 3;

Client.prototype.getState = function () {
  return this.webSocket.readyState;
}

Client.prototype.send = function (obj) {
  this.webSocket.send(JSON.stringify(obj));
}

Client.prototype.close = function () {
  this.webSocket.close();
}

Client.prototype.setCallback = function (onOpen, onMessage, onClose, onError) {
  this.onOpen = onOpen;
  this.onMessage = onMessage;
  this.onClose = onClose;
  this.onError = onError;
}
