var maxLogs = 1000;
var maxDisplayLogs = 10;
var nextLogId = 0;

var logChange = true;

function Log(params) {
  this.message = params.message;
  this.enabled = true;
  this.id = nextLogId;
  nextLogId++;
  this.timeStampe = Date.now();

  Logs.unshift(this);
};

var Logs = [];

new Log({
    message: "Welcome to Pixpls! (ver." + Pixpls.ver + ")"
  });
new Log({
    message: "This *is* a clicky game.  How about some tasty, endorphin-producing clicking?"
  });
