/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.

 Update 1:

 Changed over my storage system to use state.
 Added function to access attributes from a character.
 Added Healing and Damage functions (they are aware of the ideas of bloodied, unconscious and dead but only heal does anything with it).

 */
// Main

var mainUtl = new utility("Main");

// On ready, init code here.
on("ready", function() {
	// Load all commands.
	command.commandList["createCharacter"] = { 
		argNumber:1, 
		discription:"Creates a character requires one argument.\n \"--name\" (or \"--n\") with a single parameter containing a text string of the intended name of the character.\n ie: !createCharacter --name(Alex)", 
		code:function(args) {
			if("n" in args) args["name"] = args.n;
			if("name" in args) {
				var c = new character({ "create":{ "name":args.name } });
				if("getRoll20" in c) {
					sendChat("createCharacter", args.name + " created successfully.");
				} else {
					sendChat("createCharacter", "Failed to create " + args.name + " see api log for details.");
				}
			} else {
				sendChat("createCharacter", "You must provide a name. Type \"!help --c(createCharacter)\" for help");
			}
		}
	};
	
	// Load the characters.
	characterUtility.loadCharacters();
	
	// turn manager init stuff.
	turnManager.onReady();
});

on("change:token", function(obj, prev) {
	
});

on("change:campaign:_turnorder", function(obj, prev) {
	turnManager.onTurnUpdate();
});

on("chat:message", function(msg) {
  if(msg.type == "api") {
	var cmd = command.parse(msg.content);
	command.execute(cmd);
  }
});