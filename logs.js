var logDisplay = 5;
var maxLogs = 100;
var maxDisplayLogs = 10;

function Log(params) {
  this.message = params.message;
  this.timer = logDisplay;
  this.enabled = true;
};
Log.prototype.update = function() {
  if (this.enabled == false) {
    return;
  }
  this.timer -= Pixpls.tickLength / 1000;
  if (this.timer < 0) {
    this.enabled = false;
  }
};

var Logs = [
  new Log({
    message: "Welcome to Pixpls! (ver." + Pixpls.ver + ")"
  }),
  new Log({
    message: "This *is* a clicky game.  How about some tasty, endorphin-producing clicking?"
  })
];
