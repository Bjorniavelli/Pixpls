function toFixed(num, precision) { // Grabbed off of StackOverflow -> floor instead of round
  var r = (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision));
  if (isNaN(r)) { r = 0; }
  return r.toFixed(precision);
}

var Pixpls = {
// Start Date?
  ver: "a0.0.1",
  tickLength: 100,
  numTicks: 0,
  devMode: true,
  resources: {},

  logs: [],
  maxLogs: 1000,
  maxDisplayLogs: 10,
  nextLogId: 0,

  init: function() {
    $("li, article, .mod").remove();

    $("#generators").html("<menu></menu>");
    $("#generators").hide();

    $(".mods").hide(); // Should I just define this as div: $("<div class="mods" />"); ?
    $(".unavailable").html("<h4>Unavailable Mods - Shouldn't ever display</h4>");
    $(".unavailable").hide();
    $(".available").html("<h4>Available</h4>");
    $(".purchased").html("<h4>Purchased</h4>");

    $("header").off();
    $("header").on("click", "#savebutton", Pixpls.save);
    $("header").on("click", "#loadbutton", Pixpls.load);
    $("header").on("click", "#resetbutton", Pixpls.reset);

    // I think we want this in every load of the window.
    new Log("Welcome to Pixpls! (ver." + Pixpls.ver + ")");
  },
  update: function() {
    Pixpls.numTicks++;
    $("#ticknumber").html(toFixed(Pixpls.numTicks, 0));

    for (key in Pixpls.resources) {
      if (Pixpls.resources[key].update) {
        Pixpls.resources[key].update();
      }
    }

    // This automatically auto-saves... I'm not sure we want that.  But we'll implement it for now.
    if (Pixpls.numTicks % 300 === 0) {
      Pixpls.save();
    }
  },
  updateLogs: function() { // Shouldn't happen every frame, just when we make a new log.
    if (Pixpls.logs.length > Pixpls.maxLogs) {
      Pixpls.logs = Pixpls.logs.slice(0, Pixpls.maxLogs);
    }

    var footer = $("footer");
    footer.empty();

    var numLogs = 0;
    for (var i = 0; i < Pixpls.logs.length; i++) {
      if (numLogs >= Pixpls.maxDisplayLogs) {
        break;
      }

      footer.append("<p class=\"log\">" + Pixpls.logs[i].message + "</p>");
      numLogs++;
    }
  },
  save: function() { // This is pretty simple... is it all I need??
    localStorage["savedata"] = true;
    localStorage["ver"] = Pixpls.ver;
    localStorage["numTicks"] = Pixpls.numTicks;

    localStorage["resources"] = JSON.stringify(Pixpls.resources);
    new Log("Game Saved!");
  },
  load: function() {
    // reverse localStorage save info with logic for versioning.
    if (localStorage["savedata"] != "true") {
      new Log("Nope.  I refuse to load.  Also, there's no save file.  Not even an old one that the Developer Overlord deprecated.");
      return;
    }

    if (Pixpls.ver != localStorage["ver"]) {
      new Log("New Version!  Luckily, your save file is going to attempt to load.");
    }

    Pixpls.init();

    Pixpls.numTicks = localStorage["numTicks"];
    Pixpls.resources = {};

    // This seems pretty easy... but does it fix some of the Object.setProperty's?
    var o = JSON.parse(localStorage["resources"]);

    for (key in o) {
      Pixpls.Data.newResource(o[key]);
    }

    new Log("Game loaded!");
    return true;
  },
  reset: function() {
    if (localStorage["savedata"] == true) {
      if (!window.confirm("This is an actual reset.  It's not fancy prestige stuff.  You probably don't want to do this.  Continue?")) {
        new Log("Pixpls Apocalypse Averted!");
        return;
      } // else...
      new Log("Gauss!  Was it worth it?");
      localStorage["savedata"] = false;
      // You know what?  Let's just burn it all.
      localStorage.clear();
    }

    // This part happens because we confirmed the dialog on reset, or because there's no savegame.

    Pixpls.numTicks = 0;
    Pixpls.resources = {};

    Pixpls.init();
    for (var i = 0; i < Pixpls.Data.resourceList.length; i++) {
      Pixpls.Data.newResource(Pixpls.Data.resourceList[i]);
    }
  }
};

