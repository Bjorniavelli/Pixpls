Pixpls.save = function() {
  localStorage["savedata"] = true;
  localStorage["ver"] = Pixpls.ver;
  localStorage["numTicks"] = Pixpls.numTicks;

  localStorage["generators"] = JSON.stringify(Pixpls.Generators.list);

  var m = {
    unavailableMods: {}, // These might need to be arrays.
    availableMods: {},
    purchasedMods: {},
    hiddenMods: {},
    hiddenQueue: Pixpls.Mods.hiddenQueue
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
  for (var i = 0; i < m.hiddenQueue.length; i++) {
    if (Pixpls.Data.Mods[m.hiddenQueue[i]]) {
      Pixpls.Data.Mods[m.hiddenQueue[i]].buy();
    }
  }

  Pixpls.Logs.list = [];
  new Log({message: "Game loaded!"});

  // Generators.load();
  // Mods.load();
  //Logs.load();
}

Pixpls.reset = function() {
  if (!window.confirm("This is an actual reset.  It's not fancy prestige stuff.  You probably don't want to do this.  Continue?")) {
    new Log({message: "Pixpls Apocalypse Averted!"});
    return;
  }

  new Log({message: "Gauss!  Was it worth it?"});

  localStorage["savedata"] = false;
  Pixpls.numTicks = 0;

  $("#generators").find("li").remove();
  $("#generators").find("article").remove();
  Pixpls.Generators.list = {};

  Pixpls.Mods.unavailableMods = {};
  Pixpls.Mods.availableMods = {};
  Pixpls.Mods.purchasedMods = {};
  Pixpls.Mods.hiddenMods = {};
  Pixpls.Mods.hiddenQueue = [];

  Pixpls.Logs.list = [];
//  $(".logs").empty();

  Pixpls.init();
}
