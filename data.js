function Resource (params) {
  this.label = params.label;
  this.type = params.type;

  this.name = params.name;
  this.description = params.description;
  this.flavorText = params.flavorText;
  this.message = params.message || "Buy";
}
Resource.prototype.makeAvailable = function() {
  if (typeof this._makeAvailable == "string") {
    if (!Pixpls.Data.functionList[this._makeAvailable]) {
      console.log("Tried to call " + this._makeAvailable + " from " + this.name + ". (makeAvailable())");
      return false;
    }
    return Pixpls.Data.functionList[this._makeAvailable](this); // I don't think this will happen either, since we're going to try to conver them all to cost-types, but maybe we'll see if we need this combo.
  }

  if (Array.isArray(this._makeAvailable)) {
    for (var i = 0; i < this._makeAvailable.length; i++) {
      if (!boolFunction(this._makeAvailable[i])) {
        return false;
      }
    }
    return true;
  }

  // It's definitely not going to be a typeof "function", because those won't save to the stringify.
  console.log(this.name + " tried to check makeAvailable, but it's not a function, string, or Array.");
  return false;
};
Resource.prototype.affordable = function() {
  if (typeof this._affordable == "string") {
    if (!Pixpls.Data.functionList[this._affordable]) {
      console.log("Tried to call " + this._affordable + " from " + this.name + ". (affordable())");
      return false;
    }
    return Pixpls.Data.functionList[this._affordable](this);
  }

  if (Array.isArray(this.affordable)) {
    for (var i = 0; i < this._affordable.length; i++) {
      if (!boolFunction(this._affordable[i])) {
        return false;
      }
    }
    return true;
  }

  // It's definitely not going to be a typeof "function", because those won't save to the stringify.
  console.log(this.name + " tried to check affordable, but it's not a function, string, or Array.");
  return false;
}

function boolFunction (o) {
  switch(o.type) {
    case "resourcenum":
      if (Pixpls.resources[o.resource].num < o.num) { // These all need more error checking.
        return false;
      }
      break;
    case "resourcenumlost":
      if (Pixpels.resource[o.resource].numLost < o.num) {
        return false;
      }
      break;
    case "modstatus":
      if (Pixpls.resources[o.mod].status != "purchased") {
        return false;
      }
      break;
    case "time":
      if (Pixpls.numTicks < o.num) {
        return false;
      }
      break;
    case "stringmap":
      if (!Pixpls.Data.functionList[o.function]()) {
        return false;
      }
      break;
    case "function":
      if (!o.function()) {
        return false;
      }
      break;
    default:
      console.log(o.type + " is not a handled constraint type.  In " + "this.name" + "."); // Looks like this error won't work anymore.
      return false;
  }
}

