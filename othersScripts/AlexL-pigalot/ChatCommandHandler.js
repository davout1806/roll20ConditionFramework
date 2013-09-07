/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot
 *
 So I have noticed a problem, each script that uses chat commands has its own handler. "What's the problem with that?" I hear you ask, lets think what would happen if I am running 10 different scripts all made by different people and two or more had the command !help, It wouldn't be good that's for sure.
 So to solve this problem I have created a well rounded fully functional chat command handler.
 It uses the commands formatted "!commandName [strings] [-OptionName values]". if the string has a space you can enclose it with quotes to keep it together.

 You can add commands by using "community.command.add" and passing it the command name and a object containing (* = required):

 minArgs - The minimum number of arguments required.
 maxArgs - The maximum number of arguments permitted.
 gmOnly - You can set this to anything it just has to be there, if it exists the command will be only usable by someone with "(GM)" in there name.
 typeList - This is an array of types for static arguments you want to receive. currently the only types are str (a string) and key (an option) key is the default.
 options - A object with valid options for your command ie: { "lol":"this is a discription", "rofl":"another discription"} would be !test -lol something -rofl "something else"
 handle* - a function with the profile of (args, who, isGM) args is a array of objects containing a value and if the argument was a option a key as well, ie "!test something -option value" would give [{ value:"something"},{key:"option", value:"value"}]. who is msg.who and isGM is a boolean.
 syntax - is a string that will be shown after the command name in the help it should show the basic usage of the command it will be auto generated if not set.

 Here is an example:

 on("ready", function() {
 obj = {};
 obj.gmOnly = "";
 obj.minArgs = 1;
 obj.typeList = ["str"];
 obj.options = { "lol":"This has to do something :P" };
 obj.handle = function(args) {
 log("test");
 log(JSON.stringify(args));
 };
 community.command.add("test", obj);
 });

 this would make the command !test, it requires one argument that will be a string and i can optionaly have as many -lol options as the user wants. When called it will log test and log its args in a JSON string. The add command returns a boolean indicating if the command has been added.

 Commands are automatic added to a help command (!?).
 */

var community = community || {};
community.command = community.command || {};

// Start Default Commands

community.command.commandList = community.command.commandList || {};

community.command.commandList["?"] = {};
community.command.commandList["?"].typeList = ["str"];
community.command.commandList["?"].maxArgs = 1;
community.command.commandList["?"].buildSyntax = function(key) {
    var syntax = "!" + key;
    if("syntax" in community.command.commandList[key]) {
        syntax += " " + community.command.commandList[key].syntax;
    } else {
        var argsDescribed = 0;
        var minArgs = community.command.commandList[key].minArgs || 0;
        var maxArgs = community.command.commandList[key].maxArgs || 0;

        if("typeList" in community.command.commandList[key]) {
            if(community.command.commandList[key].typeList.length > 0) {
                _.each(community.command.commandList[key].typeList, function(element, index) {
                    argsDescribed++;
                    if(argsDescribed < minArgs) {
                        if(element in community.command.types) {
                            syntax += " " + community.command.types[element].description;
                        } else {
                            syntax += " Unknown";
                        }
                    } else {
                        if(element in community.command.types) {
                            syntax += " [" + community.command.types[element].description + "]";
                        } else {
                            syntax += " [Unknown]";
                        }
                    }

                });
            }
        }
        while(argsDescribed < minArgs) {
            argsDescribed++;
            syntax += " " + community.command.types.key.description;
        }
        if(argsDescribed < maxArgs || maxArgs == 0) {
            syntax += " [" + community.command.types.key.description + "]";
        }
    }
    return syntax;
};
community.command.commandList["?"].handle = function(args, who, isGM) {
    if(args.length == 1) {
        if(args[0].value in community.command.commandList) {
            if(!("gmOnly" in community.command.commandList[args[0].value]) || isGM) {
                var syntax = community.command.commandList["?"].buildSyntax(args[0].value);
                community.command.whisper(who, "Command:");
                community.command.whisper(who, syntax);
                if("options" in community.command.commandList[args[0].value]) {
                    log("Options:");
                    _.each(community.command.commandList[args[0].value].options, function(value, key) {
                        community.command.whisper(who, "-" + key + " :" + value);
                    });
                }
            } else {
                community.command.whisper(who, args[0].value + " is for GMs only.");
            }
        } else {
            community.command.whisper(who, "Command not found");
        }
    } else {
        community.command.whisper(who, "Commands:");
        _.each(community.command.commandList, function(value, key) {
            if(!("gmOnly" in community.command.commandList[key]) || isGM) {
                var syntax = community.command.commandList["?"].buildSyntax(key);
                community.command.whisper(who, syntax);
            }
        });
    }
};

