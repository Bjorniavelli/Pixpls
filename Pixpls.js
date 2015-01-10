var Pixpls = {
  ver: "pre-alpha",
  tickLength: 100,
  numTicks: 0,

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
  updateMods: function() {
    for (var i = 0; i < unavailableMods.length; i++) {
      if (unavailableMods[i].makeAvailable()) {
        unavailableMods[i].display();
      }
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

  renderMods();

  window.setInterval(function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(Pixpls.numTicks.toFixed(0));

    Pixpls.updateGeneratorMenu();
    Pixpls.updateMods();
    Pixpls.updateLogs();
  }, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings
