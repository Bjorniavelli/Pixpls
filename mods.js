// Pixpls.Mods = {
//   // list: [],
//   //
//   // update: function() {
//   //   for (key in this.unavailableMods) {
//   //     if (this.unavailableMods[key].makeAvailable()) {
//   //       this.displayMod(this.unavailableMods[key]);
//   //     }
//   //   }
//   //
//   //   for (key in this.availableMods) {
//   //     this.availableMods[key].update();
//   //   }
//   //
//   //   for (key in this.hiddenMods) {
//   //     if (this.hiddenMods[key].makeAvailable()) {
//   //       this.hiddenMods[key].buy();
//   //       this.hiddenQueue.push(this.hiddenMods[key].label);
//   //       delete this.hiddenMods[key];
//   //       // var d = this.hiddenMods[i];
//   //       // this.hiddenMods.splice(i, 1);
//   //       // delete d;
//   //     }
//   //   }
//   //
//   //   if (this.availableMods === {}) {
//   //     $(".available").hide();
//   //   } else {
//   //     $(".available").show();
//   //   }
//   //
//   //   if (this.purchasedMods === {}) {
//   //     $(".purchased").hide();
//   //   } else {
//   //     $(".purchased").show();
//   //   }
//   // },
//   init: function() {
//     var div = $(".mods"); // Should I just define this as div: $("<div class="mods" />"); ?
//     $(".unavailable").html("<h4>Unavailable Mods - Shouldn't ever display</h4>");
//     $(".unavailable").hide();
//     $(".available").html("<h4>Available</h4>");
//     $(".purchased").html("<h4>Purchased</h4>");
//     div.hide();
//   },
//
//   displayMod: function(mod) {
//     if (!this.unavailableMods[mod.label]) {
//       console.log ("We have a problem.  " + mod.name + " is trying to display, but is not in unavailableMods.");
//       return;
//     }
//
//     this.availableMods[mod.label] = this.unavailableMods[mod.label];
//     delete this.unavailableMods[mod.label];
//
//     //mod.div.detach();
//     $(".available").append(mod.div);
//   },
//   purchaseMod: function(mod) {
//     if (!this.availableMods[mod.label]) {
//       console.log ("We have a problem.  " + mod.name + " is trying to purchase, but is not in availableMods.");
//       return;
//     }
//
//     this.purchasedMods[mod.label] = this.availableMods[mod.label];
//     delete this.availableMods[mod.label];
//
//     //mod.div.detach();
//     mod.buttonSpan.remove();
//     $(".purchased").append(mod.div);
//   },
//
//   purchased: function(modLabel) {
//     if (this.purchasedMods[modLabel]) {
//       return true;
//     }
//
//     return false;
//   },
// };
