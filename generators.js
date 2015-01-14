var Generators = {
  click: new Generator({
    name: "Click",
    message: "Click!",
    enabled: true,
    flavorText: "Strangely, they give off an appetizing aroma: Ozone and Umamclicki.",
    cost: 0
  }),
  pixel: new Generator({
    name: "Pixel",
    produceTarget: "click",
    costTarget: "click",
    produce: -1,
    flavorText: "Little dots that shine?  Fantastic!"
  }),
  renderer: new Generator({
    name: "Renderer",
    num: 0,
    produceTarget: "pixel",
    costTarget: "pixel",
    produce: 1
  }),
  extruder: new Generator({
    name: "Extruder",
    produceTarget: "renderer",
    costTarget: "renderer",
    produce: 1
  }),
  electronicskit: new Generator({
    name: "Electronics Kit",
    produceTarget: "extruder",
    costTarget: "extruder",
    produce: 1
  }),
  factory: new Generator({
    name: "Factory",
    produceTarget: "electronicskit",
    costTarget: "electronicskit",
    produce: 1
  }),
  cementprinter: new Generator({
    name: "Cement Printer",
    produceTarget: "factory",
    costTarget: "factory",
    produce: 1
  }),
  designlab: new Generator({
    name: "Design Lab",
    produceTarget: "cementprinter",
    costTarget: "cementprinter",
    produce: 1
  }),
  ai: new Generator({
    name: "AI",
    produceTarget: "designlab",
    costTarget: "designlab",
    produce: 1
  })
};

function Generator (params) {
  var produceTarget = params.produceTarget;
  var costTarget = params.costTarget;
  var costRatio = params.costRatio;

  // Descriptions
  this.name = params.name;
  this.flavorText = params.flavorText;

  // Logic
  this.baseCost = params.baseCost || 1;
  if (typeof cost == "number") {
    Object.defineProperty(this, "cost", {
      get: function() { return params.costRatio },
      configurable: true
    });
  }
  else if (typeof cost == "function") {
    Object.defineProperty(this, "cost", {
      get: costRatio,
      configurable: true
    })
  }
  else {
    Object.defineProperty(this, "cost", {
      get: function() { return Math.pow(2, Math.floor(this.num))},
      configurable: true
    });
  }
  Object.defineProperty(this, "costTarget", {
    get: function () { return Generators[costTarget]; }
  });
  this.produceTarget = function () { return Generators[produceTarget]; }; // I can make this a getter, but how in the class def?
  this.baseProduce = params.produce;
  this.produce = function() {return Math.floor(this.num) * this.baseProduce; };
  this.enabled = params.enabled;

  // Optional
  this.num = params.num || 0;
  this.message = params.message || "Buy!";

  // Fixed
  this.buyAmount = 1;
  this.numLost = 0;

  // Local
  var t = this;

  this.select = function(e) {
    e.preventDefault();

    $("article").replaceWith(t.article);
  },

  this.buy = function() {
    if (!t.costTarget) {
      t.num += t.buyAmount;
      return;
    }

    if (t.costTarget.num >= t.cost) {
      t.costTarget.num -= t.cost;
      t.num += t.buyAmount;
      return;
    }

    //make a log message
  }
  //
  // this.cost = function() {
  //   return Math.floor(Math.pow(t.baseCost * t.costRatio, Math.floor(t.num)));
  // }
};
Generator.prototype.init = function() {
  var li = $("<li />");
  li.addClass(key);
  li.html("<a href=\"\">" + this.name + "</a>: <var>" + toFixed(this.num, 2) + "</var>");
  li.append("<button>" + this.message + "</button>");
  li.find("a").click(this.select);
  li.find("button").click(this.buy);

  this.li = li;

  var article = $("<article />");
  article.addClass(key);
  var name = this.name ? this.name : "There's nothing here!";
  var flavorText = this.flavorText ? this.flavorText : this.name;
  article.append("<h2>" + name + "</h2>");
  article.append("<em>" + flavorText + "</em>");
  article.append ("<p class=\"numLost\"></p>"); // This needs to be added or removed dynamically... But can I do it without rebuilding the whole article?
  article.append ("<p class=\"generatorCost\"></p>");

  this.article = article;
};
Generator.prototype.update = function() {
  $("menu ." + key + " var").html(toFixed(Generators[key].num, 2)); // This 'key' is going to cause problems later...
  if (this.costTarget) {
    this.article.find(".generatorCost").html("Costs <var>" + this.cost + "</var> " + this.costTarget.name + " per " + this.name + ".");
  }

  if (this.produce()) {
    var amount = this.produce() * (Pixpls.tickLength / 1000);
    var tar = this.produceTarget();
    if (tar.num + amount > 0) {
      tar.num += amount;
    }
    else {
      tar.num -= amount;
      if (this.num += amount > 0) {
        this.num += amount;
        this.numLost -= amount;
        this.article.find(".numLost").html("<var>" + this.numLost.toFixed(2) + "</var> lost due to poor planning.");
      }
    }
  }
};
