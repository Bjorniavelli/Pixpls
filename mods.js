function Mod (params) {
  this.name = params.name || "";
  this.label = params.label || "";
  this.description = params.description || "";

  this.bought = params.bought || false;
  this.makeAvailable = params.makeAvailable || function() { return false; };
  this.affordable = params.affordable || function() { return true; };
  this.buy = params.buy || function() { /* ??? */ };
};
Mod.prototype.display = function() {
  var t = this;
  var index = unavailableMods.indexOf(t);

  if (index < 0 || index > unavailableMods.length) {
    console.log ("We have a problem.  " + t.name + " is trying to display, but is not in unavailableMods.");
    return;
  }

  unavailableMods.splice(index, 1);
  availableMods.push(this);

  console.log(unavailableMods.toString());
  console.log(availableMods.toString());

  renderMods();
};
Mod.prototype.render = function() {
  var div = $("<div />");
  div.addClass(this.label);

  div.append("<p>" + this.name + "</p>");
  div.append("<p>" + this.description + "</p>");

  var button = $("<button>Buy!</button>");
  button.click(function() {console.log("Bought!");});
  div.append(button);

  return div;
}

var renderMods = function() {
  var div = $("<div />");
  div.addClass("mods");

  var divAvailable = $("<div />");
  divAvailable.addClass("available");
  var divBought = $("<div />");
  divBought.addClass("bought");

  for (var i = 0; i < availableMods.length; i++) {
    divAvailable.append(availableMods[i].render());
  }
  for (var i = 0; i < boughtMods.length; i++) {
    divBought.append(boughtMods[i].render());
  }

  div.append(divAvailable);
  div.append(divBought);

  $(".mods").replaceWith(div);
};

var unavailableMods = [
  new Mod({
    name: "Test Upgrade",
    label: "Useless Upgrade",
    description: "Just checking to see if the upgrade display is working.",
    bought: false,
    buy: function () { this.bought = true; new Log({message: "Bought a useless upgrade!  Go you!"}); },
    makeAvailable: function() {return true;}
  })
];
var availableMods = [];
var boughtMods = [];
var hiddenMods = [];

/*var upgrades = [
  {
    name: "Check Clicks",
    label: "Debug Inventory Kit",
    description: "Add 10,000,000 clicks.",
    bought: false,
    buy: function() { tabs[0].items[0].num += 10000000; }
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
