function toFixed(num, precision) { // Grabbed off of StackOverflow -> floor instead of round
  var r = (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision));
  if (isNaN(r)) { r = 0; }
  return r.toFixed(precision);
}

var Pixpls = {
// Start Date?
  ver: "pre-alpha",
  tickLength: 100,
  numTicks: 0,
  devMode: true,

  init: function() {
    Pixpls.Generators.init();
    Pixpls.Mods.init();

    // This needs to be modified a bit, because the load isn't displaying the Mods div.
    // It's because the hiddenMod that displays them isn't there any more in the save data.
    if (localStorage["savedata"] == "true") {
      Pixpls.load();
    } else {
      Pixpls.Data.init();
    }

    $("header").on("click", "#savebutton", Pixpls.save);
    $("header").on("click", "#loadbutton", Pixpls.load);
    $("header").on("click", "#resetbutton", Pixpls.reset);
  },
  update: function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(toFixed(Pixpls.numTicks, 0));

    Pixpls.Generators.update();
    Pixpls.Mods.update();

    // This automatically auto-saves... I'm not sure we want that.  But we'll implement it for now.
    if (Pixpls.numTicks % 100 === 0) {
      Pixpls.save();
    }
  }
};
$(document).ready(function() {
  Pixpls.init();

  window.setInterval(Pixpls.update, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings
