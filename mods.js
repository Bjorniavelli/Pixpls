Pixpls.Mods = {
  list: [],

  update: function() {
    for (key in this.unavailableMods) {
      if (this.unavailableMods[key].makeAvailable()) {
        this.displayMod(this.unavailableMods[key]);
      }
    }

    for (key in this.availableMods) {
      this.availableMods[key].update();
    }

    for (key in this.hiddenMods) {
      if (this.hiddenMods[key].makeAvailable()) {
        this.hiddenMods[key].buy();
        this.hiddenQueue.push(this.hiddenMods[key].label);
        delete this.hiddenMods[key];
        // var d = this.hiddenMods[i];
        // this.hiddenMods.splice(i, 1);
        // delete d;
      }
    }

    if (this.availableMods === {}) {
      $(".available").hide();
    } else {
      $(".available").show();
    }

    if (this.purchasedMods === {}) {
      $(".purchased").hide();
    } else {
      $(".purchased").show();
    }
  },
  init: function() {
    var div = $(".mods"); // Should I just define this as div: $("<div class="mods" />"); ?
    $(".unavailable").html("<h4>Unavailable Mods - Shouldn't ever display</h4>");
    $(".unavailable").hide();
    $(".available").html("<h4>Available</h4>");
    $(".available").hide();
    $(".purchased").html("<h4>Purchased</h4>");
    $(".purchased").hide();
    div.hide();
  },

  displayMod: function(mod) {
    if (!this.unavailableMods[mod.label]) {
      console.log ("We have a problem.  " + mod.name + " is trying to display, but is not in unavailableMods.");
      return;
    }

    this.availableMods[mod.label] = this.unavailableMods[mod.label];
    delete this.unavailableMods[mod.label];

    //mod.div.detach();
    $(".available").append(mod.div);
  },
  purchaseMod: function(mod) {
    if (!this.availableMods[mod.label]) {
      console.log ("We have a problem.  " + mod.name + " is trying to purchase, but is not in availableMods.");
      return;
    }

    this.purchasedMods[mod.label] = this.availableMods[mod.label];
    delete this.availableMods[mod.label];

    //mod.div.detach();
    mod.buttonSpan.remove();
    $(".purchased").append(mod.div);
  },

  purchased: function(modLabel) {
    if (this.purchasedMods[modLabel]) {
      return true;
    }

    return false;
  },
};

function HiddenMod (params) {
  Resource.call(this, params);
  this.makeAvailable = params.makeAvailable || "returnFalse";
  this.affordable = params.affordable || "returnTrue";
  this.buy = params.buy || "defaultBuy";

  this.status = params.status || "hidden";

  Pixpls.resources[this.label] = this;
  Pixpls.Mods.list.push(this.label);
}
HiddenMod.prototype = Object.create(Resource.prototype);

function Mod (params) {
  HiddenMod.call(this, params);

  this.status = params.status || "unavailable";
  this.render();
};
Mod.prototype = Object.create(HiddenMod.prototype);

Mod.prototype.update = function() {
  if ( this.affordable()) {
    this.notButton.css({display: "none"});
    this.button.css({display: "block"});
  }
  if ( !this.affordable()) {
    this.notButton.css({display: "inline"});
    this.button.css({display: "none"});
  }
};
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
