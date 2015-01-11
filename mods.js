function Mod (params) {
  this.name = params.name || "";
  this.label = params.label || "";
  this.description = params.description || "";

  var t = this;
  this.makeAvailable = params.makeAvailable || function() { return false; };
  this.affordable = params.affordable || function() { return true; };
  this.buy = params.buy || function() { new Log({message: "Bought " + t.name + "."}); };
};
Mod.prototype.display = function() { // This may need to go inside...
  var t = this;
  var index = unavailableMods.indexOf(t);

  if (index < 0 || index > unavailableMods.length) {
    console.log ("We have a problem.  " + t.name + " is trying to display, but is not in unavailableMods.");
    return;
  }

  unavailableMods.splice(index, 1);
  availableMods.push(this);

  renderMods();
};
Mod.prototype.purchase = function() {
  var t = this;

  var index = availableMods.indexOf(t);

  if (index < 0 || index > availableMods.length) {
    console.log ("We have a problem.  " + t.name + " is trying to purchase, but is not in availableMods.");
    return;
  }

  availableMods.splice(index, 1);
  purchasedMods.push(this);

  this.affordable = function() {return false;};
  this.purchase = function() {};

  renderMods();
};
Mod.prototype.render = function(available) {
  var div = $("<div />");
  div.addClass(this.label);

  div.append("<p>" + this.name + "</p>");
  div.append("<p>" + this.description + "</p>");

  if (available) {
    var t = this;
    var button = $("<button>Buy!</button>");
    if (t.buy) button.click(function() { console.log("Bought!"); t.buy(); });
    if ( t.affordable() ) {
      div.append(button);
    } else {
      div.append("<s>Buy</s>");
    }
  }
  this.div = div;
  return div;
}

var renderMods = function() {
  var div = $("<div />");
  div.addClass("mods");

  var divAvailable = $("<div />");
  divAvailable.addClass("available");
  divAvailable.append("<h4>Available</h4>");
  var divPurchased = $("<div />");
  divPurchased.addClass("bought");
  divPurchased.append("<h4>Purchased</h4>");

  for (var i = 0; i < availableMods.length; i++) {
    divAvailable.append(availableMods[i].render(true));
  }
  for (var i = 0; i < purchasedMods.length; i++) {
    divPurchased.append(purchasedMods[i].render(false));
  }

  if (availableMods.length > 0) {
    div.append(divAvailable);
  }
  if (purchasedMods.length > 0) {
    div.append(divPurchased);
  }

  $(".mods").replaceWith(div);
};

var unavailableMods = [
  new Mod({
    name: "Test Upgrade",
    label: "UselessUpgrade",
    description: "Just checking to see if the upgrade display is working.",
    buy: function () { this.purchase(); new Log({message: "Bought a useless upgrade!  Go you!"}); },
    makeAvailable: function() {return true;}
  }),
  new Mod({
    name: "Check Clicks",
    label: "DebugClicks",
    description: "Add 10,000,000 clicks.",
    makeAvailable: function() { return Pixpls.devMode; },
    affordable: function() { return true; },
    buy: function() { Generators["click"].num += 10000000; }
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
      this.purchase();
    }
  })
];
var availableMods = [];
var purchasedMods = [];
var hiddenMods = [];

/*var upgrades = [
  {
  },
  {
    name: "Click Preparation",
    label: "Click Chef",
    description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
    cost: { medium: tabs[0].items[1], num: 1 },
    bought: false,
    buy: function() {
      this.bought = true;
      if (tabs[0].items[1].produce < 0) tabs[0].items[1].produce /= 10;
    }
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
