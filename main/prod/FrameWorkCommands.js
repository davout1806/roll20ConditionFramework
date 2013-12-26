// TODO Non-modifier conditions
// TODO Scene conditions: conditions that exist throughout the area of the current scene.
// TODO locational conditions
// TODO remove condition based on timer.
// TODO add/remove status markers.
// TODO equipment affects.
// TODO update javascript docs
// TODO add condition as gm viewable only
// TODO DC of targets

/**
 * Order of files:
 * Utils.js
 * Roll20Utils.js
 * Affect.js
 * ConditionedToken.js
 * Conditions.js
 * Actions.js
 * Actions<game>.js
 * Conditions<game>.js
 * Target.js
 * FrameworkCommands.js
 * Events.js
 *
 */

Davout.ConditionFW.targetImgName = "_davoutTarget";
Davout.ConditionFW = Davout.ConditionFW || {};
Davout.ConditionFW.command = Davout.ConditionFW.command || {};

Davout.ConditionFW.command._manageCondition = function (actionType, selected, conditionName) {
    "use strict";
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                var tokenCondition = Davout.ConditionFW.getTokenInstance(tokenId);
                switch (actionType) {
                    case "ADD":
                        if (state.Davout.ConditionFW.ConditionLookup[conditionName] === undefined) {
                            sendChat("API", "/w gm " + conditionName + " is not a valid condition");
                        } else {
                            tokenCondition.addCondition(state.Davout.ConditionFW.ConditionLookup[conditionName]);
                        }
                        break;
                    case "DEL":
                        if (state.Davout.ConditionFW.ConditionLookup[conditionName] === undefined) {
                            sendChat("API", "/w gm " + conditionName + " is not a valid condition");
                        } else {
                            tokenCondition.removeCondition(state.Davout.ConditionFW.ConditionLookup[conditionName]);
                        }
                        break;
                    case "SHOW":
                        sendChat("API", "/w gm " + tokenObjR20.get("name") + " has the following conditions:<br>" + tokenCondition.listAllConditions());
                        break;
                }
            }
        }
    });
};

Davout.ConditionFW.command._action = function (msg, actionName, dieResult) {
    "use strict";
    var tokenObjR20 = Davout.R20Utils.selectedToTokenObj(msg.selected[0]);
    if (tokenObjR20 === undefined) {
        sendChat("API", "/w gm Selected object is not valid token.");
        return;
    }

    if (Davout.R20Utils.tokenObjToCharId(tokenObjR20) === undefined) {
        sendChat("API", "/w gm Selected object does not have a backing character sheet.");
        return;
    }

    var tokenId = tokenObjR20.get("id");
    var tokenWithCondition = Davout.ConditionFW.getTokenInstance(tokenId);
    var targetIdOfAction = state.Davout.ConditionFW.TargetIdOfAction;
    var affectCollection = tokenWithCondition.getAffectForAction(state.Davout.ConditionFW.ActionLookup[actionName], targetIdOfAction);
    state.Davout.ConditionFW.ActionLookup[actionName].getResult(tokenWithCondition, targetIdOfAction, affectCollection, dieResult);
};

Davout.ConditionFW.command._clearState = function () {
    state.Davout.ConditionFW.TokensWithConditionObj = {};
    state.Davout.ConditionFW.TargetIdOfAction = undefined;
};

on("ready", function () {
    "use strict";
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (Davout.Utils == undefined) {
        log("You must have Davout.Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.Utils!";
    }
    if (Davout.R20Utils == undefined) {
        log("You must have Davout.R20Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.R20Utils!";
    }

    var addCommand = {};
    addCommand.gmOnly = true;
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!cond_add <ConditionName><br> ConditionName cannot contain spaces.";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionFW.command._manageCondition("ADD", msg.selected, Davout.Utils.capitaliseFirstLetter(args[0].value));
        }
    };
    community.command.add("cond_add", addCommand);

    var removeCommand = {};
    removeCommand.gmOnly = true;
    removeCommand.minArgs = 1;
    removeCommand.maxArgs = 1;
    removeCommand.typeList = [];
    removeCommand.typeList = ["str"];
    removeCommand.syntax = "!cond_del <ConditionName><br> ConditionName cannot contain spaces.";
    removeCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionFW.command._manageCondition("DEL", msg.selected, Davout.Utils.capitaliseFirstLetter(args[0].value));
        }
    };
    community.command.add("cond_del", removeCommand);

    var showCommand = {};
    showCommand.gmOnly = true;
    showCommand.minArgs = 0;
    showCommand.maxArgs = 0;
    showCommand.typeList = [];
    showCommand.typeList = ["str"];
    showCommand.syntax = "!cond_show";
    showCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionFW.command._manageCondition("SHOW", msg.selected);
        }
    };
    community.command.add("cond_show", showCommand);

    var actionCommand = {};
    actionCommand.minArgs = 1;
    actionCommand.maxArgs = 2;
    actionCommand.typeList = [];
    actionCommand.typeList = ["str", "str"];
    actionCommand.syntax = "!action <ActionName> [dieRoll]<br>ActionName cannot contain spaces.";
    actionCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", true, "/w gm you may only have 1 token selected.")) {
            var actionName = Davout.Utils.capitaliseFirstLetter(args[0].value);
            var dieRoll = (args[1] === undefined) ? undefined : Number(args[1].value);

            if (dieRoll === undefined || !isNaN(dieRoll)) {
                if (state.Davout.ConditionFW.ActionLookup[actionName] != undefined) {
                    Davout.ConditionFW.command._action(msg, actionName, dieRoll);
                } else {
                    log(args[0].value + " is an unknown action");
                    sendChat("API", "/w gm " + actionName + " is an unknown action");
                }
            } else {
                sendChat("API", "Die roll must be a number!");
            }
        }
    };
    community.command.add("action", actionCommand);

    var setTargetCommand = {};
    setTargetCommand.minArgs = 1;
    setTargetCommand.maxArgs = 1;
    setTargetCommand.typeList = [];
    setTargetCommand.typeList = ["str"];
    setTargetCommand.syntax = "!target";
    setTargetCommand.handle = function (args, who, isGm, msg) {
        var targetId = args[0];
        Davout.ConditionFW.target.setTarget(msg.playerid, targetId.value);
    };
    community.command.add("target", setTargetCommand);

    //This is only used for testing purposes.
    var clearStateCommand = {};
    clearStateCommand.minArgs = 0;
    clearStateCommand.maxArgs = 0;
    clearStateCommand.typeList = [];
    clearStateCommand.typeList = [];
    clearStateCommand.syntax = "!clear_state";
    clearStateCommand.handle = function (args, who, isGm, msg) {
        var targetId = args[0];
        Davout.ConditionFW.command._clearState();
    };
    community.command.add("clear_state", clearStateCommand);
});

// FrameworkCommands

