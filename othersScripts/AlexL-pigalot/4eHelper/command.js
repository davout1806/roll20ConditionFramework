/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot

 Warning this is work in progress don't expect it to always work!


 OK so this is just for Riley as he expressed an interest in what we are all doing with the API.

 This group of scripts is my ground work to building a system to make running a 4th edition D&D game easier for everyone by extending macros, handling status effects and maybe some other stuff down the line.
 */

var command = {

	utl : new utility("command"),
	commandList : {
		"help":{ 
			argNumber:0, 
			discription:"Lists commands with discriptions.", 
			code:function(args) {
				if(Object.keys(args).length == 0) {
					sendChat("Help", "Commands:");
					sendChat("Help", "-----------------------------");
					_.each(command.commandList, function(com, name) {
						if("discription" in com) {
							sendChat("Help", "Name:\n" + name);
							sendChat("Help", "Discription:\n" + com.discription);
							sendChat("Help", "-----------------------------");
						}
					});
				} else {
					if("c" in args) args["command"] = args.c;
					if("command" in args) {
						if(args.command in command.commandList) {
							sendChat("Help", "Name: " + args.command);
							sendChat("Help", "Discription: " + command.commandList[args.command].discription);
						} else {
							sendChat("Help", "Command " + args.command + " not found.");
						}
					}
				}
			}
		}
	},
	parse : function(msg) {
		var first = msg.indexOf("--");
		var args = {};
		var com = "";
		if(first != -1) {
			com = msg.slice(1, first).trim();
			command.utl.logDebug("Command:" + com);
			var tempArgs = msg.slice(first, msg.length).split("--");
			
			_.each(tempArgs, function(arg) {
				var braket = arg.indexOf("(");
				if(braket != -1) {
					var argString = arg.slice(0, braket);
					var text = arg.slice(braket + 1, arg.length);
					braket = text.indexOf(")");
					if(braket != -1) {
						text = text.slice(0, braket);
						if(text.indexOf(",") != -1) {
							args[argString] = text.split(",");
						} else {
							args[argString] = [ text ];
						}
					} else {
						// Throw error.
					}
				} else {
					// Throw error.
				}
			});
			
			
			_.each(args, function(value, arg) {
				command.utl.logDebug("arg:" + arg + " value:" + value);
			});
			
		} else {
			com = msg.slice(1, msg.length).trim();
			command.utl.logDebug("Command:" + com);
		}
		
		return { "command":com, "args":args };
	},
	execute : function(cmd) {
		if(cmd.command in command.commandList) {
			if(Object.keys(cmd.args).length >= command.commandList[cmd.command].argNumber) {
				command.commandList[cmd.command].code(cmd.args);
			} else {
				// Min args not provided.
			}
		}
	}
};