function Log(params) {
  if (typeof params == "string") {
    this.message = params;
  } else {
    this.message = params.message;
  }
  this.id = params.id || Pixpls.Logs.nextLogId;
  this.timeStamp = params.timeStamp || Date.now();

  if (this.id >= Pixpls.Logs.nextLogId) {
    Pixpls.Logs.nextLogId = this.id + 1;
  }

  Pixpls.Logs.list.unshift(this);
  Pixpls.Logs.update();
};

Pixpls.Logs = {
  list: [],
  maxLogs: 1000,
  maxdisplayLogs: 10,
  nextLogId: 0,
  update: function() {
    if (this.list.length > this.maxLogs) {
      this.list = this.list.slice(0, maxLogs);
    }

    var footer = $("<footer />");
    var i = 0;

    for (index in this.list) {
      if (i >= this.maxDisplayLogs) { break; }
      if (this.list[index].enabled) {
        footer.append("<p>" + this.list[index].message + "</p>");
        i++;
      }
    }

    $("footer").replaceWith(footer);
    this.footer = footer;
  }
};