// End Default Commands

// Start Default Types

community.command.types = community.command.types || {};

community.command.types.key = {};
community.command.types.key.description = "option value";
community.command.types.key.check = function(part) {
    var str = "-";
    if(str === part.substr( 0, str.length)) {
        return true;
    }
    return false;
};
community.command.types.str = {};
community.command.types.str.description = "String";
community.command.types.str.check = function(part) {
    return true;
};

// End Default Types
community.command.whisper = function(who, message) {
    sendChat("API", "/w " + who + " " + message);
};


// Add command to system
community.command.add = function(command, obj) {
    // Does the command already exist
    if(command in community.command.commandList) {
        log("Error: Command.Add Command name already in use");
        // Work out a way to auto rename to something sensable.
        return false;
    }

    if(!("handle" in obj)) {
        log("Error: Command.Add Object Invalid");
        return false;
    }

    community.command.commandList[command] = obj;
    return true;
};

// Parse the command
community.command.parse = function(message, who) {

    var arr = message.match(/(?:[^\s"]+|"[^"]*")+/g);

    var command = arr[0].replace(/["!]/g,"");

    arr.splice(0, 1);

    // Does the command exist
    if(command in community.command.commandList) {

        if("handle" in community.command.commandList[command]) {
            var isGM = (who.indexOf("(GM)") != -1);
            if("gmOnly" in community.command.commandList[command]) {
                if(!isGM) {
                    community.command.whisper(who, "You must be a GM to use this command");
                    // show some error code or something
                    error = true;
                    return;
                }
            }

            // Are there enouth arguments?
            var minArgs = community.command.commandList[command].minArgs || 0;
            var maxArgs = community.command.commandList[command].maxArgs || 0;

            if("typeList" in community.command.commandList[command]) {

                var numOfKey = 0;
                for(var i=0; i<community.command.commandList[command].typeList.length; i++){
                    if(community.command.commandList[command].typeList[i] === "key")
                        numOfKey++;
                }
                minArgs += numOfKey;
                maxArgs += numOfKey;
            } else {
                minArgs *= 2;
                maxArgs *= 2;
            }

            if(arr.length >= minArgs && (arr.length <= maxArgs || maxArgs == 0)) {

                var trueIndex = 0;
                var error = false;
                var skipNext = false;

                var args = [];

                _.each(arr, function(element, index) {
                    if(!skipNext && !error) {
                        // Find out what the command expects the type to be
                        var type = "key";
                        if("typeList" in community.command.commandList[command]) {
                            if(trueIndex < community.command.commandList[command].typeList.length)
                            {
                                type = community.command.commandList[command].typeList[trueIndex];
                            }
                        }

                        // Get rid of the "s
                        arr[index] = element.replace(/"/g,"");

                        // Check to see if the type is valid and that the element comforms to that types requirments
                        if(type in community.command.types) {
                            if(!(community.command.types[type].check(arr[index]))) {
                                log("does not conform");
                                // show some error code or something
                                error = true;
                                return;
                            }
                        } else {
                            log("type doesnt exist");
                            // show some error code or something
                            error = true;
                            return;
                        }

                        // Special code to handle key value pairs
                        if(type == "key") {
                            skipNext = true;
                            if("options" in community.command.commandList[command]) {
                                var op = arr[index].replace("-","");
                                if(!(op in community.command.commandList[command].options)) {
                                    community.command.whisper(who, op + " is Not a valid option.");
                                    // show some error code or something
                                    error = true;
                                    return;
                                }
                            }
                            var valIndex = index + 1;
                            if(valIndex < arr.length) {
                                var value = arr[valIndex];
                                args.push({"key":arr[index], "value":value});
                            } else {
                                log("No value found.");
                                // show some error code or something
                                error = true;
                                return;
                            }
                        } else {
                            args.push({"value":arr[index]});
                        }

                        trueIndex++;
                    } else {
                        skipNext = false;
                    }
                });

                // OMG an error!!!
                if(error) return;

                community.command.commandList[command].handle(args, who, isGM);

            } else {
                community.command.whisper(who, "Not enouth arguments or to many");
            }
        } else {
            log("Command is there but has no function to handle it.");
        }
    } else {
        community.command.whisper(who, "Unknown Command");
    }
};

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!") !== -1) {
        community.command.parse(msg.content, msg.who);
    }
});