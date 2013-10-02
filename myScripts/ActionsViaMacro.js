var DavoutActions = DavoutActions || [];
DavoutActions.command = DavoutActions.command || {};

state.davoutTargetsOfAction = state.davoutTargetsOfAction || [];

DavoutActions.actions = DavoutActions.actions || [];
DavoutActions.actions["FortSave"] = {};

DavoutActions.command._action = function (msg, actionName) {
    _.each(msg.selected, function (obj) {
        log("obj.who = " + getObj("graphic", obj._id).get("name"));
    });

    if (DavoutActions.actions[actionName] != undefined) {
        log("actionName = " + actionName);
    } else {
        log(actionName + " is an unknown action");
        sendChat("API", "/w gm " + actionName + " is an unknown action");
    }
}

DavoutActions.command._setTargets = function (playerId, selected) {
    var tokenObjR20;
    if (state.davoutTargetsOfAction == undefined) {
        state.davoutTargetsOfAction = [];
    }
    state.davoutTargetsOfAction[playerId] = [];

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            state.davoutTargetsOfAction[playerId].push(tokenObjR20.get("id"));
        }
    });

    log("state.davoutTargetsOfAction = " + state.davoutTargetsOfAction[playerId]);
}

on("ready", function () {
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (DavoutUtils == undefined) {
        log("You must have DavoutUtils installed in a script tab before the tab this script is in to use.");
        throw "Can't find DavoutUtils!";
    }

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!DavoutAction action";
    addCommand.handle = function (args, who, isGm, msg) {
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected")) {
            DavoutActions.command._action(msg, args[0].value);
        }
    };
    community.command.add("DavoutAction", addCommand);

    var addCommand = {};
    addCommand.minArgs = 0;
    addCommand.maxArgs = 0;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!DavoutSetTarget";
    addCommand.handle = function (args, who, isGm, msg) {
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected")) {
            DavoutActions.command._setTargets(msg.playerid, msg.selected);
        }
    };
    community.command.add("DavoutSetTarget", addCommand);
});

// ActionsViaMacro

