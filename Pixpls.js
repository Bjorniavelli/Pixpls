function toFixed(num, precision) { // Grabbed off of StackOverflow -> floor instead of round
  return (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

var Pixpls = {
// Start Date?
  ver: "pre-alpha",
  tickLength: 100,
  numTicks: 0,
  devMode: true,

  init: function() {
    Pixpls.Data.init();

    Pixpls.Generators.init();
    Pixpls.Mods.render();

    $("header").on("click", "#savebutton", Pixpls.save);
    $("header").on("click", "#loadbutton", Pixpls.load);
    $("header").on("click", "#resetbutton", Pixpls.reset);
  },
  update: function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(toFixed(Pixpls.numTicks, 0));

    Pixpls.Generators.update();
//    Pixpls.updateGeneratorMenu();
    Pixpls.Mods.update();
  }
};
$(document).ready(function() {
  Pixpls.init();

  window.setInterval(Pixpls.update, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings
