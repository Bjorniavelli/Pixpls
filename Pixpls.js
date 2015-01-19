function toFixed(num, precision) { // Grabbed off of StackOverflow -> floor instead of round
  return (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

var Pixpls = {
// Start Date?
  ver: "pre-alpha",
  tickLength: 100,
  numTicks: 0,
  devMode: true,

  buildGeneratorMenu: function() {
    var menu = $("<menu />");

    for (key in Pixpls.Generators.list) {
      var generator = Pixpls.Generators.list[key];
      generator.init();
      menu.append(generator.li);
      if (key != "click") {
        generator.li.hide();
      }
    }

    $("menu").replaceWith(menu);
  },

  updateGeneratorMenu: function() {
    for (key in Pixpls.Generators.list) {
      Pixpls.Generators.list[key].update();
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
  },

  init: function() {
    Pixpls.Data.init();

    Pixpls.buildGeneratorMenu();
    $("#generators").hide();
    Pixpls.Mods.render();

    $("header").on("click", "#savebutton", Pixpls.save);
    $("header").on("click", "#loadbutton", Pixpls.load);
    $("header").on("click", "#resetbutton", Pixpls.reset);
//    Pixpls.handleSaveButtons();
  },
  update: function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(toFixed(Pixpls.numTicks, 0));

    Pixpls.updateGeneratorMenu();
    Pixpls.Mods.update();
    Pixpls.updateLogs();
  }
};
$(document).ready(function() {
  Pixpls.init();

  window.setInterval(Pixpls.update, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings
