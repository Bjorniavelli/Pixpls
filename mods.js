function Mod (params) {
  this.name = params.name || "";
  this.label = params.label || "";
  this.description = params.description || "";
  this.hidden = params.hidden || false;

  var t = this;
  this.makeAvailable = params.makeAvailable || function() { return false; };
  this.affordable = params.affordable || function() { return true; };
  this.buy = params.buy || function() { new Log({message: "Bought " + t.name + "."}); };

  if (this.hidden != true) {
    this.div = $("<div />");
    this.div.addClass(this.label);
    this.div.addClass("mod");
    this.buttonSpan = $("<span />");
    this.buttonSpan.addClass("buttonSpan");
    this.button = $("<button />");
    this.button.html("Buy!");
    this.notButton = $("<s />");
    this.notButton.html("Buy");

    this.render();
  }

  if (this.hidden) {
    Pixpls.Mods.hiddenMods.push(this);
  } else {
    Pixpls.Mods.unavailableMods.push(this);
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
  this.div.html("<p class=\"name\">" + this.name + "</p>");
  this.div.append("<p class=\"description\">" + this.description + "</p>");
  this.div.append(this.buttonSpan);

  this.buttonSpan.append(this.button);
  this.buttonSpan.append(this.notButton);

  if (this.buy) {
    var t = this;
    this.buttonSpan.on( "click", "button", function() { t.buy(); t.render(); } );
  }

  this.update();
};

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
      this.divAvailable.hide();
    } else {
      this.divAvailable.show();
    }

    if (this.purchasedMods.length == 0) {
      this.divPurchased.hide();
    } else {
      this.divPurchased.show();
    }
  },
  render: function() {
    this.div = $("<div />"); // Should I just define this as div: $("<div class="mods" />"); ?
    this.div.addClass("mods");

    this.divAvailable = $("<div />");
    this.divAvailable.addClass("available");
    this.divAvailable.append("<h4>Available</h4>");

    this.divPurchased = $("<div />");
    this.divPurchased.addClass("purchased");
    this.divPurchased.append("<h4>Purchased</h4>");

    this.div.append(this.divAvailable);
    this.div.append(this.divPurchased);

    $(".mods").replaceWith(this.div);
    $(".mods").hide();
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

    mod.render();
    this.divAvailable.append(mod.div);
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

    mod.div.detach();
    mod.buttonSpan.hide();
    this.divPurchased.append(mod.div);
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
}