// "Main", starts game and then initiates game loop.
$(document).ready(function() {
  if (localStorage["savedata"] == "true") {
    Pixpls.load();
  } else {
    Pixpls.reset();
  }

  // calling hide here is so terrible, but for some reason it's not hiding it when I call it elsewhere.
  $("article").hide();

  window.setInterval(Pixpls.update, Pixpls.tickLength);
});

// Just a note that the tabs will be Generators, Hero, Crafting, Camp, Help, Settings

// Class Definitions

function Log (params) {
  if (typeof params == "string") {
    this.message = params;
  } else {
    this.message = params.message;
  }
  this.id = params.id || Pixpls.nextLogId;
  this.timeStamp = params.timeStamp || Date.now();

  if (this.id >= Pixpls.nextLogId) {
    Pixpls.nextLogId = this.id + 1;
  }

  Pixpls.logs.unshift(this);
  Pixpls.updateLogs();
};

function Resource (params) {
  this.label = params.label;
  this.type = params.type;

  this.name = params.name;
  this.description = params.description;
  this.flavorText = params.flavorText;
  this.message = params.message || "Buy";

  this._makeAvailable = params._makeAvailable;// || [{ type: "false" }];
  this._affordable = params._affordable;// || [{ type: "true" }]";
  this._buy = params._buy;// || [{ type: "default" }];
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
Resource.prototype.createButtonSpan = function () {
  var buttonSpan = $("<span class=\"buttonSpan\"/>");

  buttonSpan.append("<button>" + this.message + "!</button>");
  buttonSpan.append("<s>" + this.message + "</s>");

  if (this.buy) {
    var t = this;
    buttonSpan.on( "click", "button", function() { t.buy(); } );
  }
  return buttonSpan;
};
Resource.prototype.affordableTitle = function() {
  var s = "";

  if (!this._affordable || !Array.isArray(this._affordable)) {
    return s;
  }

  for (var i = 0; i < this._affordable.length; i++) {
    if (s != "") {
      s += "\n";
    }
//    console.log(this.label + " -> " + this.affordable[i].type + " -> " + titleFunction(this._affordable[i], this.label));
    s += titleFunction(this._affordable[i], this.label);
  }

  if (s.slice(-1) == "\n") {
    s = s.substr(0, length - 1);
  }
  s = "Requirements:\n" + s;

  return s;
};


Object.defineProperty(Resource.prototype, "buttonSpan", {
  get: function() { return $("." + this.label).find("span"); }
});
Object.defineProperty(Resource.prototype, "button", {
  get: function() { return this.buttonSpan.find("button"); }
});
Object.defineProperty(Resource.prototype, "notButton", {
  get: function() { return this.buttonSpan.find("s"); }
});

function HiddenMod (params) {
  Resource.call(this, params);

  this.status = params.status || "hidden";

  if (params.load == true || params.load == "true") {
    this.load = true;
  }

  Pixpls.resources[this.label] = this;
}
HiddenMod.prototype = Object.create(Resource.prototype);
HiddenMod.prototype.update = function() {
  switch(this.status) {
    case "hidden":
      if (this.makeAvailable()) {
        this.buy();
      }
      break;
    case "hiddenPurchased":
      // We might want to put an update in here later for description updates?
      break;
    case "unavailable":
      if (this.makeAvailable()) {
        this.display();
      }
      break;
    case "available":
      this.buttonSpan.attr("title", this.affordableTitle());
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
  this.status = "hiddenPurchased";
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
Mod.prototype.purchase = function() {
  this.status = "purchased";
  $(".purchased").append(this.div);
  this.buttonSpan.remove();
}

Mod.prototype.updateDescription = function() {
  $("." + this.label).find(".description").html(this.description);
}
Mod.prototype.render = function() {
  var div = $("<div class=\"" + this.label + " mod\" />");

  div.append("<p class=\"name\">" + this.name + "</p>");
  div.append("<p class=\"description\">" + this.description + "</p>");

  if (this.status != "purchased") {
    div.append(this.createButtonSpan());
  }

// Can the following line replace the switch?
 div.appendTo("." + this.status);
  // switch(this.status) {
  //   case "unavailable":
  //     $(".unavailable").append(div);
  //     break;
  //   case "available":
  //     $(".available").append(div);
  //     break;
  //   case "purchased":
  //     $(".purchased").append(div);
  //     break;
  //   case "hidden":
  //     console.log("Made a new mod, " + this.label + ", but it's status is hidden.  I don't think that's supposed to happen.");
  //     break;
  //   case "hiddenPurchased":
  //     console.log("Made a new mod, " + this.label + ", but it's status is hiddenPurchased.  I don't think that's supposed to happen.");
  //     break;
  //   default:
  //     console.log("Unhandled mod type in " + this.label + ".  This is the default case!  Yay for Switch tutorials!  Let's make this error message over long.  Just really long.  I Loooooooooooooooooooove Long Error Messages! ILLEM!");
  //     break;
  // }
  this.update();
};
// These aren't seeming to work properly.  Fix 'em next!
Object.defineProperty(Mod.prototype, "div", {
  get: function() { return $("." + this.label); }
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

  // String interpretations
  if (!this._makeAvailable) {
    this._makeAvailable = [
      { type: "minproperty", resource: this.produceTarget.label, property: "num", val: 5 }
    ]
  }
  if (!this._affordable) {
    this._affordable = [
      { type: "maxproperty", resource: this.label, property: "num", val: "maxNum" },
      { type: "minproperty", resource: this.produceTarget.label, property: "num", resource2: this.label, val: "cost"}
    ]
  }

  this.createArticle();
  this.createLi();

  Pixpls.resources[params.label] = this;
  //Pixpls.Generators.list.push(this.label);
};
Generator.prototype = Object.create(Resource.prototype);

Object.defineProperty(Generator.prototype, "article", {
  get: function() {
    return $("#generators>article." + this.label);
  }
});
Object.defineProperty(Generator.prototype, "li", {
  get: function() {
    return $("#generators>menu>." + this.label);
  }
});

Generator.prototype.createArticle = function() {
  var article = $("<article class=\"" + this.label + "\" />");
  var name = this.name ? this.name : "There's nothing here!";
  var flavorText = this.flavorText ? this.flavorText : this.name;
  article.append("<h2>" + name + "</h2>");
  article.append("<em>" + flavorText + "</em>");

  article.append ("<p class=\"numLost\"></p>");
  article.append ("<p class=\"generatorCost\"></p>");
  article.append ("<p class=\"produces\"></p>");
  article.append ("<p class=\"buyAmount\"></p>");
//  article.append (this.htmlCostFunction());
  // article.append(this.createButtonSpan()); // Just not sure we want to repeat ourselves.
// This is complicatd... and I'm just not sure it adds any extra information to the player.
//  article.append ("<div class=\"requirements\">" + htmlFunction() + "</div>");

  $("#generators").append(article);
  this.article.hide();
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
//  updateHtmlFunction(this.article.find(".requirements"), r);
}

Generator.prototype.createLi = function() {
  var t = this;
  var li = $("<li />");

  li.addClass(this.label);
  li.html("<a href=\"\">" + this.name + "</a>: <var>" + toFixed(this.num, 2) + "</var> &nbsp");
//  li.append("<button>" + this.message + "</button>");
  li.on("click", "a", function(e) { e.preventDefault(); t.select(); });
  //li.on("click", "button", function() { t.buy(); });
  li.append(this.createButtonSpan());

  $("#generators>menu").append(li);
  if (this.num <= 0) { // This might not be the best place for this.
    li.hide();
  }
  // Fix this later... >_>
  // Pixpls.Generators.menu.append(li);
};
Generator.prototype.updateLi = function() {
  $("menu ." + this.label + " var").html(toFixed(this.num, 2)); // This 'key' is going to cause problems later...
  this.buttonSpan.attr("title", this.affordableTitle());
//  this.buttonSpan.attr("title", "Test?");
//  this.buttonSpan.append(this.affordableTitle());
};

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
});

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

  if (this._makeAvailable) {
    if (this.makeAvailable()) {
      this.li.show();
    }
  }

  if (this._affordable) {
    if ( this.affordable()) {
      this.notButton.css({display: "none"});
      this.button.css({display: "block"});
    } else {
      this.notButton.css({display: "inline"});
      this.button.css({display: "none"});
    }
  }

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

// This isn't really a bool anymore... I should probably change the name.
function boolFunction (o, r) {
  switch(o.type) {
    case "true":
      return true;
    case "false":
      return false;
      break;
    case "dev":
      return Pixpls.devMode;
    case "statusexists":
      for (key in Pixpls.resources) {
        if (Pixpls.resources[key].status === o.status) {
          return true;
        }
      }
      return false;
    case "status":
      if (Pixpls.resources[o.mod || r].status != ( o.status || "purchased" )) {
        return false;
      }
      break;
    case "setproperty": // We could probably combine a bunch of these to this.
      Pixpls.resources[o.resource || r][o.property] = (Pixpls.resources[o.resource || r][o.val] || o.val);
      break;
    case "addproperty":
      Pixpls.resources[o.resource || r][o.property] += (Pixpls.resources[o.resource || r][o.val] || o.val);
      break;
    case "mulproperty":
      Pixpls.resources[o.resource || r][o.property] *= (Pixpls.resources[o.resource || r][o.val] || o.val);
      break;
    case "minproperty": // resources[ value in the string or the passed arg][ the property is required] < resources[same resource][accepts a property name or a value]
//      if (Pixpls.resources[o.resource || r][o.property] < (Pixpls.resources[o.resource || r][o.val] || o.val)) {
      if (Pixpls.resources[o.resource || r][o.property] < (Pixpls.resources[o.resource2 || o.resource || r][o.val] || o.val)) {
        // this fixes a specific bug with generators display... it's kind of terrible?
        return false;
      }
      break;
    case "maxproperty":
      if (Pixpls.resources[o.resource || r][o.property] > (Pixpls.resources[o.resource || r][o.val] || o.val)) {
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
    // case "function": // I'm not sure this is ever going to get used...
    //   if (!o.function()) {
    //     return false;
    //   }
    //   break;
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
      // I don't like this conditional, it breaks too many walls, referencing a condition based on the non o argument.
      // Further, I might run into bugs later where I accidentally make a message after the purchase.
      if (Pixpls.resources[r].status != "hiddenPurchased") {
        new Log(o.message);
      }
      break;
    case "default":
      new Log("Bought " + m.name + "!");
      break;
    default:
      console.log("Unhandled function map " + o.type + " in " + r +".");
      return false;
  }

  return true;
}

function titleFunction (o, r) {
  switch (o.type) {
    case "statusexists":
      for (key in Pixpls.resources) {
        if (Pixpls.resources[key].status === o.status) {
          return "";
        }
      }
      return "Nothing is " + o.status + ".";
    case "status":
      if (Pixpls.resources[o.mod || r].status != ( o.status || "purchased" )) {
        return Pixpls.resource[o.mod || r].name + " is not " + (o.status || "purchased") + ".";
      }
      return "";
    case "minproperty": // resources[ value in the string or the passed arg][ the property is required] < resources[same resource][accepts a property name or a value]
      // This is not formatted well, but it's OK for stopgap.
      var s = (Pixpls.resources[o.resource2 || o.resource || r][o.val] || o.val) + " " + Pixpls.resources[o.resource || r].name;
      if (o.property != "num") {
        s += " " + o.property;
      }
      s += ".";
      return s;
    case "maxproperty":
      if (Pixpls.resources[o.resource || r][o.property] > (Pixpls.resources[o.resource || r][o.val] || o.val)) {
        return "Expand max capacity!";
      }
      return "";
    case "time":
      if (Pixpls.numTicks < o.num) {
        return "Wait " + ((o.num - Pixpls.numTicks) * (Pixpls.tickLength / 1000)) + " more seconds.";
      }
      return "";
    case "true": // We don't need all of these, default will handle it, but let's explicitly state that we aren't handling it.
    case "false":
    case "dev":
    case "setproperty":
    case "addproperty":
    case "mulproperty":
    case "stringmap":
    case "showel":
    case "hideel":
    case "purchase":
    case "description":
    case "log":
    case "default":
    default:
      return "";
  }
}

function htmlFunction(o, r) {

}
