Pixpls.Generators = {
  list: {},
  init: function() {
    var section = $("<section />"); // I don't think we need to add a class, because we'll set it as a this.
    var menu = $("<menu />");
    var article = $("<article />");

    for (key in Pixpls.Generators.list) {
      var generator = Pixpls.Generators.list[key];
      generator.init();
      menu.append(generator.li);
      if (key != "click") {
        generator.li.hide();
      }
    }

    section.append(menu);
    section.append(article);

    this.section = section;
    this.menu = menu;
    this.article = article;

    $("section").replaceWith(this.section);
  },
  update: function() {
    for (key in this.list) {
      this.list[key].update();
    }
  },
  save: function() {
    console.log( "Generators Save!" );
  }
}

function Generator (params) {
  var produceTarget = params.produceTarget;
  var costTarget = params.costTarget;
  var costRatio = params.costRatio;

  // Descriptions
  this.name = params.name;
  this.label = params.label;
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
    get: function () { return Pixpls.Generators.list[costTarget]; }
  });
  this.produceTarget = function () { return Pixpls.Generators.list[produceTarget]; }; // I can make this a getter, but how in the class def?
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

  //Appropriate Mods:
  if (this.label != "CGen") { $(document).ready(function() {
    Pixpls.Mods.hiddenMods.push (new Mod({
      hidden: true,
      name: "Show " + t.name + " Generator",
      label: "Show" + t.label + "Gen",
      description: "Display an entry in the generators menu for " + t.name + ".",
      makeAvailable: function() {
        return t.produceTarget().num >= 5;
      },
      buy: function() {
        t.li.show();
      }
    }));
  }); }

  Pixpls.Generators.list[params.key] = this;
};

Generator.prototype.select = function() {
  $("article").replaceWith(this.article);
};
Generator.prototype.buy = function() {
  if (!this.costTarget) {
    this.num += this.buyAmount;
    return;
  }

  if (this.costTarget.num >= this.cost) {
    this.costTarget.num -= this.cost;
    this.num += this.buyAmount;
    return;
  }
};
Generator.prototype.init = function() {
  var t = this;
  var li = $("<li />");

  li.addClass(key);
  li.html("<a href=\"\">" + this.name + "</a>: <var>" + toFixed(this.num, 2) + "</var>");
  li.append("<button>" + this.message + "</button>");
  li.on("click", "a", function(e) { e.preventDefault(); t.select(); });
  li.on("click", "button", function() { t.buy(); });

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
  $("menu ." + key + " var").html(toFixed(Pixpls.Generators.list[key].num, 2)); // This 'key' is going to cause problems later...
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
