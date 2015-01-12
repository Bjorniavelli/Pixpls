function toFixed(num, precision) { // Grabbed off of StackOverflow -> floor instead of round
  return (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

var Pixpls = {
  ver: "pre-alpha",
  tickLength: 100,
  numTicks: 0,
  devMode: true,

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
      if (i >= maxDisplayLogs) {
        break;
      }

      if (Logs[index].enabled) {
        footer.append("<p>" + Logs[index].message + "</p>");
        i++;
      }
    }

    $("footer").replaceWith(footer);
  }
};
$(document).ready(function() {
  Pixpls.buildGeneratorMenu();
  Mods.render();

  window.setInterval(function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(toFixed(Pixpls.numTicks, 0));

    Pixpls.updateGeneratorMenu();
    Mods.update();
    Pixpls.updateLogs();
  }, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings
