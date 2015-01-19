function Log(params) {
  this.message = params.message;
  this.enabled = true;
  this.id = Pixpls.Logs.nextLogId;
  Pixpls.Logs.nextLogId++;
  this.timeStampe = Date.now();

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
