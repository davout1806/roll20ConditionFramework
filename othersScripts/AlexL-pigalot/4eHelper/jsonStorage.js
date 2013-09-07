/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.
 */

/*
	Warning:	You can't get an object by name or id in the on creation event for that item, 
				the object provided by the event should be used instead.
*/

function jsonStorage(scriptName, args) {
	var utl = new utility("JsonStorage:" + scriptName);
	
	this._object;
	
	this._scriptName = scriptName;
	
	// Load obj from JSON string in _field of _object.
	this.load = function() {
		var obj = {};
		if(this._object !== undefined && "get" in this._object) {
			var objId = this._object.get("_id");
			var stateObject = this._scriptName + "_" + objId;
		
			if(objId in state) {
				// Get the JSON string from state.
				var jsonStr = state[stateObject];
				
				try {
					obj = JSON.parse(jsonStr);

				} catch(e) {
					utl.logWarning("Bad JSON string in load: " + jsonStr);
				}
			}
		} else {
			// Couldn't find a valid object.
			utl.logError("Failed to find valid object (load).");
		}
		return obj;
	};
	
	// Save obj to _field in _object as a JSON string.
	this.save = function(obj) {
		if(this._object !== undefined && "get" in this._object) {
			var objId = this._object.get("_id");
			var stateObject = this._scriptName + "_" + objId;
			
			var jsonStr = utl.getJSONString(obj);

			state[stateObject] = jsonStr;
		} else {
			// Couldn't find a valid object.
			utl.logError("Failed to find valid object (save).");
		}
	};
	
	/*
		Constructor
	*/
	
	// Check that arguments have been provided to the constructor.
	if(args && Object.keys(args).length == 1) {
		if("obj" in args) {
			// A Roll20 object has been passed.
			if("get" in args.obj) {
				// The object is a roll20 object.
				this._object = args.obj;
				
			} else {
				// Couldn't find a valid object.
				utl.logError("Failed to find valid roll20 object (constructor).");
			}
		} else {
			utl.logError("No valid arguments provided.");
		}
	} else if(args && Object.keys(args).length == 2) {
		if("type" in args) {
			// The Type of the object has been passed.				
			if("name" in args) {
				// The name of the object has been passed.
				
				var obj = {};
				
				if(args.type == "token" || args.type == "graphic") {
					if("pageid" in args) {
						// Find the object using its name and page.
						obj = findObjs({ _type: args.type, name: args.name, _pageid: args.pageid });
					} else {
						// No pageid provided.
						utl.logError("You must provide a pageid to get a token or graphic by its name.");
					}
				} else {
					// Find the object using its name.
					obj = findObjs({ _type: args.type, name: args.name });
				}
				
				if(obj.length == 1) {
					obj = obj[0];
					if("get" in obj) {
						// The character object is valid.
						this._object = obj;
					} else {
						// Couldn't find a valid object.
						utl.logError("Failed to find valid object (constructor).");
					}
				} else {
					utl.logError("Failed to find single object.");
				}
			} else if("id" in args) {
				// The id of the character has been passed.
				// Find the character object using its id.
				var obj = getObj(args.type, args.id);
				if("get" in obj) {
					// The character object is valid.
					this._object = obj;
				} else {
					// Couldn't find a valid object.
					utl.logError("Failed to find valid object (constructor).");
				}
			} else {
				// No valid arguments provided.
				utl.logError("No valid arguments provided.");
			}
		} else {
			// No type provided.
			utl.logError("No type provided.");
		}
	} else {
		// No arguments provided or to many arguments provided.
		utl.logError("No arguments provided.");
	}
}