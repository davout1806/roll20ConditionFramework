/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.
 */

var characterUtility = {
	utl : new utility("characterUtility"),
	characterCashe : {},
	tokenLookup : {},
	createCharacter : function(obj) {
		var ret = {};
		if("get" in obj) {
			var id = obj.get("_id");
			if(id in characterUtility.characterCashe) {
				ret = characterUtility.characterCashe[id];
			} else {
				var t = new character({ "obj":obj });
				if("getRoll20" in t) {
					characterUtility.characterCashe[id] = t;
					ret = characterUtility.characterCashe[id];
				} else {
					characterUtility.utl.logError("Could not create character (createCharacter).");
				}
			}
		} else {
			characterUtility.utl.logError("No valid object provided (createCharacter).");
		}
		return ret;
	},
	loadCharacters : function() {
		var characters = findObjs({ _type:"character" });
		_.each(characters, function(obj) {
			var c = characterUtility.createCharacter(obj);
			c.getTokens();
		});
	}
};

function character(args) {
	var utl = new utility("character");
	
	var defaultAttributes = { "Hit Points":10, "Temporary Hit Points":0 };
	
	this._characterObject;
	this._characterStorage;
	this._characterAttributes = {};
	
	this._tokenList = {};
	
	this._initAttributes = function() {
		var id = this.getRoll20("_id");
		
		var chara = this;
		
		var objs = findObjs({ _type: "attribute", characterid: id });
		
		if(objs.length > 0) {
			_.each(objs, function(value) {
				if(value != undefined && "get" in value) {
					chara._characterAttributes[value.get("name")] = value;
				}
			});
		}
		
		_.each(defaultAttributes, function(value, key) {
			
			if(!(key in chara._characterAttributes)) {
				var obj = createObj("attribute", {
					name: key,
					current: value,
					max: value,
					characterid: id
				});
				
				if(obj != undefined && "get" in obj) {
					chara._characterAttributes[key] = obj;
				}
			}
			
			if(obj != undefined && "get" in obj) {
				chara._characterAttributes[key] = obj;
			}
		});
	};
	
	this.getAttribute = function(attribute) {
		if(attribute in this._characterAttributes) {
			return this._characterAttributes[attribute].get("current");
		} return undefined;
	};
	
	this.getAttributeMax = function(attribute) {
		if(attribute in this._characterAttributes) {
			return this._characterAttributes[attribute].get("max");
		} return undefined;
	};
	
	this.setAttribute = function(attribute, value) {
		if(attribute in this._characterAttributes) {
			this._characterAttributes[attribute].set("current", value);
		}
	};
	
	this.doDamage = function(type, amount) {
		if(amount != undefined) {
			var rdmg = amount;
			var thp = this.getAttribute("Temporary Hit Points");
			if(thp != undefined && thp > 0) {
				if(thp < amount) {
					rdmg = amount - thp;
					this.setAttribute("Temporary Hit Points", 0);
				} else {
					var rthp = thp - amount;
					this.setAttribute("Temporary Hit Points", rthp);
					rdmg = 0;
				}
			}
			
			var maxHp = this.getAttributeMax("Hit Points");
			var hp = this.getAttribute("Hit Points");
			
			var remHp = hp - rdmg;
			
			if(remHp <= (maxHp /2)) {
				// Bloodied
			}
			
			if(remHp <= 0) {
				// Unconscious
			}
			
			if(remHp <= (0 - (maxHp /2))) {
				// Dead
			}
			
			this.setAttribute("Hit Points", remHp);
		} else {
			// wtf
		}
	};
	
	this.heal = function(amount, isTemp) {
		if(isTemp) {
			var thp = this.getAttribute("Temporary Hit Points");
			if(thp <= amount) this.setAttribute("Temporary Hit Points", amount);
		} else {
			var maxHp = this.getAttributeMax("Hit Points");
			var hp = this.getAttribute("Hit Points");
			
			if(!(hp <= (0 - (maxHp /2)))) {
				if(hp < 0) hp = 0;
				var newHp = hp + amount;
				
				if(newHp > maxHp) newHp = maxHp;
				
				this.setAttribute("Hit Points", newHp);
			}
		}
	};
	
	this.get = function(field) {
		var data = this._characterStorage.load();
		
		if(data != undefined && field in data) {
			return data[field];
		}
		else return undefined;
	};
	
	this.set = function(field, value) {
		var data = this._characterStorage.load();
		
		if(data === undefined) {
			data = {};
		}
		data[field] = value;
		this._characterStorage.save(data);
	};
	
	this.getRoll20 = function(field) {
		return this._characterObject.get(field);
	};
	
	this.setRoll20 = function(field, value) {
		this._characterObject.set(field, value);
	};
	
	this.addToken = function(tokenObject) {
		if(tokenObject != undefined && "_tokenObject" in tokenObject) {
			if(tokenObject.getRoll20("_represents") === this.getRoll20("_id")) {
				var id = tokenObject.getRoll20("_id");
				this._tokenList[id] = tokenObject;
				characterUtility.tokenLookup[id] = this.getRoll20("_id");
			}
		}
	};
	
	this.getTokens = function() {
		var id = this.getRoll20("_id");
	
		var results = filterObjs(function(object) {    
            if(object.get("_subtype") == "token" && object.get("_represents") == id) return true;    
            else return false;
        });
		
		var c = this;
		
		_.each(results, function(obj) {
			c.addToken(tokenUtility.createToken(obj));
		});
	}
	
	this.startTurn = function() {
		utl.logDebug("Start of turn for " + this.getRoll20("name"));
	};
	
	this.endTurn = function() {
		utl.logDebug("End of turn for " + this.getRoll20("name"));
	};
	
	this.updateControl = function() {
		if(this.getRoll20("controlledby") != "") this.set("controlledby", this.getRoll20("controlledby"));
	};
	
	this.enable = function() {
		if(this.getRoll20("controlledby") == "") { 
			this.setRoll20("controlledby", this.get("controlledby"));
		}
	};
	
	this.disable = function() {
		if(this.getRoll20("controlledby") != "") { 
			this.setRoll20("controlledby", "");
		}
	};

	/*
		Constructor
	*/
	
	// Check that arguments have been provided to the constructor.
	if(args && Object.keys(args).length == 1) {
		if("obj" in args) {
			// A Roll20 character object has been passed.
			if("get" in args.obj) {
				// The character object is valid.
				this._characterObject = args.obj;
			}
		} else if("name" in args) {
			// The name of the character has been passed.
			// Find the character object using its name.
			var obj = findObjs({ _type: "character", name: args.name });
			
			if(obj.length == 1) {
				obj = obj[0];
				if("get" in obj) {
					// The character object is valid.
					this._characterObject = obj;
				}
			} else {
				utl.logError("Failed to find single object.");
			}
		} else if("id" in args) {
			// The id of the character has been passed.
			// Find the character object using its id.
			var obj = getObj("character", args.id);
			if("get" in obj) {
				// The character object is valid.
				this._characterObject = obj;
			}
		} else if("create" in args) {
			// Try to create a new character.
			if(Object.keys(args.create).length > 0) {
				if("name" in args.create) {
					var obj = createObj("character", { "name":args.create.name });
					if("get" in obj) {
						// The character object is valid.
						this._characterObject = obj;
						
						var id = this.getRoll20("_id");
						
						characterUtility.characterCashe[id] = this;
					}
				} else {
					utl.logError("Required arguments not provided for character creation.");
				}
			} else {
				utl.logError("No valid arguments provided for character creation.");
			}
		} else {
			// No valid arguments provided so throw an error.
			utl.logError("No valid arguments provided.");
		}
	} else {
		// No arguments provided or to many arguments provided so throw an error.
		utl.logError("No arguments provided.");
	}
	
	// Check the object was found.
	if(this._characterObject != undefined && "get" in this._characterObject) {
		this._characterStorage = new jsonStorage("GameManager", { "obj":this._characterObject });
		this.updateControl();
		this._initAttributes();
	}
}