function Mod (params) {
  this.name = params.name || "";
  this.label = params.label || "";
  this.description = params.description || "";

  var t = this;
  this.makeAvailable = params.makeAvailable || function() { return false; };
  this.affordable = params.affordable || function() { return true; };
  this.buy = params.buy || function() { new Log({message: "Bought " + t.name + "."}); };

  this.div = $("<div />");
  this.div.addClass(this.label);
  this.buttonSpan = $("<span />");
  this.buttonSpan.addClass("buttonSpan");
  this.button = $("<button />");
  this.button.html("Buy!");
  this.notButton = $("<s />");
  this.notButton.html("Buy");

  this.render();
};
Mod.prototype.update = function() {
  if ( this.affordable()) {
    this.notButton.css({display: "none"});
    this.button.css({display: "block"});
    //this.notButton.hide();
    //this.button.show();
  }
  if ( !this.affordable()) {
    this.notButton.css({display: "inline"});
    this.button.css({display: "none"});
    // this.notButton.show(); // Show and hide keep freaking out... but why?
    // this.button.hide();
  }
};
Mod.prototype.render = function() {
  this.div.html("<p>" + this.name + "</p>");
  this.div.append("<p>" + this.description + "</p>");
  this.div.append(this.buttonSpan);

  this.buttonSpan.append(this.button);
  this.buttonSpan.append(this.notButton);

  if (this.buy) {
    var t = this;
    this.buttonSpan.on( "click", "button", function() { t.buy(); t.render(); } );
  }

  this.update();
};

