Pixpls.Mods = {
  update: function() {
    for (var i = 0; i < this.unavailableMods.length; i++) {
      if (this.unavailableMods[i].makeAvailable()) {
        this.displayMod(this.unavailableMods[i]);
      }
    }

    for (var i = 0; i < this.availableMods.length; i++) {
      this.availableMods[i].update();
    }

    for (var i = 0; i < this.hiddenMods.length; i++) {
      if (this.hiddenMods[i].makeAvailable()) {
        this.hiddenMods[i].buy();
        var d = this.hiddenMods[i];
        this.hiddenMods.splice(i, 1);
        delete d;
      }
    }

    if (this.availableMods.length == 0) {
      $(".available").hide();
    } else {
      $(".available").show();
    }

    if (this.purchasedMods.length == 0) {
      $(".purchased").hide();
    } else {
      $(".purchased").show();
    }
  },
  render: function() {
    var div = $(".mods"); // Should I just define this as div: $("<div class="mods" />"); ?
//    div.empty();

    // var divUnavailable = $("<div />");
    // divUnavailable.addClass("unavailable");
    // divUnavailable.append("<h4>Undisplayed Mods</h4>");
    // divUnavailable.hide();
    $(".unavailable").hide();

    // var divAvailable = $("<div />");
    // divAvailable.addClass("available");
    // divAvailable.append("<h4>Available</h4>");
    $(".available").hide();

    // var divPurchased = $("<div />");
    // divPurchased.addClass("purchased");
    // divPurchased.append("<h4>Purchased</h4>");
    $(".purchased").hide();

    // div.append(divUnavailable);
    // div.append(divAvailable);
    // div.append(divPurchased);

    div.hide();
  },

  displayMod: function(mod) {
    var index;
    for (index = 0; index < this.unavailableMods.length; index++) {
      if (mod.label == this.unavailableMods[index].label) {
        break;
      }
    }

    if (index < 0 || index > this.unavailableMods.length) {
      console.log ("We have a problem.  " + mod.name + " is trying to display, but is not in unavailableMods.");
      return;
    }

    this.unavailableMods.splice(index, 1);
    this.availableMods.push(mod);

    //mod.div.detach();
    $(".available").append(mod.div);
  },
  purchaseMod: function(mod) {
    var index;
    for (index = 0; index < this.availableMods.length; index++) {
      if (mod.label == this.availableMods[index].label) {
        break;
      }
    }

    if (index < 0 || index >= this.availableMods.length) {
      console.log ("We have a problem.  " + mod.name + " is trying to purchase, but is not in availableMods.");
      return;
    }

    this.availableMods.splice(index, 1);
    this.purchasedMods.push(mod);

    //mod.div.detach();
    mod.buttonSpan.remove();
    $(".purchased").append(mod.div);
  },

  purchased: function(modLabel) {
    for (var i = 0; i < this.purchasedMods.length; i++) {
      if (this.purchasedMods[i].label == modLabel) {
        return true;
      }
    }

    return false;
  },

  unavailableMods: [],
  availableMods: [],
  purchasedMods: [],
  hiddenMods: []
};

function Mod (params) {
  this.name = params.name || "";
  this.label = params.label || "";
  this.description = params.description || "";
  this.flavorText = params.flavorText || "";
  this.message = params.message || "Buy";
  this.hidden = params.hidden || false;

  var t = this;
  this.makeAvailable = params.makeAvailable || function() { return false; };
  this.affordable = params.affordable || function() { return true; };
  this.buy = params.buy || function() { new Log({message: "Bought " + t.name + "."}); };

  if (this.hidden != true) {
    Pixpls.Mods.unavailableMods.push(this);
    this.render();
  } else {
    Pixpls.Mods.hiddenMods.push(this);
  }
};
Mod.prototype.update = function() {
  if ( this.affordable()) {
    this.notButton.css({display: "none"});
    this.button.css({display: "block"});
    //this.notButton.hide();
    //this.button.show();
  }
  if ( !this.affordable()) {
    this.notButton.css({display: "inline"});
    this.button.css({display: "none"});
    // this.notButton.show(); // Show and hide keep freaking out... but why?
    // this.button.hide();
  }
};
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
