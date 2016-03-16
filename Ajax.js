/* do ajax query
 * support sync mode or async mode
 * usage:
 *   var isAsync = false;
 *   var ajax = new Ajax();
 *   ajax.query('web_page.php', '', onSuccessCallback, isAsync);
 */
function Ajax() {
  this.ajaxObj = new XMLHttpRequest();
}

Ajax.prototype.query = function(url, data, onSuccess, async) {
  if(async)
    this.ajaxObj.onreadystatechange = function() {
      if(this.ajaxObj.readyState == 4 && this.ajaxObj.status == 200)
        onSuccess(this.ajaxObj.responseText);
    }
  this.ajaxObj.open("POST", url, async);
  if(data) {
    this.ajaxObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.ajaxObj.send(data);
  }
  this.ajaxObj.send();
  if(!async)
    onSuccess(this.ajaxObj.responseText);
}