var Mods = {
  update: function() {
    for (var i = 0; i < this.unavailableMods.length; i++) {
      if (this.unavailableMods[i].makeAvailable()) {
        this.displayMod(this.unavailableMods[i]);
      }
    }

    for (var i = 0; i < this.availableMods.length; i++) {
      this.availableMods[i].update();
    }

    if (this.availableMods.length == 0) {
      this.divAvailable.hide();
    } else {
      this.divAvailable.show();
    }

    if (this.purchasedMods.length == 0) {
      this.divPurchased.hide();
    } else {
      this.divPurchased.show();
    }
  },
  render: function() {
    this.div = $("<div />"); // Should I just define this as div: $("<div class="mods" />"); ?
    this.div.addClass("mods");

    this.divAvailable = $("<div />");
    this.divAvailable.addClass("available");
    this.divAvailable.append("<h4>Available</h4>");

    this.divPurchased = $("<div />");
    this.divPurchased.addClass("purchased");
    this.divPurchased.append("<h4>Purchased</h4>");

    this.div.append(this.divAvailable);
    this.div.append(this.divPurchased);

    $(".mods").replaceWith(this.div);
  },

  displayMod: function(mod) {
    var index;
    for (index = 0; index < this.unavailableMods.length; index++) {
      if (mod.label == this.unavailableMods[index].label) {
        break;
      }
    }

    if (index < 0 || index > this.unavailableMods.length) {
      console.log ("We have a problem.  " + mod.name + " is trying to display, but is not in unavailableMods.");
      return;
    }

    this.unavailableMods.splice(index, 1);
    this.availableMods.push(mod);

    mod.render();
    this.divAvailable.append(mod.div);
  },
  purchaseMod: function(mod) {
    var index;
    for (index = 0; index < this.availableMods.length; index++) {
      if (mod.label == this.availableMods[index].label) {
        break;
      }
    }

    if (index < 0 || index >= this.availableMods.length) {
      console.log ("We have a problem.  " + mod.name + " is trying to purchase, but is not in availableMods.");
      return;
    }

    this.availableMods.splice(index, 1);
    this.purchasedMods.push(mod);

    mod.div.detach();
    mod.buttonSpan.hide();
    this.divPurchased.append(mod.div);
  },

  purchased: function(modLabel) {
    for (var i = 0; i < this.purchasedMods.length; i++) {
      if (this.purchasedMods[i].label == modLabel) {
        return true;
      }
    }

    return false;
  },

  unavailableMods: [
    new Mod({
      name: "Test Upgrade",
      label: "UselessUpgrade",
      description: "Just checking to see if the upgrade display is working.",
      makeAvailable: function() {return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function () {
        Mods.purchaseMod(this);
        new Log({message: "Bought a useless upgrade!  Go you!"});
      }
    }),
    new Mod({
      name: "Check Clicks",
      label: "DebugClicks",
      description: "Add 10,000,000 clicks.",
      makeAvailable: function() { return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function() {
        Generators["click"].num += 10000000;
      }
    }),
    new Mod({
      name: "Check Pixels",
      label: "DebugPixels",
      description: "Add 1,000 pixels.",
      makeAvailable: function() { return Pixpls.devMode; },
      affordable: function() { return true; },
      buy: function() {
        Generators["pixel"].num += 1000;
      }
    }),
    new Mod({
      name: "Reduce Gluttony",
      label: "RedGluttony",
      description: "Those pixels seem to be eating an inordinate amount.  Maybe you're clicking wrong?  This will train you.",
      makeAvailable: function() { return Generators["pixel"].num >= 3; },
      affordable: function() { return Generators["click"].num >= 10; },
      buy: function() {
        Generators["click"].num -= 10;
        Generators["pixel"].costPower = 16;
        Object.defineProperty(Generators["pixel"], "cost", {
          get: function() { return Math.pow( Math.floor(Generators["pixel"].num), Generators["pixel"].costPower ) + 1; },
          configurable: true
        });
        this.description = "The pixels are still eating the same amount.  You're just producing more efficiently.";
        new Log({message: "Ohhhh!  You were using an inverse phase relation on your mouse.  We'll filter out those Star Trekian woes.  That will make clicks more nutritious."});
        Mods.purchaseMod(this);
      }
    }),
    new Mod({
      name: "Further Reduce Gluttony",
      label: "RedGluttony2",
      description: "Well, that didn't work... Turns out some of your pixels just got hungrier.  Maybe we should cull the hungry ones?",
      makeAvailable: function() { return Mods.purchased("RedGluttony"); },
      affordable: function() { return Generators["pixel"].num > Math.pow(2, 16 / Generators["pixel"].costPower); }, // I think this cost goes up too fast.
      buy: function() {
        Generators["pixel"].num /= 2;
        Generators["pixel"].costPower /= 2;
        this.description = "Better.  Turns out Pixel Darwinism is working.  Try again!";
        new Log({message: "*Jargon* *Jargon* Fun fact: In Star Trek scripts, they just wrote 'Jargon' and they got really good at making stuff up.  Pixel cost reduced to power " + Generators["pixel"].costPower + "." });
      }
    }),
    new Mod({
      name: "Click Preparation",
      label: "ClickChef",
      description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
      makeAvailable: function() { return Generators["pixel"].numLost >= 4; },
      affordable: function() { return Generators["click"].num >= 10 && Generators["pixel"].num >= 1; },
      buy: function() {
        Generators["click"].num -= 10;
        Generators["pixel"].num -= 1;
        this.description = "Happy Chef!  He chops and sizzles pixels into a tasty slurry.  But you understand little of what he says.";
        new Log({message: "One pixel reassigned to cheffery."});
        if (Generators["pixel"].baseProduce < 0) {
          Generators["pixel"].baseProduce /= 10;
        } else {
          Generators["pixel"].baseProduce *= 1.1;
        }
        Mods.purchaseMod(this);
      }
    }),
    new Mod({
      name: "Click Preparation II",
      label: "ClickChef2",
      description: "Your chef is obviously overworked.  Maybe you should hire someone to assist him.",
      makeAvailable: function() { return Generators["pixel"].numLost >= 6 && Mods.purchased("ClickChef"); },
      affordable: function() {return Generators["click"].num >= 100 && Generators["pixel"].num >= 1; },
      buy: function() {
        Generators["click"].num -= 100;
        Generators["pixel"].num -= 1;
        this.description = "Bork! Bork! Bork! Doesn't seem very effective, but the Chef is sure more productive, somehow.";
        new Log({message: "One pixel reassigned to chef assistantery."});
        if (Generators["pixel"].baseProduce < 0) {
          Generators["pixel"].baseProduce /= 10;
        } else {
          Generators["pixel"].baseProduce *= 1.1;
        }
        Mods.purchaseMod(this);
      }
    }),
    new Mod({ //B7UmUX68KtE
      name: "Click Preparation III",
      label: "ClickChef3",
      description: "Just two can't provide for all your Pixpls!  You better hire something to prepare the clicks for your chef staff.",
      makeAvailable: function() { return Generators["pixel"].numLost >= 10 && Mods.purchased("ClickChef2"); },
      affordable: function() {return Generators["click"].num >= 1000 && Generators["pixel"].num >= 1; },
      buy: function() {
        Generators["click"].num -= 1000;
        Generators["pixel"].num -= 1;
        this.description = "Makin' di Popedicorn! Shrimpies!  Shrimpies?  Shrimpies!  B7UmUX68KtE";
        new Log({message: "One pixel reassigned to uhhh... Shrimpies?"});
        if (Generators["pixel"].baseProduce < 0) {
          Generators["pixel"].baseProduce /= 10;
        } else {
          Generators["pixel"].baseProduce *= 1.1;
        }
        Mods.purchaseMod(this);
      }
    }),
    new Mod({
      name: "Pixel Farming",
      label: "PixelFarm",
      description: "The chefs aren't keeping up.  Maybe another approach.  Can the pixels make their own food?",
      makeAvailable: function() { return Generators["pixel"].numLost >= 20 && Mods.purchased("ClickChef2"); },
      affordable: function() {return Generators["click"].num >= 1000 && Generators["pixel"].num >= 1; },
      buy: function() {
        Generators["click"].num -= 1000;
        Generators["pixel"].num -= 1;
        this.description = "You refactor some of your clicks as seeds.  One lonely pixel is responsible for their farming.";
        new Log({message: "Agriclicktural revolution?  Boundless wealth will soon be <s>theirs</s> yours!"});
        if (Generators["pixel"].baseProduce < 0) {
          Generators["pixel"].baseProduce *= -1;
        } else {
          Generators["pixel"].baseProduce *= 10;
        }
        Mods.purchaseMod(this);
      }
    })
  ],
  availableMods: [],
  purchasedMods: [],
  hiddenMods: []
}

/*var upgrades = [
  {
    name: "Churn Reduction",
    label: "Make a Space",
    description: "It sure is annoying trying to keep track of those flickering buttons.  If we dedicated some space to them, that might be nice.",
    bought: false,
    buy: function() {
      /// ??? This is the part I need to figure out.
      // It's going to affect the ng-show of this, and I'll need to add upgrades to stuff.
    }
  },
  {
    name: "Display Generator Menu",
    label: "",
    description: "What's this menu for?",
  },
  {
    name: "Display Hero Menu",
    label: "",
    description: "More than one menu?!  That's suggestive!",
  }
];
*/
