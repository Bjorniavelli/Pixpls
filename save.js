Pixpls.save = function() {
  localStorage["savedata"] = true;
  localStorage["ver"] = Pixpls.ver;
  localStorage["numTicks"] = Pixpls.numTicks;

  localStorage["generators"] = JSON.stringify(Pixpls.Generators.list);

  localStorage["mods"] = JSON.stringify({
    unavailableMods: Pixpls.Mods.unavailableMods,
    availableMods: Pixpls.Mods.availableMods,
    purchasedMods: Pixpls.Mods.purchasedMods,
    hiddenMods: Pixpls.Mods.hiddenMods
  });
  // Logs.save(); // No need to save logs, I think.
}

Pixpls.load = function() {
  // reverse localStorage save info with logic for versioning.
  if (localStorage["savedata"] != "true")
    return; // We don't have a save file, possibly because we've just reset or just loaded.

  Pixpls.ver = localStorage["ver"];
  Pixpls.numTicks = localStorage["numTicks"];

  var g = JSON.parse(localStorage["generators"]);
  $("#generators").find("li").remove();
  $("#generators").find("article").remove();
  Pixpls.Generators.list = {};
  for (key in g) {
    new Generator(g[key]).init();
  }

  var m = JSON.parse(localStorage["mods"]);
  $(".mod").remove();
  Pixpls.Mods.unavailableMods = m.unavailableMods;
  Pixpls.Mods.availableMods = m.availableMods;
  Pixpls.Mods.purchasedMods = m.purchasedMods;
  Pixpls.Mods.hiddenMods = m.hiddenMods;

  // Generators.load();
  // Mods.load();
  //Logs.load();
}

Pixpls.reset = function() {
  Pixpls.numTicks = 0;

  // I don't think I need these three comments, but I'll leave them in case I need to remember them.
  // This is currently causing problems, because we haven't implemented reset stuff for the mods...
  // $("#generators").find("li").remove();
  // $("#generators").find("article").remove();
  // Pixpls.Generators.list = {};
  Pixpls.init();

}