Pixpls.Data = {
  init: function() {
    for (var i = 0; i < this.resourceList.length; i++) {
      switch (this.resourceList[i].type) {
        case "generator":
          new Generator(this.resourceList[i]);
          break;
        case "hidden":
          new HiddenMod(this.resourceList[i]);
          break;
        case "mod":
          new Mod(this.resourceList[i]);
          break;
        default:
          new Resource(this.resourceList[i]);
          break;
      }
    }
  },

  resourceList: [
    // Generators
    {
      label: "click",
      type: "generator",
      name: "Click",
      message: "Click!",
      enabled: true,
      flavorText: "Strangely, they give off an appetizing aroma: Ozone and Umamclicki.",
      baseCost: 0
    },{
      label: "pixel",
      type: "generator",
      name: "Pixel",
      _produceTarget: "click",
      _costTarget: "click",
      baseProduce: -1,
      flavorText: "Little dots that shine?  Fantastic!"
    },{
      label: "renderer",
      type: "generator",
      name: "Renderer",
      num: 0,
      _produceTarget: "pixel",
      _costTarget: "pixel",
      baseProduce: 0.0005,
      flavorText: "All we have to do is make more pixels?  That doesn't seem so hard."
    },{
      label: "extruder",
      type: "generator",
      name: "Extruder",
      _produceTarget: "renderer",
      _costTarget: "renderer",
      baseProduce: 0.0005,
      flavorText: "Imagine a snail leaving behind a sticky residue.  It's gross.  Actually, it's not like that.  But it's still gross."
    },{
      label: "electronicskit",
      type: "generator",
      name: "Electronics Kit",
      _produceTarget: "extruder",
      _costTarget: "extruder",
      baseProduce: 0.0005,
      flavorText: "A virtual toolbox for making more virtual stuff.  Makes sense."
    },{
      label: "factory",
      type: "generator",
      name: "Factory",
      _produceTarget: "electronicskit",
      _costTarget: "electronicskit",
      baseProduce: 0.0005,
      flavorText: "Making things by hand is so 18th centicycle.  They work better when we make them en masse.  That's French for en masse."
    },{
      label: "cementprinter",
      type: "generator",
      name: "Cement Printer",
      _produceTarget: "factory",
      _costTarget: "factory",
      baseProduce: 0.0005,
      flavorText: "Virtual Factories are made out of virtual cement.  That's the secret ingredient.  The other secret ingredient is virtual secrets."
    },{
      label: "designlab",
      type: "generator",
      name: "Design Lab",
      _produceTarget: "cementprinter",
      _costTarget: "cementprinter",
      baseProduce: 0.0005,
      flavorText: "It's not so much useful as a place to put all those hipxlsters."
    },{
      label: "ai",
      type: "generator",
      name: "AI",
      _produceTarget: "designlab",
      _costTarget: "designlab",
      baseProduce: 0.0005,
      flavorText: "Everybody run away from the singularity!"
    },

    // Mods
    {
      label: "uselessupgrade",
      type: "mod",
      name: "Test Upgrade",
      description: "Just checking to see if the upgrade display is working.",
      _makeAvailable: "devMode",
      _affordable: "returnTrue",
      _buy: "buyuselessupgrade"
    },{
      label: "debugclicks",
      type: "mod",
      name: "Check Clicks",
      description: "Add 10,000,000 clicks.",
      _makeAvailable: "devMode",
      _affordable: "returnTrue",
      _buy: "buydebugclicks"
    },{
      label: "debugpixels",
      type: "mod",
      name: "Check Pixels",
      description: "Add 1,000 pixels.",
      _makeAvailable: "devMode",
      _affordable: "returnTrue",
      _buy: "buydebugpixels"
    },{
      label: "redgluttony",
      type: "mod",
      name: "Reduce Gluttony",
      description: "Those pixels seem to be eating an inordinate amount.  Maybe you're clicking wrong?  This will train you.",
      _makeAvailable: [{ type: "resourcenum", resource: "pixel", num: 3 }],
      _affordable: [{ type: "resourcenum", resource: "click", num: 5 }],
      _buy: "buyredgluttony"
    },{
      label: "redgluttony2",
      type: "mod",
      name: "Further Reduce Gluttony",
      description: "Well, that didn't work... Turns out some of your pixels just got hungrier.  Maybe we should cull the hungry ones?",
      _makeAvailable: [{ type: "modstatus", mod: "redgluttony" }],
      // This affordable isn't going to work right, because it's not auto-updating.
      //_affordable: [{ type: "resourcenum", resource: "pixel", num: Math.pow(2, 16 / Pixpls.Generators.list["pixel"].costPower)}],
      _affordable: [{ type: "resourcenum", resource: "pixel", num: 16 }], // This isn't the auto-magical part.  We'll see if we can fix that later.
      _buy: "buyredgluttony2"
    },{
      label: "clickchef",
      type: "mod",
      name: "Click Preparation",
      description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
      _makeAvailable: [{ type: "resourcenumlost", resource: "pixel", num: 4 }],
      _affordable: [
        { type: "resourcenum", resource: "click", num: 5 },
        { type: "resourcenum", resource: "pixel", num: 1 }
      ],
      _buy: "buyclickchef"
    },{
      label: "clickchef2",
      type: "mod",
      name: "Click Preparation II",
      description: "Your chef is obviously overworked.  Maybe you should hire someone to assist him.",
      _makeAvailable: [
        { type: "resourcenumlost", resource: "pixel", num: 6 },
        { type: "modstatus", mod: "clickchef" }
      ],
      _affordable: [
        { type: "resourcenum", resource: "click", num: 25 },
        { type: "resourcenum", resource: "pixel", num: 1 }
      ],
      _buy: "buyclickchef2"
    },{ //B7UmUX68KtE
      label: "clickchef3",
      type: "mod",
      name: "Click Preparation III",
      description: "Just two can't provide for all your Pixpls!  You better hire something to prepare the clicks for your chef staff.",
      _makeAvailable: [
        { type: "resourcenumlost", resource: "pixel", num: 10 },
        { type: "modstatus", mod: "clickchef2" }
      ],
      _affordable: [
        { type: "resourcenum", resource: "click", num: 125 },
        { type: "resourcenum", resource: "pixel", num: 1 }
      ],
      _buy: "buyclickchef3"
    },{
      label: "pixelfarm",
      type: "mod",
      name: "Pixel Farming",
      description: "The chefs aren't keeping up.  Maybe another approach.  Can the pixels make their own food?",
      _makeAvailable: [
        { type: "resourcenumlost", resource: "pixel", num: 20 },
        { type: "modstatus", mod: "clickchef3" }
      ],
      _affordable: [
        { type: "resourcenum", resource: "click", num: 625 },
        { type: "resourcenum", resource: "pixel", num: 1 }
      ],
      _buy: "buypixelfarm"
    },{
      label: "renrate",
      type: "mod",
      name: "Renderers",
      description: "Those Renderers are sloooooooooow.  Maybe we can speed them up?",
      _makeAvailable: [{ type: "resourcenum", resource: "renderer", num: 1 }],
      _affordable: [
        { type: "resourcenum", resource: "renderer", num: 2 },
        { type: "resourcenum", resource: "pixel", num: 5 }
      ],
      _buy: "buyrenrate"
    },{
      label: "renrate2",
      type: "mod",
      name: "Rendererers",
      description: "Doubling is Ok.  But can we emit pixels at a faster rate?",
      _makeAvailable: [{ type: "resourcenum", resource: "renderer", num: 3 }],
      _affordable: [
        { type: "resourcenum", resource: "renderer", num: 3 },
        { type: "resourcenum", resource: "pixel", num: 5 },
        { type: "modstatus", mod: "renrate" }
      ],
      _buy: "buyrenrate2"
    },{
      label: "renrate3",
      type: "mod",
      name: "Rerendererers",
      description: "Is this like a prophxlactic?  Maybe we can...",
      _makeAvailable: [{ type: "resourcenum", resource: "renderer", num: 10 }],
      _affordable: [
        { type: "resourcenum", resource: "renderer", num: 10 },
        { type: "resourcenum", resource: "pixel", num: 5 },
        { type: "modstatus", mod: "renrate2" }
      ],
      _buy: "buyrenrate3"
    },{
      label: "renrate4",
      type: "mod",
      name: "Renderers the Next Generation",
      description: "We should start from scratch.  We've learned a lot.  Will the next generation work better?",
      _makeAvailable: [{ type: "resourcenum", resource: "renderer", num: 10 }],
      _affordable: [
        { type: "resourcenum", resource: "renderer", num: 10 },
        { type: "resourcenum", resource: "pixel", num: 10 },
        { type: "modstatus", mod: "renrate3" }
      ],
      _buy: "buyrenrate4"
    },

    //Hidden Mods
    {
      label: "showgenerator",
      type: "hidden",
      name: "Show Generator Menu",
      description: "This should be hidden, but it will enable the generator menu after a short time.",
      _makeAvailable: [{ type: "time", num: 10 }],
      _buy: "buyshowgenerator"
    },{
      label: "showpixelgen",
      type: "hidden",
      name: "Show Pixels Generator",
      description: "Display an entry in the generators menu for Pixels.",
      _makeAvailable: [{ type: "resourcenum", resource: "click", num: 5 }],
      _buy: "buyshowpixelgen"
    },{
      label: "showrenderergen",
      type: "hidden",
      name: "Show Renderers Generator",
      description: "Display an entry in the generators menu for Renderers.",
      _makeAvailable: [{ type: "resourcenum", resource: "pixel", num: 5 }],
      _buy: "buyshowrenderergen"
    },{
      label: "showextrudergen",
      type: "hidden",
      name: "Show Extruders Generator",
      description: "Display an entry in the generators menu for Extruders.",
      _makeAvailable: [{ type: "resourcenum", resource: "renderer", num: 5 }],
      _buy: "buyshowextrudergen"
    },{
      label: "showelectronicskitgen",
      type: "hidden",
      name: "Show Electronics Kit Generator",
      description: "Display an entry in the generators menu for Electronics Kits.",
      _makeAvailable: [{ type: "resourcenum", resource: "extruder", num: 5 }],
      _buy: "buyshowelectronicskitgen"
    },{
      label: "showfactorygen",
      type: "hidden",
      name: "Show Factory Generator",
      description: "Display an entry in the generators menu for Factories.",
      _makeAvailable: [{ type: "resourcenum", resource: "electronicskit", num: 5 }],
      _buy: "buyshowfactorygen"
    },{
      label: "showcementprintergen",
      type: "hidden",
      name: "Show Cement Printer Generator",
      description: "Display an entry in the generators menu for Cement Printers.",
      _makeAvailable: [{ type: "resourcenum", resource: "factory", num: 5 }],
      _buy: "buyshowcementprintergen"
    },{
      label: "showdesignlabgen",
      type: "hidden",
      name: "Show Design Lab Generator",
      description: "Display an entry in the generators menu for Design Labs.",
      _makeAvailable: [{ type: "resourcenum", resource: "cementprinter", num: 5 }],
      _buy: "buyshowdesignlabgen"
    },{
      label: "showaigen",
      type: "hidden",
      name: "Show AI Generator",
      description: "Display an entry in the generators menu for AIs.",
      _makeAvailable: [{ type: "resourcenum", resource: "designlab", num: 5 }],
      _buy: "buyshowaigen"
    },{
      label: "showmods",
      type: "hidden",
      name: "Show Mods",
      descripton: "This wil make the mods available when there are some.",
      _makeAvailable: [
        { type: "time", num: 20 },
        { type: "stringmap", function: "availablemods" },
      ],
      _buy: "buyshowmods"
    },{
      label: "showtabs",
      type: "hidden",
      name: "Show Tab Menu",
      description: "This will begins unlocking the second phase of the game.",
      _makeAvailable: "returnFalse",
      _buy: "buyshowtabs"
    }
  ],
  functionList: {
    // Defaults
    returnFalse: function(m) {
      return false;
    },
    returnTrue: function(m) {
      return true;
    },
    defaultBuy: function(m) {
      new Log("Bought " + m.name + "!");
    },
    devMode: function(m) {
      return Pixpls.devMode;
    },

    // Available Functions
    // availredgluttony: function(m) {
    //   return Pixpls.Generators.list["pixel"].num >= 3; },
    // availredgluttony2: function(m) {
    //   return Pixpls.Mods.purchased("redgluttony"); },
    // availclickchef: function(m) {
    //   return Pixpls.Generators.list["pixel"].numLost >= 4; },
    // availclickchef2: function(m) {
    //   return Pixpls.Generators.list["pixel"].numLost >= 6 &&
    //   Pixpls.Mods.purchased("ClickChef"); },
    // availclickchef3: function(m) { return Pixpls.Generators.list["pixel"].numLost >= 10 && Pixpls.Mods.purchased("ClickChef2"); },
    // availpixelfarm: function(m) {
    //   return Pixpls.Generators.list["pixel"].numLost >= 20 &&
    //   Pixpls.Mods.purchased("ClickChef2") && purchased("ClickChef3"); },
    // availrenrate: function(m) {
    //   return Pixpls.Generators.list["renderer"].num >= 1; },
    // availrenrate2: function(m) { return Pixpls.Generators.list["renderer"].num >= 3; },
    // availrenrate3: function(m) { return Pixpls.Generators.list["renderer"].num >= 10; },
    // availrenrate4: function(m) { return Pixpls.Generators.list["renderer"].num >= 10; },
    // availshowgenerator: function(m) { return Pixpls.numTicks >= 10; },
    // availshowpixelgen: function(m) { return Pixpls.resourceList["pixel"].produceTarget.num >= 5; },
    // availshowrenderergen: function(m) { return Pixpls.resourceList["renderer"].produceTarget.num >= 5; },
    // availshowextrudergen: function(m) { return Pixpls.resourceList["extruder"].produceTarget.num >= 5; },
    // availshowelectronicskitgen: function(m) { return Pixpls.resourceList["electronicskit"].produceTarget.num >= 5; },
    // availshowfactorygen: function(m) { return Pixpls.resourceList["factory"].produceTarget.num >= 5; },
    // availshowcementprintergen: function(m) { return Pixpls.resourceList["cementprinter"].produceTarget.num >= 5; },
    // availshowdesignlabgen: function(m) { return Pixpls.resourceList["designlab"].produceTarget.num >= 5; },
    // availshowaigen: function(m) { return Pixpls.resourceList["ai"].produceTarget.num >= 5; },
    // availshowmods: function(m) {
    //   return Pixpls.Mods.availableMods !== {} &&
    //   Pixpls.numTicks >= 20 &&
    //   $("#generators:visible"); },
    availablemods: function(m) {
      return true; // I need to change this to a function scanning the resource list for if there's one available... but I may change things before then.
    },

    // Affordable Functions
    // affordredgluttony: function() {
    //   return Pixpls.Generators.list["click"].num >= 5; },
    // affordredgluttony2: function() {
    //   return Pixpls.Generators.list["pixel"].num > Math.pow(2, 16 / Pixpls.Generators.list["pixel"].costPower); },
    // affordclickchef: function() {
    //   return Pixpls.Generators.list["click"].num >= 5 &&
    //   Pixpls.Generators.list["pixel"].num >= 1; },
    // affordclickchef2: function() {
    //   return Pixpls.Generators.list["click"].num >= 25 &&
    //   Pixpls.Generators.list["pixel"].num >= 1; },
    // affordclickchef3: function() {
    //   return Pixpls.Generators.list["click"].num >= 125 &&
    //   Pixpls.Generators.list["pixel"].num >= 1; },
    // affordpixelfarm: function() {
    //   return Pixpls.Generators.list["click"].num >= 1000 &&
    //   Pixpls.Generators.list["pixel"].num >= 1; },
    // affordrenrate: function() {
    //   return Pixpls.Generators.list["renderer"].num >= 2 &&
    //   Pixpls.Generators.list["pixel"].num >= 5; },
    // affordrenrate2: function() {
    //   return Pixpls.Generators.list["renderer"].num >= 3 &&
    //   Pixpls.Generators.list["pixel"].num >= 5 &&
    //   Pixpls.Generators.purchased("RenRate2"); },
    // affordrenrate3: function() {
    //   return Pixpls.Generators.list["renderer"].num >= 10 &&
    //   Pixpls.Generators.list["pixel"].num >= 5 &&
    //   Pixpls.Generators.purchased("RenRate2"); },
    // affordrenrate4: function() {
    //   return Pixpls.Generators.list["renderer"].num >= 2 &&
    //   Pixpls.Generators.list["pixel"].num >= 10 &&
    //   Pixpls.Generators.purchased("RenRate3"); },

    //Buy Functions
    buyuselessupgrade: function (m) {
      Pixpls.Mods.purchaseMod(m);
      new Log({message: "Bought a useless upgrade!  Go you!"});
    },
    buydebugclicks: function (m) { // I could add a .params to the mod, and pass it to these?
      Pixpls.resources["click"].num += 10000000;
    },
    buydebugpixels: function (m) {
      Pixpls.resources["pixel"].num += 1000;
    },
    buyredgluttony: function (m) {
      Pixpls.Generators.list["click"].num -= 10;
      Pixpls.Generators.list["pixel"].costPower = 16;
      Object.defineProperty(Pixpls.Generators.list["pixel"], "cost", {
        get: function() { return Math.pow( Math.floor(Pixpls.Generators.list["pixel"].num), Pixpls.Generators.list["pixel"].costPower ) + 1; },
        configurable: true
      });
      m.description = "The pixels are still eating the same amount.  You're just producing more efficiently.";
      m.updateDescription();
      new Log({message: "Ohhhh!  You were using an inverse phase relation on your mouse.  We'll filter out those Star Trekian woes.  That will make clicks more nutritious."});
      Pixpls.Mods.purchaseMod(m);
    },
    buyredgluttony2: function(m) {
      Pixpls.Generators.list["pixel"].num /= 2;
      Pixpls.Generators.list["pixel"].costPower /= 2;
      m.description = "Better.  Turns out Pixel Darwinism is working.  Try again!";
      m.updateDescription();
      new Log({message: "*Jargon* *Jargon* Fun fact: In Star Trek scripts, they just wrote 'Jargon' and they got really good at making stuff up.  Pixel cost reduced to power " + Pixpls.Generators.list["pixel"].costPower + "." });
      if (Pixpls.Generators.list["pixel"].costPower <= 2) {
        Pixpls.Mods.purchaseMod(m);
        this.description = "Did you hear the one about the farmer who tried to train his horse to eat a single oat a day?  It worked until the stupid horse up and died.  Probably don't want to repeat that experiment."
      }
    },
    buyclickchef: function(m) {
      Pixpls.Generators.list["click"].num -= 5;
      Pixpls.Generators.list["pixel"].num -= 1;
      m.description = "Happy Chef!  He chops and sizzles pixels into a tasty slurry.  But you understand little of what he says.";
      m.updateDescription();
      new Log({message: "One pixel reassigned to cheffery."});
      if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
        Pixpls.Generators.list["pixel"].baseProduce /= 10;
      } else {
        Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
      }
      Pixpls.Mods.purchaseMod(m);
    },
    buyclickchef2: function(m) {
      Pixpls.Generators.list["click"].num -= 25;
      Pixpls.Generators.list["pixel"].num -= 1;
      m.description = "Bork! Bork! Bork! Doesn't seem very effective, but the Chef is sure more productive, somehow.";
      m.updateDescription();
      new Log({message: "One pixel reassigned to chef assistantery."});
      if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
        Pixpls.Generators.list["pixel"].baseProduce /= 10;
      } else {
        Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
      }
      Pixpls.Mods.purchaseMod(m);
    },
    buyclickchef3: function(m) {
      Pixpls.Generators.list["click"].num -= 125;
      Pixpls.Generators.list["pixel"].num -= 1;
      m.description = "Makin' di Popedicorn! Shrimpies!  Shrimpies?  Shrimpies!  B7UmUX68KtE";
      m.updateDescription();
      new Log({message: "One pixel reassigned to uhhh... Shrimpies?"});
      if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
        Pixpls.Generators.list["pixel"].baseProduce /= 10;
      } else {
        Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
      }
      Pixpls.Mods.purchaseMod(m);
    },
    buypixelfarm: function(m) {
      Pixpls.Generators.list["click"].num -= 1000;
      Pixpls.Generators.list["pixel"].num -= 1;
      m.description = "You refactor some of your clicks as seeds.  One lonely pixel is responsible for their farming.";
      m.updateDescription();
      new Log({message: "Agriclicktural revolution?  Boundless wealth will soon be <s>theirs</s> yours!"});
      if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
        Pixpls.Generators.list["pixel"].baseProduce *= -1;
      } else {
        Pixpls.Generators.list["pixel"].baseProduce *= 10;
      }
      Pixpls.Mods.purchaseMod(m);
    },
    buyrenrate: function(m) {
      Pixpls.Generators.list["pixel"].num -= 5;
      Pixpls.Generators.list["renderer"].num /= 2;
      m.description = "If we combine them together, it turns out they produce twice as fast!";
      m.updateDescription();
      new Log({message: "Combining things willy nilly like that just seems... icky."});
      Pixpls.Generators.list["renderer"].baseProduce *= 2;
      Pixpls.Mods.purchaseMod(m);
    },
    buyrenrate2: function(m) {
      Pixpls.Generators.list["pixel"].num -= 5;
      Pixpls.Generators.list["renderer"].num /= 3;
      m.description = "Cool, it turns out these renderers will just sort of adhere to each other.  But they're getting bulky.";
      m.updateDescription();
      new Log({message: "A six-fold improvement!  Well, over the original."});
      Pixpls.Generators.list["renderer"].baseProduce *= 2;
      Pixpls.Mods.purchaseMod(m);
    },
    buyrenrate3: function(m) {
      Pixpls.Generators.list["pixel"].num -= 5;
      Pixpls.Generators.list["renderer"].num /= 10;
      m.description = "Now we're getting somewhere!  Orders of magnitude!";
      m.updateDescription();
      new Log({message: "Don't encourage the pixels, encourage the pixelators!"});
      Pixpls.Generators.list["renderer"].baseProduce *= 2;
      Pixpls.Mods.purchaseMod(m);
    },
    buyrenrate4: function(m) {
      Pixpls.Generators.list["pixel"].num -= 5;
      Pixpls.Generators.list["renderer"].num = 0;
      m.description = "This generation of renderers seems much more effective.  Also, they smell better.";
      m.updateDescription();
      new Log({message: "Scorched Earth!  But maybe you should see how the new renderers work!"});
      Pixpls.Generators.list["renderer"].baseProduce = 1;
      Pixpls.Mods.purchaseMod(m);
    },
    buyshowgenerator: function(m) { // We need to come up with a way to pass args...
      $("#generators").show();
    },
    buyshowpixelgen: function(m) {
      Pixpls.resourceList["pixel"].li.show();
    },
    buyshowrenderergen: function(m) {
      Pixpls.resourceList["renderer"].li.show();
    },
    buyshowextrudergen: function(m) {
      Pixpls.resourceList["extruder"].li.show();
    },
    buyshowelectronicskitgen: function(m) {
      Pixpls.resourceList["electronicskit"].li.show();
    },
    buyshowfactorygen: function(m) {
      Pixpls.resourceList["factory"].li.show();
    },
    buyshowcementprintergen: function(m) {
      Pixpls.resourceList["cementprinter"].li.show();
    },
    buyshowdesignlabgen: function(m) {
      Pixpls.resourceList["designlab"].li.show();
    },
    buyshowaigen: function(m) {
      Pixpls.resourceList["ai"].li.show();
    },
    buyshowmods: function(m) {
      $(".mods").show();
    },
    buyshowtabs: function(m) {
      // something something something show tabs...
    }
  }
}
