Pixpls.save = function() {
  localStorage["savedata"] = true;
  localStorage["ver"] = Pixpls.ver;
  localStorage["numTicks"] = Pixpls.numTicks;

  localStorage["generators"] = JSON.stringify(Pixpls.Generators.list);

  var m = {
    unavailableMods: {},
    availableMods: {},
    purchasedMods: {},
    hiddenMods: {}
  };
  for (key in Pixpls.Mods.unavailableMods) {
    m.unavailableMods[key] = key;
  }
  for (key in Pixpls.Mods.availableMods) {
    m.availableMods[key] = key;
  }
  for (key in Pixpls.Mods.purchasedMods) {
    m.purchasedMods[key] = key;
  }
  for (key in Pixpls.Mods.hiddenMods) {
    m.hiddenMods[key] = key;
  }

  localStorage["mods"] = JSON.stringify(m);
  // Logs.save(); // No need to save logs, I think.
}

Pixpls.load = function() {
  // reverse localStorage save info with logic for versioning.
  if (localStorage["savedata"] != "true")
    return; // We don't have a save file, possibly because we've just reset or just loaded.

  Pixpls.ver = localStorage["ver"];
  Pixpls.numTicks = localStorage["numTicks"];

  var g = JSON.parse(localStorage["generators"]);
  $("#generators").html("<menu></menu><article></article>");
  // $("#generators").find("li").remove();
  // $("#generators").find("article").remove();
  Pixpls.Generators.list = {};
  for (key in g) {
    new Generator(g[key]);
  }

  var m = JSON.parse(localStorage["mods"]);
  $(".mod").remove();
  Pixpls.Mods.unavailableMods = {};
  for (key in m.unavailableMods) {
    new Mod(Pixpls.Data.Mods[key]);
  }
  Pixpls.Mods.availableMods = {};
  for (key in m.availableMods) {
    var mod = new Mod(Pixpls.Data.Mods[key]);
    Pixpls.Mods.displayMod(mod);
  }
  Pixpls.purchasedMods = {};
  for (key in m.purchasedMods) {
    var mod = new Mod(Pixpls.Data.Mods[key], Pixpls.Mods.purchasedMods);
    Pixpls.Mods.displayMod(mod);
    Pixpls.Mods.purchaseMod(mod);
  }
  Pixpls.hiddenMods = {};
  for (key in m.hiddenMods) {
    if (Pixpls.Data.Mods[key]) {
      new Mod(Pixpls.Data.Mods[key]);
    }
  }

  // Generators.load();
  // Mods.load();
  //Logs.load();
}

Pixpls.reset = function() {
  Pixpls.numTicks = 0;

  // I don't think I need these three comments, but I'll leave them in case I need to remember them.
  // This is currently causing problems, because we haven't implemented reset stuff for the mods...
  $("#generators").find("li").remove();
  $("#generators").find("article").remove();
  Pixpls.Generators.list = {};

  Pixpls.Mods.unavailableMods = {};
  Pixpls.Mods.availableMods = {};
  Pixpls.Mods.purchasedMods = {};
  Pixpls.Mods.hiddenMods = {};

  Pixpls.init();
}
