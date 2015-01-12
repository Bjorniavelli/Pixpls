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
  this.button = $("<button>Buy!</button>");
  if (this.buy) {
    var t = this;
    this.button.click( function() { t.buy(); } );
  }
  this.notButton = $("<s>Buy</s>");
  this.buttonSpan.append(this.notButton);
};
Mod.prototype.update = function() {
  if ( this.affordable() && this.buttonSpan.children(":first").is("s")) {
    this.buttonSpan.html(this.button);
  }
  if ( !this.affordable() && this.buttonSpan.children(":first").is("button")) {
    this.buttonSpan.html(this.notButton);
  }
};
Mod.prototype.render = function() {
  this.div.html("<p>" + this.name + "</p>");
  this.div.append("<p>" + this.description + "</p>");
  this.div.append(this.buttonSpan);

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

    mod.makeAvailable = function() {return false;};
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

    mod.affordable = function() {return false;};
    mod.purchase = function() {};
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
      name: "Reduce Gluttony",
      label: "RedGluttony",
      description: "Those pixels seem to be eating an inordinate amount.  Maybe you're clicking wrong?  This will train you.",
      makeAvailable: function() { return Generators["pixel"].num >= 3; },
      affordable: function() { return Generators["click"].num >= 10; },
      buy: function() {
        Generators["click"].num -= 10;
        this.description = "The pixels are still eating the same amount.  You're just producing more efficiently.";
        new Log({message: "Ohhhh!  You were using an inverse phase relation on your mouse.  We'll filter out those Star Trekian waves.  That will make clicks more nutritious."});
        Mods.purchaseMod(this);
      }
    }),
    new Mod({
      name: "Click Preparation",
      label: "ClickChef",
      description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
      makeAvailable: function() { return Generators["pixel"].numLost >= 4; },
      affordable: function() {
        return Generators["click"].num >= 10 && Generators["pixel"].num >= 1; },
      buy: function() { // t is almost always a shorthand for 'this'.
        Generators["click"].num -= 10;
        this.description = "Happy Chef!  He chops and sizzles pixels into a tasty slurry.  But you understand little of what he says.";
        new Log({message: "One pixel reassigned to cheffery."});
        if (Generators["pixel"].baseProduce < 0) {
          Generators["pixel"].baseProduce /= 10;
        } else {
          Generators["pixel"].baseProduce *= 1.1;
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
  },
  {
    name: "Click Preparation II",
    label: "Click Sous Chef",
    description: "Your chef is obviously overworked.  Maybe you should hire someone to assist him.",
    cost: { medium: tabs[0].items[1], num: 10 },
    bought: false,
    buy: function() {
      this.bought = true;
      if (tabs[0].items[1].produce < 0) tabs[0].items[1].produce /= 10;
    }
  },
  {
    name: "Click Preparation III",
    label: "Click Prep Chef",
    description: "Just two people can't provide for all your Pixpls!  You better hire some to prepare the clicks for your chef staff.",
    cost: { medium: tabs[0].items[1], num: 100 },
    bought: false,
    buy: function() {
      this.bought = true;
      if (tabs[0].items[1].produce < 0) tabs[0].items[1].produce /= 10;
    }
  },
  {
    name: "Pixel Farming",
    label: "Pixel Farming",
    description: "Pixels can farm their own clicks, now!",
    cost: { medium: tabs[0].items[0], num: 1000 },
    bought: false,
    buy: function() {
      this.bought = true;
      if (tabs[0].items[1].produce <= 0) tabs[0].items[1].produce = 0.001;
    }
  },
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
