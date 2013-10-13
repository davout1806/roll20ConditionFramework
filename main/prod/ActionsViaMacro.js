var DavoutActions = DavoutActions || [];
DavoutActions.command = DavoutActions.command || {};

state.Davout.TargetsOfAction = state.Davout.TargetsOfAction || [];

DavoutActions.command._action = function (msg, actionName) {
    if (DavoutActions.actions[actionName] != undefined) {
        var tokenObjR20 = Davout.R20Utils.selectedToTokenObj(msg.selected[0]);
        console.log("tokenObjR20 = " + JSON.stringify(tokenObjR20));
        if (!Davout.ConditionObj.isProhibited(tokenObjR20.get("id"), actionName)) {
            if (tokenObjR20) {
                var charObj = Davout.R20Utils.tokenObjToCharObj(tokenObjR20);
                var actionObj = DavoutActions.actions[actionName];
                var actionStr = "%{" + charObj.get("name") + "|" + actionObj.ability + "}";
                sendChat("API", "/w gm " + actionStr);
            }
        } else {
            sendChat("API", "/w gm " + tokenObjR20.get("name") + " is prohibited from performing "
                + Davout.Utils.capitaliseFirstLetter(actionName) + ".<br>"
                + Davout.ConditionObj.listConditionsAffecting(tokenObjR20.get("id"), actionName));
        }
    } else {
        log(actionName + " is an unknown action");
        sendChat("API", "/w gm " + Davout.Utils.capitaliseFirstLetter(actionName) + " is an unknown action");
    }
};

// TODO add target image around targets.
DavoutActions.command._setTargets = function (playerId, selected) {
    var tokenObjR20;
    if (state.Davout.TargetsOfAction == undefined) {
        state.Davout.TargetsOfAction = [];
    }
    state.Davout.TargetsOfAction[playerId] = [];

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            state.Davout.TargetsOfAction[playerId].push(tokenObjR20.get("id"));
        }
    });

    log("state.Davout.TargetsOfAction = " + state.Davout.TargetsOfAction[playerId]);
};

on("ready", function () {
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (Davout.Utils == undefined) {
        log("You must have Davout.Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.Utils!";
    }

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!action action";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", true, "/w gm you may only have 1 token selected.")) {
            DavoutActions.command._action(msg, args[0].value);
        }
    };
    community.command.add("action", addCommand);

    var addCommand = {};
    addCommand.minArgs = 0;
    addCommand.maxArgs = 0;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!target";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "")) {
            DavoutActions.command._setTargets(msg.playerid, msg.selected);
        }
    };
    community.command.add("target", addCommand);
});

// ActionsViaMacro

