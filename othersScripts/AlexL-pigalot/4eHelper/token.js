/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.
 */

var tokenUtility = {

	utl : new utility("tokenUtility"),
	tokenCashe : {},
	createToken : function(obj) {
		var ret = {};
		if("get" in obj) {
			var id = obj.get("_id");
			if(id in tokenUtility.tokenCashe) {
				ret = tokenUtility.tokenCashe[id];
			} else {
				var t = new token({ "obj":obj });
				if("getRoll20" in t) {
					tokenUtility.tokenCashe[id] = t;
					ret = tokenUtility.tokenCashe[id];
				} else {
					tokenUtility.utl.logError("Could not create token (createToken).");
				}
			}
		} else {
			tokenUtility.utl.logError("No valid object provided (createToken).");
		}
		return ret;
	}
};

function token(args) {
	var utl = new utility("token");

	this._tokenObject;
	this._tokenStorage;
	
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
		return this._tokenObject.get(field);
	};
	
	this.setRoll20 = function(field, value) {
		this._tokenObject.set(field, value);
	};
	
	// radius is in squares. This only counts tokens that are representing a character.
	this.getTokensInBurst = function(radius) {
		var id = this.getRoll20("_id");
        var left = this.getRoll20("left");
        var top = this.getRoll20("top");
		var rad = radius * 70;
	
		var results = filterObjs(function(object) {    
            if(object.get("_subtype") == "token" && utl.between(object.get("left"), left - rad, left + rad) && utl.between(object.get("top"), top - rad, top + rad) && object.get("_represents") != "" && object.get("_id") != id) return true;    
            else return false;
        });
		
		var ret = [];
		_.each(results, function(object) {
			var t = tokenUtility.createToken(object);
			if("getRoll20" in t) {
				ret.push(t);
			}
		});
		return ret;
	};
	
	// Get blast with token in top left.
	this.getTokensInBlast = function(diameter) {
		var id = this.getRoll20("_id");
        var left = this.getRoll20("left");
        var top = this.getRoll20("top");
		var dia = (diameter - 1) * 70;
	
		var results = filterObjs(function(object) {    
            if(object.get("_subtype") == "token" && utl.between(object.get("left"), left, left + dia) && utl.between(object.get("top"), top, top + dia) && object.get("_represents") != "" && object.get("_id") != id) return true;    
            else return false;
        });
		
		var ret = [];
		_.each(results, function(object) {
			var t = tokenUtility.createToken(object);
			if("getRoll20" in t) {
				ret.push(t);
			}
		});
		return ret;
	}
	
	this.getTokensUnderThis = function() {
		return this.getTokensInBurst(0);
	};
	
	/*
		Constructor
	*/
	
	// Check that arguments have been provided to the constructor.
	if(args && Object.keys(args).length == 1) {
		if("obj" in args) {
			// A Roll20 token object has been passed.
			if("get" in args.obj) {
				// The token object is valid.
				this._tokenObject = args.obj;
			}
		} else if("name" in args && "pageid" in args) {
			// The name of the token has been passed.
			// Find the token object using its name and the id of the page its on.
			var obj = findObjs({ _type: "graphic", name: args.name, _pageid: args.pageid });
			
			if(obj.length == 1) {
				obj = obj[0];
				if("get" in obj) {
					// The token object is valid.
					this._tokenObject = obj;
				}
			} else {
				utl.logError("Failed to find single object.");
			}
		} else if("id" in args) {
			// The id of the token has been passed.
			// Find the token object using its id.
			var obj = getObj("graphic", args.id);
			if("get" in obj) {
				// The token object is valid.
				this._tokenObject = obj;
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
	if(this._tokenObject != undefined && "get" in this._tokenObject) {
		this._tokenStorage = new jsonStorage("GameManager", { "obj":this._tokenObject });
	}
}