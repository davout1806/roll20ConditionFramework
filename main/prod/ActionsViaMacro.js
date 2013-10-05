/*
 Required design specifications:
 1. Allow multiple tokens to use the same character.
 2. Allow conditions to be assigned individually to tokens even if they share the same character.
 Desired design specifications:
 1. Quickly perform action of a token, preferably without having to open character sheet (ALT+double click)
 */

var DavoutActions = DavoutActions || [];
DavoutActions.command = DavoutActions.command || {};

state.Davout.TargetsOfAction = state.Davout.TargetsOfAction || [];

DavoutActions.actions = DavoutActions.actions || [];
DavoutActions.actions["FortSave"] = {
    ability: "Fort-Save"
//    functionName: DavoutSheet.createSaveAction,
//    parameter: DavoutSheet.saves["fort"]
};

DavoutActions.command._action = function (msg, actionName) {

    if (DavoutActions.actions[actionName] !== undefined) {
        var actionObj = DavoutActions.actions[actionName];
//        log("chat= " + "%{selected|" + actionObj.ability + "}")
//        sendChat("API", "/w %{selected|" + actionObj.ability + "}");

        var tokenObjR20 = Davout.Utils.selectedToToken(msg.selected[0]);
        if (tokenObjR20) {
            var charId = Davout.Utils.tokenToCharId(tokenObjR20);
            log("charId = " + charId);
                log("tokenObjR20 = " + tokenObjR20);
            var actionObj = DavoutActions.actions[actionName];
            var actionStr = "%{" + actionObj.ability();
            log("actionStr = " + actionStr);
            var actionStrReplacedName = actionStr.replace("@{Name}", tokenObjR20.get("name"));
            log("actionStrReplacedName = " + actionStrReplacedName);

            //w gm @{Name} Fort-Save: [[floor(@{Con}/2-5)+@{Fortitude-Mod}+1d20]]
            log("actionName = " + actionName);
        }
    } else {
        log(actionName + " is an unknown action");
        sendChat("API", "/w gm " + actionName + " is an unknown action");
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
    addCommand.syntax = "!DavoutAction action";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", true, "/w gm you may only have 1 token selected.")) {
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
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "")) {
            DavoutActions.command._setTargets(msg.playerid, msg.selected);
        }
    };
    community.command.add("DavoutSetTarget", addCommand);
});

// ActionsViaMacro

