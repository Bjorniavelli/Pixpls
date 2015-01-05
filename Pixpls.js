function Generator (params) {//name, costRatio, produceTarget, produce) {
  this.name = params.name;
  this.num = 0;
  this.costRatio = params.costRatio;
  this.produceTarget = params.produceTarget;
  this.produce = params.produce;
  this.el = $("<li />");
}
Generator.prototype = {
  render: function() {
    this.el.html("<p>" + this.name + ": " + this.num + "</p>");
  }
}
var Generators = {
  click: new Generator({
    name: "Click"
  }),
  pixel: new Generator({
    name: "Pixel",
    costRatio: 1.1,
    produceTarget: 0,
    produce: -1
  }),
  renderer: new Generator({
    name: "Renderer",
    num: 0,
    costRatio: 2,
    produceTarget: 1,
    produce: 1
  }),
  extruder: new Generator({
    name: "Extruder",
    costRatio: 2,
    produceTarget: 2,
    produce: 1
  }),
  electronicskit: new Generator({
    name: "Electronics Kit",
    costRatio: 2,
    produceTarget: 3,
    produce: 1
  }),
  factory: new Generator({
    name: "Factory",
    costRatio: 2,
    produceTarget: 4,
    produce: 1
  }),
  cementprinter: new Generator({
    name: "Cement Printer",
    costRatio: 2,
    produceTarget: 5,
    produce: 1
  }),
  designlab: new Generator({
    name: "Design Lab",
    costRatio: 2,
    produceTarget: 6,
    produce: 1
  }),
  ai: new Generator({
    name: "AI",
    costRatio: 2,
    produceTarget: 7,
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
  render: function(optionEl) {
    this.optionEl = optionEl.html("<a href=\"\">" + this.name + "</a>");
    this.sectionEl = $("<section />");

    this.menuEl = $("<menu />");
    this.renderMenu(this.menuEl);
    this.sectionEl.append(this.menuEl);

    this.emptyEl = $("<article />");
    this.sectionEl.append(this.emptyEl);
  },

  renderMenu: function(menuEl) {
    for (menuItem in this.menu) {
      var m = this.menu[menuItem];
      m.render();
      menuEl.append(m.el);
    }
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
  location: "nav",
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
    this.el = $(this.elType);

    for (option in this.options) {
      var o = this.options[option];
      if (o.enabled) {
        var optionEl = $(this.optionType);
        o.render(optionEl);
        this.el.append(optionEl);
      }
    }
    $(this.location).html(this.el);
  },

  currOption: function() {
    for (option in this.options) {
      if (this.options[option].id = this.curr) {
        return this.options[option];
      }
    }

    return null;
  }
}

var Controls = {
  nav: new Control(Tabs)
  // Logs, Mods, etc.
}

$(document).ready(function() {
  $("header").append("<p>Success!</p>");

  for (control in Controls) {
    if (Controls[control].render) {
      Controls[control].render();
    }
  }

  //Just to test...
  $("section").replaceWith(Controls.nav.options.generators.sectionEl);
});
