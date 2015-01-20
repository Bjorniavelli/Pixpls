Pixpls.save = function() {
  localStorage["ver"] = Pixpls.ver;
  localStorage["numTicks"] = Pixpls.numTicks;

  localStorage["generators"] = JSON.stringify(Pixpls.Generators.list);
  // Mods.save();
  // Logs.save(); // No need to save logs, I think.
}

Pixpls.load = function() {
  // reverse localStorage save info with logic for versioning.

  Pixpls.ver = localStorage["ver"];
  Pixpls.numTicks = localStorage["numTicks"];

  var g = JSON.parse(localStorage["generators"]);
  Pixpls.Generators.list = {};
  for (key in g) {
    new Generator(g[key]);
  }
  // Generators.load();
  // Mods.load();
  //Logs.load();
}

Pixpls.reset = function() {

}
