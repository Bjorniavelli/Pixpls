Pixpls.save = function() {
  // localstorage for basic Pixpls stuff.
  if (localStorage) {
    console.log ("Success!");
  }

  localStorage["ver"] = Pixpls.ver;
  localStorage["numTicks"] = Pixpls.numTicks;

  Pixpls.Generators.save();
  // Mods.save();
  // Logs.save(); // No need to save logs, I think.
}

Pixpls.load = function() {
  // reverse localStorage save info with logic for versioning.

  Pixpls.ver = localStorage["ver"];
  Pixpls.numTicks = localStorage["numTicks"];

  // Generators.load();
  // Mods.load();
  //Logs.load();
}

Pixpls.reset = function() {

}
