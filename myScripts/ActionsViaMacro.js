var DavoutActions = DavoutActions || [];
DavoutActions.command = DavoutActions.command || {};

DavoutActions.actions = DavoutActions.actions || [];
DavoutActions.actions["FortSave"] = {};

DavoutActions.command._action = function(msg, actionName){
    if (DavoutActions.actions[actionName] != undefined){
        log("actionName = " + actionName);
    } else {
        log(actionName + " is an unknown action");
        sendChat("API", "/w gm " + actionName + " is an unknown action");
    }
}

on("ready", function () {     // Requires community.command
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!DavoutAction action";
    addCommand.handle = function (args, who, isGm, msg) {
        DavoutActions.command._action(msg, args[0].value);
    };
    community.command.add("DavoutAction", addCommand);
});

// ActionsViaMacro

