Pixpls.Generators = {
  list: {},
  init: function() {
    var section = $("<section id=\"generators\" />"); // I don't think we need to add a class, because we'll set it as a this.
    var menu = $("<menu />");
    section.append(menu);

    this.section = section;
    this.menu = menu;

    $("section").replaceWith(this.section);

    for (key in Pixpls.Generators.list) {
      Pixpls.Generators.list[key].init();
      $("." + key).hide();
    }
  },
  update: function() {
    for (key in this.list) {
      this.list[key].update();
    }
  },
}

function Generator (params) {
  this._produceTarget = params.produceTarget;
  this._costTarget = params.costTarget;
  this.costRatio = params.costRatio;

  // Descriptions
  this.key = params.key;
  this.name = params.name;
  this.label = params.label;
  this.flavorText = params.flavorText;

  // Logic
  this.baseCost = params.cost || 1;
  this.baseProduce = params.produce || 0;

  // Optional
  this.num = params.num || 0;
  this.message = params.message || "Buy!";

  // Fixed
  this.buyAmount = 1;
  this.numLost = 0;

  this.visible = false;

  Pixpls.Generators.list[params.key] = this;
};

Object.defineProperty(Generator.prototype, "article", {
  get: function() {
    return $("#generators>." + this.key);
  }
});
Object.defineProperty(Generator.prototype, "li", {
  get: function() {
    return $("#generators>menu>." + this.key);
  }
});
Generator.prototype.createArticle = function() {
  var article = $("<article />");
  article.addClass(this.key);
  var name = this.name ? this.name : "There's nothing here!";
  var flavorText = this.flavorText ? this.flavorText : this.name;
  article.append("<h2>" + name + "</h2>");
  article.append("<em>" + flavorText + "</em>");

  // These ones need some 'ifs'.  In fact, all of these should just be if they're defined.
  article.append ("<p class=\"numLost\"></p>"); // This needs to be added or removed dynamically... But can I do it without rebuilding the whole article?
  article.append ("<p class=\"generatorCost\"></p>");

  $("#generators").append(article);
  // Fix this later... >_>
  //Pixpls.Generators.section.append(article);
}
Generator.prototype.createLi = function() {
  var t = this;
  var li = $("<li />");

  li.addClass(key);
  li.html("<a href=\"\">" + this.name + "</a>: <var>" + toFixed(this.num, 2) + "</var>");
  li.append("<button>" + this.message + "</button>");
  li.on("click", "a", function(e) { e.preventDefault(); t.select(); });
  li.on("click", "button", function() { t.buy(); });

  $("#generators>menu").append(li);
  // Fix this later... >_>
  // Pixpls.Generators.menu.append(li);
}

Object.defineProperty(Generator.prototype, "cost", {
  get: function() {
    switch(typeof this.costRatio) {
      case "number":
        return this.costRatio;
      case "function":
        return this.costRatio();
      default:
        return Math.pow(2, Math.floor(this.num));
    }
  }
});
Object.defineProperty(Generator.prototype, "costTarget", {
  get: function() { return Pixpls.Generators.list[this._costTarget]; }
});
Object.defineProperty(Generator.prototype, "produceTarget", {
  get: function() { return Pixpls.Generators.list[this._produceTarget]; }
});
Object.defineProperty(Generator.prototype, "produce", {
  get: function() { return Math.floor(this.num) * this.baseProduce; }
})


Generator.prototype.createDisplayMod = function() {
  var t = this;

  Pixpls.Mods.hiddenMods.push (new Mod({
    hidden: true,
    name: "Show " + t.name + " Generator",
    label: "Show" + t.label + "Gen",
    description: "Display an entry in the generators menu for " + t.name + ".",
    makeAvailable: function() {
      if (t.key === "click") {
        return true;
      } else {
        return t.produceTarget.num >= 5;
      }
    },
    buy: function() {
      t.li.show();
    }
  }));
}
Generator.prototype.select = function() {
  $("#generators>article").hide();
  this.article.show();
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
  this.createDisplayMod(); // Move this to init?
  this.createArticle();
  this.createLi();
};
Generator.prototype.update = function() {
  $("menu ." + key + " var").html(toFixed(Pixpls.Generators.list[key].num, 2)); // This 'key' is going to cause problems later...
  if (this.costTarget) {
    this.article.find(".generatorCost").html("Costs <var>" + this.cost + "</var> " + this.costTarget.name + " per " + this.name + ".");
  }

  if (this.produce) {
    var amount = this.produce * (Pixpls.tickLength / 1000);
    var tar = this.produceTarget;
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
