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
                var tokenCondition;
                switch (actionType) {
                    case "ADD":
                        tokenCondition = Davout.ConditionFW.getTokenInstance(tokenId);
                        tokenCondition.addCondition(state.Davout.ConditionFW[conditionName]);
                        break;
                    case "DEL":
                        tokenCondition = Davout.ConditionFW.getTokenInstance(tokenId);
                        tokenCondition.removeCondition(state.Davout.ConditionFW[conditionName]);
                        break;
                    case "SHOW":
                        Davout.Utils.sendDirectedMsgToChat(true, tokenObjR20.get("name") + " has the following conditions:<br>" + Davout.ConditionObj.listAllConditions());
                        break;
                }
            }
        }
    });
};

Davout.ConditionFW.command._action = function (msg, actionName) {
    "use strict";
    var tokenObjR20 = Davout.R20Utils.selectedToTokenObj(msg.selected[0]);
    if (tokenObjR20 === undefined) {
        throw "Selected object is not valid token";
    }

    var tokenId = tokenObjR20.get("id");
    var tokenWithCondition = Davout.ConditionFW.getTokenInstance(tokenId);
    var affect = tokenWithCondition.getAffectForAction(state.Davout.ConditionFW.ActionLookup[actionName], state.Davout.ConditionFW.TargetIdsOfAction[msg.playerid]);

};

// TODO add target image around targets.
Davout.ConditionFW.command._setTargets = function (playerId, targets) {
    "use strict";
    var tokenObjR20;
    if (state.Davout.ConditionFW.TargetIdsOfAction == undefined) {
        state.Davout.ConditionFW.TargetIdsOfAction = [];
    }
    state.Davout.ConditionFW.TargetIdsOfAction[playerId] = [];

    _.each(targets, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("subtype") == "token") {
            state.Davout.ConditionFW.TargetIdsOfAction[playerId].push(tokenObjR20.get("id"));
        }
    });

    log("state.Davout.ConditionFW.TargetIdsOfAction = " + state.Davout.ConditionFW.TargetIdsOfAction[playerId]);
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
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!cond_add <ConditionName><br> ConditionName cannot contain spaces.";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionFW.command._manageCondition("ADD", msg.selected, args[0].value);
        }
    };
    community.command.add("cond_add", addCommand);

    var removeCommand = {};
    removeCommand.minArgs = 1;
    removeCommand.maxArgs = 1;
    removeCommand.typeList = [];
    removeCommand.typeList = ["str"];
    removeCommand.syntax = "!cond_del <ConditionName><br> ConditionName cannot contain spaces.";
    removeCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionFW.command._manageCondition("DEL", msg.selected, args[0].value);
        }
    };
    community.command.add("cond_del", removeCommand);

    var showCommand = {};
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
    actionCommand.maxArgs = 1;
    actionCommand.typeList = [];
    actionCommand.typeList = ["str"];
    actionCommand.syntax = "!action <ActionName><br>ActionName cannot contain spaces.";
    actionCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", true, "/w gm you may only have 1 token selected.")) {
            if (state.Davout.ConditionFW.ActionLookup[args[0].value] != undefined) {
                Davout.ConditionFW.command._action(msg, args[0].value);
            } else {
                log(args[0].value + " is an unknown action");
                sendChat("API", "/w gm " + Davout.Utils.capitaliseFirstLetter(args[0].value) + " is an unknown action");
            }
        }
    };
    community.command.add("action", actionCommand);

    var setTargetCommand = {};
    setTargetCommand.minArgs = 0;
    setTargetCommand.maxArgs = 0;
    setTargetCommand.typeList = [];
    setTargetCommand.typeList = ["str"];
    setTargetCommand.syntax = "!target";
    setTargetCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "")) {
            Davout.ConditionFW.command._setTargets(msg.playerid, msg.selected);
        }
    };
    community.command.add("target", setTargetCommand);
});