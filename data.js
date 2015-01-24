Pixpls.Data = {
  init: function() {
    // Generators Init

    for (key in this.Generators) {
      new Generator(this.Generators[key]);
    }

    // Mods Init
    for (key in this.Mods) {
      new Mod(this.Mods[key]);
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
      baseCost: 0
    },
    pixel: {
      key: "pixel",
      name: "Pixel",
      label: "PGen",
      _produceTarget: "click",
      _costTarget: "click",
      baseProduce: -1,
      flavorText: "Little dots that shine?  Fantastic!"
    },
    renderer: {
      key: "renderer",
      name: "Renderer",
      label: "RGen",
      num: 0,
      _produceTarget: "pixel",
      _costTarget: "pixel",
      baseProduce: 0.0005,
      flavorText: "All we have to do is make more pixels?  That doesn't seem so hard."
    },
    extruder: {
      key: "extruder",
      name: "Extruder",
      label: "EGen",
      _produceTarget: "renderer",
      _costTarget: "renderer",
      baseProduce: 0.0005,
      flavorText: "Imagine a snail leaving behind a sticky residue.  It's gross.  Actually, it's not like that.  But it's still gross."
    },
    electronicskit: {
      key: "electronicskit",
      name: "Electronics Kit",
      label: "EKGen",
      _produceTarget: "extruder",
      _costTarget: "extruder",
      baseProduce: 0.0005,
      flavorText: "A virtual toolbox for making more virtual stuff.  Makes sense."
    },
    factory: {
      key: "factory",
      name: "Factory",
      label: "FGen",
      _produceTarget: "electronicskit",
      _costTarget: "electronicskit",
      baseProduce: 0.0005,
      flavorText: "Making things by hand is so 18th centicycle.  They work better when we make them en masse.  That's French for en masse."
    },
    cementprinter: {
      key: "cementprinter",
      name: "Cement Printer",
      label: "CPGen",
      _produceTarget: "factory",
      _costTarget: "factory",
      baseProduce: 0.0005,
      flavorText: "Virtual Factories are made out of virtual cement.  That's the secret ingredient.  The other secret ingredient is virtual secrets."
    },
    designlab: {
      key: "designlab",
      name: "Design Lab",
      label: "DLGen",
      _produceTarget: "cementprinter",
      _costTarget: "cementprinter",
      baseProduce: 0.0005,
      flavorText: "It's not so much useful as a place to put all those hipxlsters."
    },
    ai: {
      key: "ai",
      name: "AI",
      label: "AIGen",
      _produceTarget: "designlab",
      _costTarget: "designlab",
      baseProduce: 0.0005,
      flavorText: "Everybody run away from the singularity!"
    }
  },

  Mods: {
    UselessUpgrade: {
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
    DebugClicks: {
      name: "Check Clicks",
      label: "DebugClicks",
      description: "Add 10,000,000 clicks.",
      makeAvailable: function() { return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function() {
        Pixpls.Generators.list["click"].num += 10000000;
      }
    },
    DebugPixels: {
      name: "Check Pixels",
      label: "DebugPixels",
      description: "Add 1,000 pixels.",
      makeAvailable: function() { return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function() {
        Pixpls.Generators.list["pixel"].num += 1000;
      }
    },
    RedGluttony: {
      name: "Reduce Gluttony",
      label: "RedGluttony",
      description: "Those pixels seem to be eating an inordinate amount.  Maybe you're clicking wrong?  This will train you.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].num >= 3; },
      affordable: function() { return Pixpls.Generators.list["click"].num >= 5; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 10;
        Pixpls.Generators.list["pixel"].costPower = 16;
        Object.defineProperty(Pixpls.Generators.list["pixel"], "cost", {
          get: function() { return Math.pow( Math.floor(Pixpls.Generators.list["pixel"].num), Pixpls.Generators.list["pixel"].costPower ) + 1; },
          configurable: true
        });
        this.description = "The pixels are still eating the same amount.  You're just producing more efficiently.";
        this.updateDescription();
        new Log({message: "Ohhhh!  You were using an inverse phase relation on your mouse.  We'll filter out those Star Trekian woes.  That will make clicks more nutritious."});
        Pixpls.Mods.purchaseMod(this);
      }
    },
    RedGluttony2: {
      name: "Further Reduce Gluttony",
      label: "RedGluttony2",
      description: "Well, that didn't work... Turns out some of your pixels just got hungrier.  Maybe we should cull the hungry ones?",
      makeAvailable: function() { return Pixpls.Mods.purchased("RedGluttony"); },
      // It's checking if it's affordable, but it's not displaying the buy button on load.
      affordable: function() { return Pixpls.Generators.list["pixel"].num > Math.pow(2, 16 / Pixpls.Generators.list["pixel"].costPower); }, // I think this cost goes up too fast.
      buy: function() {
        Pixpls.Generators.list["pixel"].num /= 2;
        Pixpls.Generators.list["pixel"].costPower /= 2;
        this.description = "Better.  Turns out Pixel Darwinism is working.  Try again!";
        this.updateDescription();
        new Log({message: "*Jargon* *Jargon* Fun fact: In Star Trek scripts, they just wrote 'Jargon' and they got really good at making stuff up.  Pixel cost reduced to power " + Pixpls.Generators.list["pixel"].costPower + "." });
        if (Pixpls.Generators.list["pixel"].costPower <= 2) {
          Pixpls.Mods.purchaseMod(this);
          this.description = "Did you hear the one about the farmer who tried to train his horse to eat a single oat a day?  It worked until the stupid horse up and died.  Probably don't want to repeat that experiment."
        }
      }
    },
    ClickChef: {
      name: "Click Preparation",
      label: "ClickChef",
      description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 4; },
      affordable: function() { return Pixpls.Generators.list["click"].num >= 5 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 5;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "Happy Chef!  He chops and sizzles pixels into a tasty slurry.  But you understand little of what he says.";
        this.updateDescription();
        new Log({message: "One pixel reassigned to cheffery."});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce /= 10;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    ClickChef2: {
      name: "Click Preparation II",
      label: "ClickChef2",
      description: "Your chef is obviously overworked.  Maybe you should hire someone to assist him.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 6 && Pixpls.Mods.purchased("ClickChef"); },
      affordable: function() {return Pixpls.Generators.list["click"].num >= 25 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 25;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "Bork! Bork! Bork! Doesn't seem very effective, but the Chef is sure more productive, somehow.";
        this.updateDescription();
        new Log({message: "One pixel reassigned to chef assistantery."});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce /= 10;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    ClickChef3: { //B7UmUX68KtE
      name: "Click Preparation III",
      label: "ClickChef3",
      description: "Just two can't provide for all your Pixpls!  You better hire something to prepare the clicks for your chef staff.",
      makeAvailable: function() { return Pixpls.Generators.list["pixel"].numLost >= 10 && Pixpls.Mods.purchased("ClickChef2"); },
      affordable: function() {return Pixpls.Generators.list["click"].num >= 125 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 125;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "Makin' di Popedicorn! Shrimpies!  Shrimpies?  Shrimpies!  B7UmUX68KtE";
        this.updateDescription();
        new Log({message: "One pixel reassigned to uhhh... Shrimpies?"});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce /= 10;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 1.1;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    PixelFarm: {
      name: "Pixel Farming",
      label: "PixelFarm",
      description: "The chefs aren't keeping up.  Maybe another approach.  Can the pixels make their own food?",
      makeAvailable: function() {
         return Pixpls.Generators.list["pixel"].numLost >= 20 && Pixpls.Mods.purchased("ClickChef2") &&
                purchased("ClickChef3");
        },
      affordable: function() {return Pixpls.Generators.list["click"].num >= 1000 && Pixpls.Generators.list["pixel"].num >= 1; },
      buy: function() {
        Pixpls.Generators.list["click"].num -= 1000;
        Pixpls.Generators.list["pixel"].num -= 1;
        this.description = "You refactor some of your clicks as seeds.  One lonely pixel is responsible for their farming.";
        this.updateDescription();
        new Log({message: "Agriclicktural revolution?  Boundless wealth will soon be <s>theirs</s> yours!"});
        if (Pixpls.Generators.list["pixel"].baseProduce < 0) {
          Pixpls.Generators.list["pixel"].baseProduce *= -1;
        } else {
          Pixpls.Generators.list["pixel"].baseProduce *= 10;
        }
        Pixpls.Mods.purchaseMod(this);
      }
    },
    RenRate: {
      name: "Renderers",
      label: "RenRate",
      description: "Those Renderers are sloooooooooow.  Maybe we can speed them up?",
      makeAvailable: function() { return Pixpls.Generators.list["renderer"].num >= 1; },
      affordable: function() { return Pixpls.Generators.list["renderer"].num >= 2 && Pixpls.Generators.list["pixel"].num >= 5; },
      buy: function() {
        Pixpls.Generators.list["pixel"].num -= 5;
        Pixpls.Generators.list["renderer"].num /= 2;
        this.description = "If we combine them together, it turns out they produce twice as fast!";
        this.updateDescription();
        new Log({message: "Combining things willy nilly like that just seems... icky."});
        Pixpls.Generators.baseProduce *= 2;
        Pixpls.Mods.purchaseMod(this);
      }
    },
    RenRate2: {
      name: "Rendererers",
      label: "RenRate2",
      description: "Doubling is Ok.  But can we emit pixels at a faster rate?",
      makeAvailable: function() { return Pixpls.Generators.list["renderer"].num >= 3; },
      affordable: function() {
        return Pixpls.Generators.list["renderer"].num >= 3
          && Pixpls.Generators.list["pixel"].num >= 5
          && Pixpls.Generators.purchased("RenRate2");
      },
      buy: function() {
        Pixpls.Generators.list["pixel"].num -= 5;
        Pixpls.Generators.list["renderer"].num /= 3;
        this.description = "Cool, it turns out these renderers will just sort of adhere to each other.  But they're getting bulky.";
        this.updateDescription();
        new Log({message: "A six-fold improvement!  Well, over the original."});
        Pixpls.Generators.baseProduce *= 2;
        Pixpls.Mods.purchaseMod(this);
      }
    },
    RenRate3: {
      name: "Rerendererers",
      label: "RenRate3",
      description: "Is this like a prophxlactic?  Maybe we can...",
      makeAvailable: function() { return Pixpls.Generators.list["renderer"].num >= 10; },
      affordable: function() {
        return Pixpls.Generators.list["renderer"].num >= 10
          && Pixpls.Generators.list["pixel"].num >= 5
          && Pixpls.Generators.purchased("RenRate2");
      },
      buy: function() {
        Pixpls.Generators.list["pixel"].num -= 5;
        Pixpls.Generators.list["renderer"].num /= 10;
        this.description = "Now we're getting somewhere!  Orders of magnitude!";
        this.updateDescription();
        new Log({message: "Don't encourage the pixels, encourage the pixelators!"});
        Pixpls.Generators.baseProduce *= 2;
        Pixpls.Mods.purchaseMod(this);
      }
    },
    RenRate4: {
      name: "Renderers the Next Generation",
      label: "RenRate4",
      description: "We should start from scratch.  We've learned a lot.  Will the next generation work better?",
      makeAvailable: function() { return Pixpls.Generators.list["renderer"].num >= 10; },
      affordable: function() {
        return Pixpls.Generators.list["renderer"].num >= 2
          && Pixpls.Generators.list["pixel"].num >= 10
          Pixpls.Generators.purchased("RenRate3");
      },
      buy: function() {
        Pixpls.Generators.list["pixel"].num -= 5;
        Pixpls.Generators.list["renderer"].num = 0;
        this.description = "This generation of renderers seems much more effective.  Also, they smell better.";
        this.updateDescription();
        new Log({message: "Scorched Earth!  But maybe you should see how the new renderers work!"});
        Pixpls.Generators.baseProduce = 1;
        Pixpls.Mods.purchaseMod(this);
      }
    },

    //Hidden Mods
    ShowGenerator: {
      hidden: true,
      name: "Show Generator Menu",
      label: "ShowGenerator",
      description: "This should be hidden, but it will enable the generator menu after a short time.",
      makeAvailable: function() {return Pixpls.numTicks >= 10; },
      buy: function() {
        $("#generators").show();
      }
    },
    ShowMods: {
      hidden: true,
      name: "Show Mods",
      label: "ShowMods",
      descripton: "This wil make the mods available when there are some.",
      makeAvailable: function() {
        return Pixpls.Mods.availableMods !== {} &&
                Pixpls.numTicks >= 20 &&
                $("#generators:visible");
      },
      buy: function() {
        $(".mods").show();
      }
    },
    ShowTabs: {
      hidden: true,
      name: "Show Tab Menu",
      label: "ShowTabs",
      description: "This will begins unlocking the second phase of the game.",
      makeAvailable: function() {
        return false;
      },
      buy: function() {
        // Something something something tab menu...
      }
    }
  }
}
