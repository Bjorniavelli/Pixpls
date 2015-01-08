var Generators = {
  click: new Generator({
    name: "Click",
    enabled: true
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
};

function Generator (params) {
  var produceTarget = params.produceTarget;

  this.name = params.name;
  this.costRatio = params.costRatio;
  this.produceTarget = function () { Generators[produceTarget]; };
  this.produce = params.produce;
  this.enabled = params.enabled;

  this.num = params.num || 0;
};

var buildGeneratorMenu = function() {
  var menu = $("<menu />");

  for (key in Generators) {
    var generator = Generators[key];

    var li = $("<li />");
    li.addClass(key);
    li.html("<a href=\"\">" + generator.name + "</a>: <var>" + generator.num + "</var>");
    li.append("<button>" + "Buy!" + "</button>"); // this needs to change the Buy! -> Some Message
    li.find("a").click(function(e) { e.preventDefault(); });

    var target = function(g) { return function() { g.num++; }};
    li.find("button").click(target(generator));

    menu.append(li);
  }

  $("menu").replaceWith(menu);
};

var updateGeneratorMenu = function() {
  for (key in Generators) {
    $("menu ." + key + " var").html(Generators[key].num);
  }
};

$(document).ready(function() {
  buildGeneratorMenu();

  window.setInterval(function() {
    updateGeneratorMenu();
  }, 1000);
});
