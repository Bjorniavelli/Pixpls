function toFixed(num, precision) { // Grabbed off of StackOverflow -> floor instead of round
  var r = (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision));
  if (isNaN(r)) { r = 0; }
  return r.toFixed(precision);
}

var Pixpls = {
// Start Date?
  ver: "pre-alpha",
  tickLength: 100,
  numTicks: 0,
  devMode: true,
  resources: {},

  init: function() {
    //Pixpls.Generators.init();
    // Generators init:
    // var section = $("<section id=\"generators\" />"); // I don't think we need to add a class, because we'll set it as a this.
    // var menu = $("<menu />");
    // section.append(menu);
    //
    // this.section = section;
    // this.menu = menu;
    //
    // $("section").replaceWith(this.section);
    $("#generators").hide();

    //Pixpls.Mods.init();
    // Mods init:

    var div = $(".mods"); // Should I just define this as div: $("<div class="mods" />"); ?
    $(".unavailable").html("<h4>Unavailable Mods - Shouldn't ever display</h4>");
    $(".unavailable").hide();
    $(".available").html("<h4>Available</h4>");
    $(".purchased").html("<h4>Purchased</h4>");
    div.hide();


    // This needs to be modified a bit, because the load isn't displaying the Mods div.
    // It's because the hiddenMod that displays them isn't there any more in the save data.
    // if (localStorage["savedata"] == "true") {
    //   Pixpls.load();
    // } else {
      Pixpls.Data.init();
    // }

    $("header").on("click", "#savebutton", Pixpls.save);
    $("header").on("click", "#loadbutton", Pixpls.load);
    $("header").on("click", "#resetbutton", Pixpls.reset);

    new Log("Welcome to Pixpls! (ver." + Pixpls.ver + ")");
    new Log("This *is* a clicky game.  How about some tasty, endorphin-producing clicking?");
  },
  update: function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(toFixed(Pixpls.numTicks, 0));

    // Pixpls.Generators.update();
    // Pixpls.Mods.update();

    for (key in Pixpls.resources) {
      if (Pixpls.resources[key].update) {
        Pixpls.resources[key].update();
      }
    }

    // This automatically auto-saves... I'm not sure we want that.  But we'll implement it for now.
    // if (Pixpls.numTicks % 100 === 0) {
    //   Pixpls.save();
    // }
  }
};
$(document).ready(function() {
  Pixpls.init();

  window.setInterval(Pixpls.update, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings


// Class Definitions

function Resource (params) {
  this.label = params.label;
  this.type = params.type;

  this.name = params.name;
  this.description = params.description;
  this.flavorText = params.flavorText;
  this.message = params.message || "Buy";

  this._makeAvailable = params._makeAvailable || "returnFalse";
  this._affordable = params._affordable || "returnTrue";
  this._buy = params._buy || "defaultBuy";
}
Resource.prototype.makeAvailable = function() {
  if (typeof this._makeAvailable == "string") {
    if (!Pixpls.Data.functionList[this._makeAvailable]) {
      console.log("Tried to call " + this._makeAvailable + " from " + this.name + ". (makeAvailable())");
      return false;
    }
    return Pixpls.Data.functionList[this._makeAvailable](this); // I don't think this will happen either, since we're going to try to conver them all to cost-types, but maybe we'll see if we need this combo.
  }

  if (Array.isArray(this._makeAvailable)) {
    for (var i = 0; i < this._makeAvailable.length; i++) {
      if (!boolFunction(this._makeAvailable[i], this.label)) {
        return false;
      }
    }
    return true;
  }

  // It's definitely not going to be a typeof "function", because those won't save to the stringify.
  console.log(this.name + " tried to check makeAvailable, but it's not a function, string, or Array.");
  return false;
};
Resource.prototype.affordable = function() {
  if (typeof this._affordable == "string") {
    if (!Pixpls.Data.functionList[this._affordable]) {
      console.log("Tried to call " + this._affordable + " from " + this.name + ". (affordable())");
      return false;
    }
    return Pixpls.Data.functionList[this._affordable](this);
  }

  if (Array.isArray(this._affordable)) {
    for (var i = 0; i < this._affordable.length; i++) {
      if (!boolFunction(this._affordable[i], this.label)) {
        return false;
      }
    }
    return true;
  }

  // It's definitely not going to be a typeof "function", because those won't save to the stringify.
  console.log(this.name + " tried to check affordable, but it's not a function, string, or Array.");
  return false;
};
Resource.prototype.buy = function() { // Stopgap until we figure out what we want to do for costs.
  if (typeof this._buy == "string") {
    if (!Pixpls.Data.functionList[this._buy]) {
      console.log("Tried to call " + this._buy + " from " + this.name + ". (buy())");
      return false;
    }
    Pixpls.Data.functionList[this._buy](this);
  }

  if (Array.isArray(this._buy)) {
    for (var i = 0; i < this._buy.length; i++) {
      boolFunction(this._buy[i], this.label);
    }
  }
}

function HiddenMod (params) {
  Resource.call(this, params);

  this.status = params.status || "hidden";

  Pixpls.resources[this.label] = this;
//  Pixpls.Mods.list.push(this.label);
}
HiddenMod.prototype = Object.create(Resource.prototype);
HiddenMod.prototype.update = function() {
  switch(this.status) {
    case "hidden":
      if (this.makeAvailable()) {
        // It's buying the thing, but it's not displaying the generators properly.
        this.buy(); // Change status within the buy?
      }
      break;
    case "hiddenPurchased":
      // We might want to put an update in here later for description updates?
      break;
    case "unavailable":
      if (this.makeAvailable()) {
        this.display(); // This needs to be switched out of the Pixpls.Mods...
      }
      break;
    case "available":
      if ( this.affordable()) {
        this.notButton.css({display: "none"});
        this.button.css({display: "block"});
      }
      if ( !this.affordable()) {
        this.notButton.css({display: "inline"});
        this.button.css({display: "none"});
      }
      break;
    case "purchased":
      // same as hiddenPurchased.  I don't remember if we have cascading cases in JS
      break;
    default:
      console.log(this.name + " has an unhandled status in update()");
      break;
  }
}

HiddenMod.prototype.purchase = function() {
  this.status = hiddenPurchased;
}

function Mod (params) {
  HiddenMod.call(this, params);

  this.status = params.status || "unavailable";
  this.render();
};
Mod.prototype = Object.create(HiddenMod.prototype);

Mod.prototype.display = function() {
  this.status = "available";
  $(".available").append(this.div);
}
Mod.prototype.purchase = function() { // This doesn't handle hiddenmods, gonna cause problems.
  this.status = "purchased";
  $(".purchased").append(this.div);
}

Mod.prototype.updateDescription = function() {
  $("." + this.label).find(".description").html(this.description);
}
Mod.prototype.render = function() {
  var div = $("<div />");
  div.addClass(this.label);
  div.addClass("mod");

  div.html("<p class=\"name\">" + this.name + "</p>");
  div.append("<p class=\"description\">" + this.description + "</p>");

  var buttonSpan = $("<span />");
  buttonSpan.addClass("buttonSpan");
  div.append(buttonSpan);

  var button = $("<button />");
  button.html(this.message + "!");
  var notButton = $("<s />");
  notButton.html(this.message);

  buttonSpan.append(button);
  buttonSpan.append(notButton);

  if (this.buy) {
    var t = this;
    buttonSpan.on( "click", "button", function() { t.buy(); } );
  }

  $(".unavailable").append(div);
  this.update();
};
// These aren't seeming to work properly.  Fix 'em next!
Object.defineProperty(Mod.prototype, "div", {
  get: function() { return $("." + this.label); }
});
Object.defineProperty(Mod.prototype, "buttonSpan", {
  get: function() { return this.div.find("span"); }
});
Object.defineProperty(Mod.prototype, "button", {
  get: function() { return this.buttonSpan.find("button"); }
});
Object.defineProperty(Mod.prototype, "notButton", {
  get: function() { return this.buttonSpan.find("s"); }
});

function Generator (params) {
  Resource.call(this, params);

  this._produceTarget = params._produceTarget;
  this._costTarget = params._costTarget;
  this.costRatio = params.costRatio;

  // Logic
  this.baseCost = params.baseCost || 1;
  this.baseProduce = params.baseProduce || 0;

  // Optional
  this.num = params.num || 0;
  this.message = params.message || "Buy!";
  this.costPower = params.costPower;

  // Fixed
  this.buyAmount = params.buyAmount || 1;
  this.numLost = params.numLost || 0;

  this.createArticle();
  this.createLi();

  Pixpls.resources[params.label] = this;
  //Pixpls.Generators.list.push(this.label);
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
  article.append ("<p class=\"produces\"></p>");
  article.append ("<p class=\"buyAmount\"></p>");

  $("#generators").append(article);
  article.hide();
  // Fix this later... >_>
  //Pixpls.Generators.section.append(article);
};
Generator.prototype.updateArticle = function() {
  if (this.costTarget) {
    this.article.find(".generatorCost").html("Costs <var>" + this.cost + "</var> " + this.costTarget.name + " per " + this.name + ".");
  }
  if (this.numLost > 0) {
    this.article.find(".numLost").html("<var>" + this.numLost.toFixed(2) + "</var> lost due to poor planning.");
  }
  if (this.produceTarget) {
    this.article.find(".produces").html("Produces <var>" + this.baseProduce + "</var> " + this.produceTarget.name + " per " + this.name + " per second. (" + this.produce + " total)");
  }
  if (this.buyAmount != 1) {
    this.article.find(".buyAmount").html("Buying <var>" + this.buyAmount + "</var> per purchase.");
  }
}

Generator.prototype.createLi = function() {
  var t = this;
  var li = $("<li />");

  li.addClass(this.label);
  li.html("<a href=\"\">" + this.name + "</a>: <var>" + toFixed(this.num, 2) + "</var>");
  li.append("<button>" + this.message + "</button>");
  li.on("click", "a", function(e) { e.preventDefault(); t.select(); });
  li.on("click", "button", function() { t.buy(); });

  $("#generators>menu").append(li);
  li.hide();
  // Fix this later... >_>
  // Pixpls.Generators.menu.append(li);
};
Generator.prototype.updateLi = function() {
  $("menu ." + this.label + " var").html(toFixed(this.num, 2)); // This 'key' is going to cause problems later...
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
  get: function() { return Pixpls.resources[this._costTarget]; }
});
Object.defineProperty(Generator.prototype, "produceTarget", {
  get: function() { return Pixpls.resources[this._produceTarget]; }
});
Object.defineProperty(Generator.prototype, "produce", {
  get: function() { return Math.floor(this.num) * this.baseProduce; }
})


// Generator.prototype.createDisplayMod = function() {
//   var t = this;
//
//   new Mod({
//     hidden: true,
//     name: "Show " + t.name + " Generator",
//     label: "Show" + t.label + "Gen",
//     description: "Display an entry in the generators menu for " + t.name + ".",
//     makeAvailable: function() {
//       if (t.key === "click") {
//         return true;
//       } else {
//         return t.produceTarget.num >= 5;
//       }
//     },
//     buy: function() {
//       t.li.show();
//     }
//   });
// }
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
Generator.prototype.update = function() {
  this.updateArticle();
  this.updateLi();

  if (this.produce) {
    var amount = this.produce * (Pixpls.tickLength / 1000);
    var tar = this.produceTarget;
    if (tar.num + amount > 0) {
      tar.num += amount;
      if (amount < 0) {
        tar.numLost -= amount;
      } else {
        tar.numProduced += amount;
      }
    }
    else {
      tar.num -= amount;
      if (this.num += amount > 0) {
        this.num += amount;
        this.numLost -= amount;
      }
    }
  }
};

// Class Helper Functions

function boolFunction (o, r) {
  switch(o.type) {
    case "addresource":
      Pixpls.resources[o.resource].num += o.num;
      break;
    case "multiplyresource":
      Pixpls.resources[o.resource].num *= o.num;
      break;
    case "resourcenum":
      if (Pixpls.resources[o.resource].num < o.num) { // These all need more error checking.
        return false;
      }
      break;
    case "resourcenumlost":
      if (Pixpls.resources[o.resource].numLost < o.num) {
        return false;
      }
      break;
    case "modstatus":
      if (Pixpls.resources[o.mod || r].status != "purchased") {
        return false;
      }
      break;
    case "time":
      if (Pixpls.numTicks < o.num) {
        return false;
      }
      break;
    case "stringmap":
      if (!Pixpls.Data.functionList[o.function](o.resource || r)) {
        return false;
      }
      break;
    case "function": // I'm not sure this is ever going to get used...
      if (!o.function()) {
        return false;
      }
      break;
    case "showel":
      $(o.el).show();
      break;
    case "hideel":
      $(o.el).hide();
      break;
    case "purchase":
      Pixpls.resources[o.mod || r].purchase();
      break;
    case "description":
      Pixpls.resources[o.resource || r].description = o.text;
      Pixpls.resources[o.resource || r].updateDescription();
      break;
    case "log":
      new Log(o.message);
      break;
    default:
      console.log(o.type + " is not a handled constraint type.  In " + r.name + "."); // Looks like this error won't work anymore.
      return false;
  }

  return true;
}
