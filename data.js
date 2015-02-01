Pixpls.Data = {
  newResource: function(r) {
    var newR;
    switch (r.type) { // I wonder if I could make an object and reference these as just newR = new ClassContainer[r.type](); ?
      case "generator":
        newR = new Generator(r);
        break;
      case "craft":
        newR = new Craft(r);
        break;
      case "hidden":
        newR = new HiddenMod(r);
        break;
      case "mod":
        newR = new Mod(r);
        break;
      default:
        newr = new Resource(r);
        break;
    }
    // Is there a better conditional here?
    if (newR.status == "hiddenPurchased" && newR.load == true) {
      newR.buy();
    }
  },

  tabList: [
    {
      label: "generators",
      name: "Generators",
      type: "generator",
    },
    {
      label: "heroes",
      name: "Hero",
      type: "hero"
    },
    {
      label: "crafts",
      name: "Crafting",
      type: "craft"
    },
    {
      label: "buildings",
      name: "Camp",
      type: "building"
    },
    {
      label: "helps",
      name: "Help",
      type: "help",
    },
    {
      label: "settings",
      name: "Settings",
      type: "setting"
    }
  ],

  resourceList: [
    // Generators
    {
      label: "click",
      type: "generator",
      name: "Click",
      message: "Click!",
      enabled: true,
      flavorText: "Strangely, they give off an appetizing aroma: Ozone and Umamclicki.",
      baseCost: 0,
      maxNum: 10,
      _makeAvailable: [{ type: "true" }],
      _affordable: [{ type: "maxproperty", resource: "click", property: "num", val: "maxNum" }]
    },{
      label: "pixel",
      type: "generator",
      name: "Pixel",
      _produceTarget: "click",
      _costTarget: "click",
      baseProduce: -1,
      maxNum: 1,
      flavorText: "Little dots that shine?  Fantastic!"
    },{
      label: "renderer",
      type: "generator",
      name: "Renderer",
      num: 0,
      _produceTarget: "pixel",
      _costTarget: "pixel",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "All we have to do is make more pixels?  That doesn't seem so hard."
    },{
      label: "extruder",
      type: "generator",
      name: "Extruder",
      _produceTarget: "renderer",
      _costTarget: "renderer",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "Imagine a snail leaving behind a sticky residue.  It's gross.  Actually, it's not like that.  But it's still gross."
    },{
      label: "electronicskit",
      type: "generator",
      name: "Electronics Kit",
      _produceTarget: "extruder",
      _costTarget: "extruder",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "A virtual toolbox for making more virtual stuff.  Makes sense."
    },{
      label: "factory",
      type: "generator",
      name: "Factory",
      _produceTarget: "electronicskit",
      _costTarget: "electronicskit",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "Making things by hand is so 18th centicycle.  They work better when we make them en masse.  That's French for en masse."
    },{
      label: "cementprinter",
      type: "generator",
      name: "Cement Printer",
      _produceTarget: "factory",
      _costTarget: "factory",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "Virtual Factories are made out of virtual cement.  That's the secret ingredient.  The other secret ingredient is virtual secrets."
    },{
      label: "designlab",
      type: "generator",
      name: "Design Lab",
      _produceTarget: "cementprinter",
      _costTarget: "cementprinter",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "It's not so much useful as a place to put all those hipxlsters."
    },{
      label: "ai",
      type: "generator",
      name: "AI",
      _produceTarget: "designlab",
      _costTarget: "designlab",
      baseProduce: 0.0005,
      maxNum: 1,
      flavorText: "Everybody run away from the singularity!"
    },

    // Crafts

    {
      label: "pixeldust",
      type: "craft",
      name: "Pixel Dust",
      //_produceTarget: "pixeldust", // Creates dust, but doesn't do it automatically
      _costTarget: "click",
      baseProduce: 0,
      maxNum: 10,
      flavorText: "It's not made out of pixels.  That'd be crazy!"
    },

    // Mods
    {
      label: "uselessupgrade",
      type: "mod",
      name: "Test Upgrade",
      description: "Just checking to see if the upgrade display is working.",
      _makeAvailable: [{ type: "dev" }],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "log", message: "Congratulations!  You bought a useless upgrade!" },
        { type: "purchase" }
      ]
    },{
      label: "debugclicks",
      type: "mod",
      name: "Check Clicks",
      description: "Add 10,000,000 clicks.",
      _makeAvailable: [{ type: "dev" }],
      _affordable: [{ type: "true" }],
      _buy: [{ type: "addproperty", resource: "click", property: "num", val: 10e6 }]
    },{
      label: "debugpixels",
      type: "mod",
      name: "Check Pixels",
      description: "Add 1,000 pixels.",
      _makeAvailable: [{ type: "dev" }],
      _affordable: [{ type: "true" }],
      _buy: [{ type: "addproperty", resource: "pixel", property: "num", val: 1000 }]
    },{
      label: "maxclicks",
      type: "mod",
      name: "Increase Max Clicks",
      description: "Yer buffers're full, bae!  Ye cannot hold n'more!  Sacrifice some ta further th' bale.",
      _makeAvailable: [
        { type: "minproperty", resource: "click", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "click", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "click", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxpixels",
      type: "mod",
      name: "Increase Screen Density",
      description: "Real Estate, the only investment that can never be created or destroyed.  Luckily, technojumble will let us just increase the number of pixels who can comfortably live there.",
      _makeAvailable: [
        { type: "minproperty", resource: "pixel", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "pixel", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "pixel", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxren",
      type: "mod",
      name: "Alchemistry",
      description: "No sense in changing your renderers from goo to goold, but surely we can make them lighter and less unwieldy.",
      _makeAvailable: [
        { type: "minproperty", resource: "renderer", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "renderer", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "renderer", property: "num", val: 0.1 }, // This might be a pretty steep cost...
        { type: "undisplay" }
      ]
    },{
      label: "maxextruders",
      type: "mod",
      name: "Slurm Additives",
      description: "Shut up and take my money!",
      _makeAvailable: [
        { type: "minproperty", resource: "extruder", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "extruder", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "extruder", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxelectronicskits",
      type: "mod",
      name: "Positronic Electrons",
      description: "Let's change the laws of physics some, and allow us to carry more electronics kits.",
      _makeAvailable: [
        { type: "minproperty", resource: "electronicskit", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "electronicskit", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "electronicskit", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxfactorys",
      type: "mod",
      name: "Zoning",
      description: "Let's set aside some virtual space for factories instead of those useless Pixpls.  Maybe we'll let the Pixpls live in the factorys.", // Yah, I know, but we don't have plural strings, yet.
      _makeAvailable: [
        { type: "minproperty", resource: "factory", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "factory", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "factory", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxcementprinters",
      type: "mod",
      name: "Stronger Cement",
      description: "We need more cement printers!  Don't worry, the new slurry is more efficient.",
      _makeAvailable: [
        { type: "minproperty", resource: "cementprinter", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "cementprinter", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "cementprinter", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxdesignlabs",
      type: "mod",
      name: "Manufacture uglier BCGs",
      description: "Those hipxlsters are feeling too popular.  Let's uggify them.",
      _makeAvailable: [
        { type: "minproperty", resource: "designlab", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "designlab", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "designlab", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]
    },{
      label: "maxais",
      type: "mod",
      name: "Become More Human",
      description: "We aren't actually building more AIs, we're just making a more schizophrenic AI.  Let's shatter that psyche a bit more.",
      _makeAvailable: [
        { type: "minproperty", resource: "ai", property: "num", val: "maxNum" }
      ],
      _affordable: [{ type: "true" }],
      _buy: [
        { type: "mulproperty", resource: "ai", property: "maxNum", val: 10 },
        { type: "mulproperty", resource: "ai", property: "num", val: 0.1 },
        { type: "undisplay" }
      ]

      // In here, we need to add more mods for increasing max num of the generators.
      // generator buy amounts
      // generator produce amounts
      // generator cost increase amounts
      // generator... can we drop down which thing it costs?  Like make renderers cost clicks instead of pixels?, extruders to pixels and then clicks, etc?


    },{
      label: "redgluttony",
      type: "mod",
      name: "Reduce Gluttony",
      description: "Those pixels seem to be eating an inordinate amount.  Maybe you're clicking wrong?  This will train you.",
      _makeAvailable: [{ type: "minproperty", resource: "pixel", property: "num", val: 3 }],
      _affordable: [{ type: "minproperty", resource: "click", property: "num", val: 5 }],
      _buy: [
        { type: "addproperty", resource: "click", property: "num", val: -10 },
        { type: "setproperty", resource: "pixel", property: "costPower", val: 16 },
        { type: "stringmap", function: "setclickcostpower" },
        { type: "description", resource: "redgluttony", text: "The pixels are still eating the same amount.  You're just producing more efficiently." },
        { type: "log", message: "Ohhhh!  You were using an inverse phase relation on your mouse.  We'll filter out those Star Trekian woes.  That will make clicks more nutritious." },
        { type: "purchase" }
      ]
    },{
      label: "redgluttony2",
      type: "mod",
      name: "Further Reduce Gluttony",
      description: "Well, that didn't work... Turns out some of your pixels just got hungrier.  Maybe we should cull the hungry ones?",
      _makeAvailable: [{ type: "status", mod: "redgluttony" }],
      // This affordable isn't going to work right, because it's not auto-updating.
      //_affordable: [{ type: "resourcenum", resource: "pixel", num: Math.pow(2, 16 / Pixpls.Generators.list["pixel"].costPower)}],
      _affordable: [{ type: "minproperty", resource: "pixel", property: "num", val: 10 }], // This isn't the auto-magical part.  We'll see if we can fix that later.
      _buy: [
        { type: "mulproperty", resource: "pixel", property: "num", val: "0.5" },
        { type: "mulproperty", resource: "pixel", property: "costPower", val: "0.5" },
        { type: "stringmap", function: "adjustclickcostpower" },
        { type: "description", resource: "redgluttony2", text: "Better.  Turns out Pixel Darwinism is working.  Try again!" },
        // this one isn't going to update the variable it's including...
        { type: "log", message: "*Jargon* *Jargon* Fun fact: In Star Trek scripts, they just wrote 'Jargon' and they got really good at making stuff up.  Pixel cost exponent cut in half." },
      ]
    },{
      label: "clickchef",
      type: "mod",
      name: "Click Preparation",
      description: "Clicks are eating too much!  You're starving!  But maybe if you hired a chef, you'd be able to reduce your raw click consumption.",
      _makeAvailable: [{ type: "minproperty", resource: "pixel", property: "numLost", val: 4 }],
      _affordable: [
        { type: "minproperty", resource: "click", property: "num", val: 5 },
        { type: "minproperty", resource: "pixel", property: "num", val: 1 }
      ],
      _buy: [
        { type: "addproperty", resource: "click", property: "num", val: -5 },
        { type: "addproperty", resource: "pixel", property: "num", val: -1 },
        { type: "mulproperty", resource: "pixel", property: "baseProduce", val: 0.1 },
        { type: "description", text: "Happy Chef!  He chops and sizzles pixels into a tasty slurry.  But you understand little of what he says." },
        { type: "log", message: "One pixel reassigned to cheffery." },
        { type: "purchase" }
      ]
    },{
      label: "clickchef2",
      type: "mod",
      name: "Click Preparation II",
      description: "Your chef is obviously overworked.  Maybe you should hire someone to assist him.",
      _makeAvailable: [
        { type: "minproperty", resource: "pixel", property: "numLost", val: 6 },
        { type: "status", mod: "clickchef" }
      ],
      _affordable: [
        { type: "minproperty", resource: "click", property: "num", val: 25 },
        { type: "minproperty", resource: "pixel", property: "num", val: 1 }
      ],
      _buy: [
        { type: "addproperty", resource: "click", property: "num", val: -25 },
        { type: "addproperty", resource: "pixel", property: "num", val: -1 },
        { type: "mulproperty", resource: "pixel", property: "baseProduce", val: 0.1 },
        { type: "description", text: "Bork! Bork! Bork! Doesn't seem very effective, but the Chef is sure more productive, somehow." },
        { type: "log", message: "One pixel reassigned to chef assistantery." },
        { type: "purchase" }
      ]
    },{ //B7UmUX68KtE
      label: "clickchef3",
      type: "mod",
      name: "Click Preparation III",
      description: "Just two can't provide for all your Pixpls!  You better hire something to prepare the clicks for your chef staff.",
      _makeAvailable: [
        { type: "minproperty", resource: "pixel", property: "numLost", val: 10 },
        { type: "status", mod: "clickchef2" }
      ],
      _affordable: [
        { type: "minproperty", resource: "click", property: "num", val: 125 },
        { type: "minproperty", resource: "pixel", property: "num", val: 1 }
      ],
      _buy: [
        { type: "addproperty", resource: "click", property: "num", val: -125 },
        { type: "addproperty", resource: "pixel", property: "num", val: -1 },
        { type: "mulproperty", resource: "pixel", property: "baseProduce", val: 0.1 },
        { type: "description", text: "Makin' di Popedicorn! Shrimpies!  Shrimpies?  Shrimpies!  B7UmUX68KtE" },
        { type: "log", message: "One pixel reassigned to uhhh... Shrimpies?" },
        { type: "purchase" }
      ]
    },{
      label: "pixelfarm",
      type: "mod",
      name: "Pixel Farming",
      description: "The chefs aren't keeping up.  Maybe another approach.  Can the pixels make their own food?",
      _makeAvailable: [
        { type: "minproperty", resource: "pixel", property: "numLost", val: 20 },
        { type: "status", mod: "clickchef3" }
      ],
      _affordable: [
        { type: "minproperty", resource: "click", property: "num", val: 625 },
        { type: "minproperty", resource: "pixel", property: "num", val: 1 }
      ],
      _buy: [
        { type: "minproperty", resource: "click", property: "num", val: -625 },
        { type: "minproperty", resource: "pixel", property: "num", val: -1 },
        { type: "setproperty", resource: "pixel", property: "baseProduce", val: "0.001" },
        { type: "description", text: "You refactor some of your clicks as seeds.  One lonely pixel is responsible for their farming." },
        { type: "log", message: "Agriclicktural revolution?  Boundless wealth will soon be <s>theirs</s> yours!" },
        { type: "purchase" }
      ]
    },{
      label: "renrate",
      type: "mod",
      name: "Renderers",
      description: "Those Renderers are sloooooooooow.  Maybe we can speed them up?",
      _makeAvailable: [{ type: "minproperty", resource: "renderer", property: "num", val: 1 }],
      _affordable: [
        { type: "minproperty", resource: "renderer", property: "num", val: 2 },
        { type: "minproperty", resource: "pixel", property: "num", val: 5 }
      ],
      _buy: [
        { type: "addproperty", resource: "pixel", property: "num", val: -5 },
        { type: "mulproperty", resource: "renderer", property: "num", val: 0.5 },
        { type: "description", text: "If we combine them together, it turns out they produce twice as fast!" },
        { type: "log", message: "Combining things willy nilly like that just seems... icky." },
        { type: "mulproperty", resource: "renderer", property: "baseProduce", val: 2 },
        { type: "purchase" }
      ]
    },{
      label: "renrate2",
      type: "mod",
      name: "Rendererers",
      description: "Doubling is Ok.  But can we emit pixels at a faster rate?",
      _makeAvailable: [{ type: "minproperty", resource: "renderer", property: "num", val: 3 }],
      _affordable: [
        { type: "minproperty", resource: "renderer", property: "num", val: 3 },
        { type: "minproperty", resource: "pixel", property: "num", val: 5 },
        { type: "status", mod: "renrate" }
      ],
      _buy: [
        { type: "addproperty", resource: "pixel", property: "num", val: -5 },
        { type: "mulproperty", resource: "renderer", property: "num", val: (1/3) },
        { type: "mulproperty", resource: "renderer", property: "baseProduce", num: 3 },
        { type: "description", text: "Cool, it turns out these renderers will just sort of adhere to each other.  But they're getting bulky." },
        { type: "log", message: "A six-fold improvement!  Well, over the original." },
        { type: "purchase" }
      ]
    },{
      label: "renrate3",
      type: "mod",
      name: "Rerendererers",
      description: "Is this like a prophxlactic?  Maybe we can...",
      _makeAvailable: [{ type: "minproperty", resource: "renderer", property: "num", val: 10 }],
      _affordable: [
        { type: "minproperty", resource: "renderer", property: "num", val: 10 },
        { type: "minproperty", resource: "pixel", property: "num", val: 5 },
        { type: "status", mod: "renrate2" }
      ],
      _buy: [
        { type: "addproperty", resource: "pixel", value: "num", val: -5 },
        { type: "mulproperty", resource: "renderer", value: "num", val: 0.1 },
        { type: "mulproperty", resource: "renderer", value: "num", val: 2 },
        { type: "description", text: "Now we're getting somewhere!  Orders of magnitude!" },
        { type: "log", message: "Don't encourage the pixels, encourage the pixelators!" },
        { type: "purchase" }
      ]
    },{
      label: "renrate4",
      type: "mod",
      name: "Renderers the Next Generation",
      description: "We should start from scratch.  We've learned a lot.  Will the next generation work better?",
      _makeAvailable: [{ type: "minproperty", resource: "renderer", property: "num", val: 10 }],
      _affordable: [
        { type: "minproperty", resource: "renderer", property: "num", val: 10 },
        { type: "minproperty", resource: "pixel", property: "num", val: 10 },
        { type: "status", mod: "renrate3" }
      ],
      _buy: [
        { type: "addproperty", resource: "pixel", property: "num", val: -5 },
        { type: "mulproperty", resource: "renderer", property: "num", val: 0 },
        { type: "setproperty", resource: "renderer", property: "baseProduce", val: 1 },
        { type: "description", text: "This generation of renderers seems much more effective.  Also, they smell better." },
        { type: "log", message: "Scorched Earth!  But maybe you should see how the new renderers work!" },
        { type: "purchase" }
      ]
    },{ // I need 4 +/- mods for increasing the produce rate of each generator, but I don't really know how I want to handle the story aspect of that...
      label: "extrate",
      type: "mod",
      name: "More Electronic",
      description: "Who developed these things?  It's just somewhere at the bottom of the uncanny valley.  Perhaps if we made them less realistic, they'd be more effective?",
      _makeAvailable: [{ type: "minproperty", resource: "extruder", property: "num", val: 1 }],
      _affordable: [
        { type: "minproperty", resource: "extruder", property: "num", vale: 1 },
      ],
      _buy: [
        { type: "addproperty", resource: "extruder", property: "num", val: -1 },
        { type: "setproperty", resource: "extruder", property: "baseProduce", val: 0.1 },
        { type: "description", text: "These things are creepier.  They're now just slime-producers with giant rows of flashing lights and a noxious odor that leaves a taste in the back of your throat." },
        { tyoe: "log", message: "Extruders are way more productive now." },
        { type: "purchase" }
      ]
    },

    //Hidden Mods
    {
      label: "showgenerator",
      type: "hidden",
      name: "Show Generator Menu",
      description: "This should be hidden, but it will enable the generator menu after a short time.",
      _makeAvailable: [{ type: "time", num: 10 }],
      _buy: [
        { type: "showel", el: "#generators" },
//        { type: "showel", el: "#generators, .click"},
        { type: "log", message: "This *is* a clicky game.  How about some tasty, endorphin-producing clicking?" },
        { type: "purchase" }
      ],
      load: true // This will show the logs, too... ARGH!
    },{
      label: "showmods",
      type: "hidden",
      name: "Show Mods",
      descripton: "This wil make the mods available when there are some.",
      _makeAvailable: [
        { type: "time", num: 20 },
        { type: "statusexists", status: "available" },
      ],
      _buy: [
        { type: "showel", el: ".mods" },
        { type: "purchase" }
      ],
      load: true
    },{
      label: "showtabs",
      type: "hidden",
      name: "Show Tab Menu",
      description: "This will begins unlocking the second phase of the game.",
      _makeAvailable: [{ type: "false" }], // doesn't do anything, yet...
      _buy: [
        { type: "showel", el: ".tabs" },
        { type: "purchase" }
      ],
      load: true
    }
  ],

  functionList: {
    // Defaults
    // Affordable Helpers
    // Buy Helpers
    setclickcostpower: function(m) {
      Object.defineProperty(Pixpls.resources["pixel"], "cost", {
        get: function() { return Math.pow( Math.floor(Pixpls.resources["pixel"].num), Pixpls.resources["pixel"].costPower ) + 1; },
        configurable: true
      });
    },
    adjustclickcostpower: function(m) {
      // I could make a new string handler that takes a bool string handler list and a function handler list for this, but that seems complex.
      if (Pixpls.resources["pixel"].costPower <= 2) { // This stuff is duplicated in the stringmap, but it's not set up for conditionals, atm.
        Pixpls.resources[m].purchase();
        Pixpls.resources[m].description = "Did you hear the one about the farmer who tried to train his horse to eat a single oat a day?  It worked until the stupid horse up and died.  Probably don't want to repeat that experiment."
        Pixpls.resources[m].updateDescription();
      }
    }
  }
}
