function Generator (params) {//name, costRatio, produceTarget, produce) {
  this.name = params.name;
  this.num = 0;
  this.costRatio = params.costRatio;
  this.produceTarget = params.produceTarget;
  this.produce = params.produce;
  this.el = $("<li />");
}
Generator.prototype = {
  parent: Generators,

  render: function() {
    this.renderArticle();
    this.renderMenu();
  },

  renderMenu: function() {
    var t = this;

    this.el.html("<p><a href=\"\">" + this.name + "</a>: " + this.num + "</p>");
    this.el.find("p a").click(function(e) {
      e.preventDefault();

      //This so totally breaks encapsulation... >_>
      $("article").replaceWith(t.articleEl);
    });
  },

  renderArticle: function() {
    this.articleEl = $("<article />");
    this.articleEl.append("<h1>" + this.name + "</h1>");
    this.articleEl.append("<h2>Owned: " + this.num + "</h2>");
    // Need to update this so that it outputs the current production rate per this.num
    this.articleEl.append("<h3>Produces " + (this.produce || "nothing") +
      (this.produce && this.produceTarget ? (" " + Generators[this.produceTarget].name) : "") + "</h3>");
  }
}
var Generators = {
  click: new Generator({
    name: "Click"
  }),
  pixel: new Generator({
    name: "Pixel",
    costRatio: 1.1,
    produceTarget: "click",
    produce: -1
  }),
  renderer: new Generator({
    name: "Renderer",
    num: 0,
    costRatio: 2,
    produceTarget: "pixel",
    produce: 1
  }),
  extruder: new Generator({
    name: "Extruder",
    costRatio: 2,
    produceTarget: "renderer",
    produce: 1
  }),
  electronicskit: new Generator({
    name: "Electronics Kit",
    costRatio: 2,
    produceTarget: "extruder",
    produce: 1
  }),
  factory: new Generator({
    name: "Factory",
    costRatio: 2,
    produceTarget: "electronicskit",
    produce: 1
  }),
  cementprinter: new Generator({
    name: "Cement Printer",
    costRatio: 2,
    produceTarget: "factory",
    produce: 1
  }),
  designlab: new Generator({
    name: "Design Lab",
    costRatio: 2,
    produceTarget: "cementprinter",
    produce: 1
  }),
  ai: new Generator({
    name: "AI",
    costRatio: 2,
    produceTarget: "designlab",
    produce: 1
  })
}

function Tab (params) {
  this.id = params.id;
  this.name = params.name;
  this.menu = params.menu;
  this.enabled = params.enabled;
};
// Tabs render to the <section>
// render should render the menu option and... create a section that may or may not be displayed?
// renderMenu render's each item and then adds it to the list
Tab.prototype = {
  render: function() {
    this.renderNav();
    this.renderSection();
  },

  renderNav: function() {
    var t = this;
    this.navEl = $("<li />");
    this.navEl.html("<a href=\"\">" + this.name + "</a>");
    this.navEl.click(function(e) {
      e.preventDefault();
      $("section").replaceWith(t.sectionEl);
    });
    $("nav").append(this.navEl);
  },

  renderSection: function() {
    this.sectionEl = $("<section />");

    this.renderMenu();
    this.sectionEl.append(this.menuEl);

    this.emptyArticleEl = $("<article />");
    this.articleEl = this.emptyArticleEl;
    this.sectionEl.append(this.articleEl);
  },

  renderMenu: function() {
    this.menuEl = $("<menu />");

    for (menuItem in this.menu) {
      var m = this.menu[menuItem];
      m.render();
      this.menuEl.append(m.el);
    }
  },

  enable: function() {
    this.enabled = true;
  }
};

var Tabs = new Control({
  options: {
    generators: new Tab ({
      id: 0,
      name: "Generators",
      menu: Generators,
      enabled: true,
    }),
    hero: new Tab ({
      id: 1,
      name: "Hero",
      enabled: true
    }),
    crafting: new Tab({
      id: 2,
      name: "Crafting",
      enabled: true
    }),
    camp: new Tab({
      id: 3,
      name: "Camp",
      enabled: true
    }),
    help: new Tab({
      id: 4,
      name: "Help",
      enabled: true
    }),
    settings: new Tab({
      id: 5,
      name: "Settings",
      enabled: true
    })
  },

  name: "Tabs",
  elType: "<menu />",
  optionType: "<li />",
  curr: 0
});

function Control (params) {
  this.name = params.name;
  this.location = params.location;
  this.elType = params.elType;
  this.optionType = params.optionType;
  this.curr = params.curr;
  this.options = params.options;
}
// Control represents one major portion of the page
// render: renders the current element into the page, not returning anything
// currOption: returns the option that should be currently displayed
Control.prototype = {
  render: function() {
    for (option in this.options) {
      var o = this.options[option];
      if (o.enabled) {
        o.render();
      }
    }
  },

  update: function() {
    for (option in this.options) {
      var o = this.options[option];
      if (o.enabled) {
      }
    }
  },

  currOption: function() {
    for (option in this.options) {
      if (this.options[option].id == this.curr) {
        return this.options[option];
      }
    }

    return null;
  }
};

var Controls = {
  nav: new Control(Tabs)
  // Logs, Mods, etc.
};

var Engine = {
  tickLength: 1000,
  tick: 0,

  init: function() {
    this.render();
    setInterval(this.loop, this.tickLength);
  },

  loop: function() {
    Engine.tick++;
    $("#ticknumber").html("Tick #" + Engine.tick);
    Engine.update();
  },

  render: function() {
    for (control in Controls) {
      if (Controls[control].render) {
        Controls[control].render();
      }
    }
  },

  update: function() {
    for (control in Controls) {
      if (Controls[control].update) {
        Controls[control].update();
      }
    }
  }
}

$(document).ready(function() {
  Engine.init();
});


/*var upgrades = [
  {
    name: "Test Upgrade",
    label: "Useless Upgrade",
    description: "Just checking to see if the upgrade display is working.",
    bought: false,
    buy: function () { this.bought = true; app.newMessage("Bought a useless upgrade!  Go you!"); }
  },
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
