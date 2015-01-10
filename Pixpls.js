var Pixpls = {
  ver: "pre-alpha",
  tickLength: 100,

  buildGeneratorMenu: function() {
    var menu = $("<menu />");

    for (key in Generators) {
      var generator = Generators[key];
      generator.init();
      menu.append(generator.li);
    }

    $("menu").replaceWith(menu);
  },

  updateGeneratorMenu: function() {
    for (key in Generators) {
      Generators[key].update();
    }
  },
  updateLogs: function() {
    if (Logs.length > maxLogs) {
      Logs = Logs.slice(0, maxLogs);
    }

    var footer = $("<footer />");
    var i = 0;

    for (index in Logs) {
      Logs[index].update();
      if (i < maxDisplayLogs && Logs[index].enabled) {
        footer.append("<p>" + Logs[index].message + "</p>");
        i++;
      }
    }

    $("footer").replaceWith(footer);
  }
};
$(document).ready(function() {
  Pixpls.buildGeneratorMenu();

  window.setInterval(function() {
    Pixpls.updateGeneratorMenu();
    Pixpls.updateLogs();
  }, Pixpls.tickLength);
});
