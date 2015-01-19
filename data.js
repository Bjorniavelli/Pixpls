Pixpls.Data = {
  init: function() {
    // Generators Init
    for (key in this.Generators) {
      Pixpls.Generators.list[key] = new Generator(this.Generators[key]);
    }

    // Mods Init
    for (var i = 0; i < this.Mods.length; i++) {
      new Mod(this.Mods[i]);
    }
    // for (var i = 0; i < this.HiddenMods.length; i++) {
    //   Pixpls.Mods.hiddenMods.push(new Mod(this.HiddenMods[i]));
    // }

    // Logs Init
    new Log({
      message: "Welcome to Pixpls! (ver." + Pixpls.ver + ")"
    });
    new Log({
      message: "This *is* a clicky game.  How about some tasty, endorphin-producing clicking?"
    });
  },

  Generators: {
    click: {
      key: "click",
      name: "Click",
      label: "CGen",
      message: "Click!",
      enabled: true,
      flavorText: "Strangely, they give off an appetizing aroma: Ozone and Umamclicki.",
      cost: 0
    },
    pixel: {
      key: "pixel",
      name: "Pixel",
      label: "PGen",
      produceTarget: "click",
      costTarget: "click",
      produce: -1,
      flavorText: "Little dots that shine?  Fantastic!"
    },
    renderer: {
      key: "renderer",
      name: "Renderer",
      label: "RGen",
      num: 0,
      produceTarget: "pixel",
      costTarget: "pixel",
      produce: 1
    },
    extruder: {
      key: "extruder",
      name: "Extruder",
      label: "EGen",
      produceTarget: "renderer",
      costTarget: "renderer",
      produce: 1
    },
    electronicskit: {
      key: "electronicskit",
      name: "Electronics Kit",
      label: "EKGen",
      produceTarget: "extruder",
      costTarget: "extruder",
      produce: 1
    },
    factory: {
      key: "factory",
      name: "Factory",
      label: "FGen",
      produceTarget: "electronicskit",
      costTarget: "electronicskit",
      produce: 1
    },
    cementprinter: {
      key: "cementprinter",
      name: "Cement Printer",
      label: "CPGen",
      produceTarget: "factory",
      costTarget: "factory",
      produce: 1
    },
    designlab: {
      key: "designlab",
      name: "Design Lab",
      label: "DLGen",
      produceTarget: "cementprinter",
      costTarget: "cementprinter",
      produce: 1
    },
    ai: {
      key: "ai",
      name: "AI",
      label: "AIGen",
      produceTarget: "designlab",
      costTarget: "designlab",
      produce: 1
    }
  },

  Mods: [
    {
      name: "Test Upgrade",
      label: "UselessUpgrade",
      description: "Just checking to see if the upgrade display is working.",
      makeAvailable: function() {return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function () {
        Pixpls.Mods.purchaseMod(this);
        new Log({message: "Bought a useless upgrade!  Go you!"});
      }
    },
    {
      name: "Check Clicks",
      label: "DebugClicks",
      description: "Add 10,000,000 clicks.",
      makeAvailable: function() { return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function() {
        Pixpls.Generators.list["click"].num += 10000000;
      }
    },
    {
      name: "Check Pixels",
      label: "DebugPixels",
      description: "Add 1,000 pixels.",
      makeAvailable: function() { return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function() {
        Pixpls.Generators.list["pixel"].num += 1000;
      }
    },
    {
      name: "Reduce Gluttony",
      label: "RedGluttony",
      description: "Those pixels seem to be eating an inordinate amount.  Maybe you're clicking wrong?  This will train you.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].num >= 3; },
      affordable: function() { return Pixpls.Generators.list["click"].num >= 10; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 10;
        Pixpls.Generators.list["pixel"].costPower = 16;
        Object.defineProperty(Pixpls.Generators.list["pixel"], "cost", {
          get: function() { return Math.pow( Math.floor(Pixpls.Generators.list["pixel"].num), Pixpls.Generators.list["pixel"].costPower ) + 1; },
          configurable: true
        });
        this.description = "The pixels are still eating the same amount.  You're just producing more efficiently.";
        new Log({message: "Ohhhh!  You were using an inverse phase relation on your mouse.  We'll filter out those Star Trekian woes.  That will make clicks more nutritious."});
        Pixpls.Mods.purchaseMod(this);
      }
    },
    {
      name: "Further Reduce Gluttony",
      label: "RedGluttony2",
      description: "Well, that didn't work... Turns out some of your pixels just got hungrier.  Maybe we should cull the hungry ones?",
      makeAvailable: function() { return Pixpls.Mods.purchased("RedGluttony"); },
      affordable: function() { return Pixpls.Generators.list["pixel"].num > Math.pow(2, 16 / Pixpls.Generators.list["pixel"].costPower); }, // I think this cost goes up too fast.
      buy: function() {
        Pixpls.Generators.list["pixel"].num /= 2;
        Pixpls.Generators.list["pixel"].costPower /= 2;
        this.description = "Better.  Turns out Pixel Darwinism is working.  Try again!";
        new Log({message: "*Jargon* *Jargon* Fun fact: In Star Trek scripts, they just wrote 'Jargon' and they got really good at making stuff up.  Pixel cost reduced to power " + Pixpls.Generators.list["pixel"].costPower + "." });
        if (Pixpls.Generators.list["pixel"].costPower <= 2) {
          Pixpls.Mods.purchaseMod(this);
        }
      }
    },
    {
      name: "Click Preparation",
      label: "ClickChef",
      description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 4; },
      affordable: function() { return Pixpls.Generators.list["click"].num >= 10 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 10;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "Happy Chef!  He chops and sizzles pixels into a tasty slurry.  But you understand little of what he says.";
        new Log({message: "One pixel reassigned to cheffery."});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce /= 10;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    {
      name: "Click Preparation II",
      label: "ClickChef2",
      description: "Your chef is obviously overworked.  Maybe you should hire someone to assist him.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 6 && Pixpls.Mods.purchased("ClickChef"); },
      affordable: function() {return Pixpls.Generators.list["click"].num >= 100 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 100;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "Bork! Bork! Bork! Doesn't seem very effective, but the Chef is sure more productive, somehow.";
        new Log({message: "One pixel reassigned to chef assistantery."});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce /= 10;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    { //B7UmUX68KtE
      name: "Click Preparation III",
      label: "ClickChef3",
      description: "Just two can't provide for all your Pixpls!  You better hire something to prepare the clicks for your chef staff.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 10 && Pixpls.Mods.purchased("ClickChef2"); },
      affordable: function() {return Pixpls.Generators.list["click"].num >= 1000 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 1000;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "Makin' di Popedicorn! Shrimpies!  Shrimpies?  Shrimpies!  B7UmUX68KtE";
        new Log({message: "One pixel reassigned to uhhh... Shrimpies?"});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce /= 10;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    {
      name: "Pixel Farming",
      label: "PixelFarm",
      description: "The chefs aren't keeping up.  Maybe another approach.  Can the pixels make their own food?",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 20 && Pixpls.Mods.purchased("ClickChef2"); },
      affordable: function() {return Pixpls.Generators.list["click"].num >= 1000 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 1000;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "You refactor some of your clicks as seeds.  One lonely pixel is responsible for their farming.";
        new Log({message: "Agriclicktural revolution?  Boundless wealth will soon be <s>theirs</s> yours!"});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce *= -1;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 10;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },

    //Hidden Mods
    {
      hidden: true,
      name: "Show Generator Menu",
      label: "ShowGenerator",
      description: "This should be hidden, but it will enable the generator menu after a short time.",
      makeAvailable: function() {return Pixpls.numTicks >= 10; },
      buy: function() {
        $("#generators").show();
      }
    },
    {
      hidden: true,
      name: "Show Mods",
      label: "ShowMods",
      descripton: "This wil make the mods available when there are some.",
      makeAvailable: function() {
        return Pixpls.Mods.availableMods.length > 0 &&
                Pixpls.numTicks >= 20 &&
                $("#generators:visible");
      },
      buy: function() {
        $(".mods").show();
      }
    }
  ]
}
