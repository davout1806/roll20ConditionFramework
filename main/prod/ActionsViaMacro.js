var Davout = Davout || {};
Davout.ActionObj = Davout.ActionObj || {};
Davout.ActionObj.command = Davout.ActionObj.command || {};

state.Davout = state.Davout || {};
state.Davout.ActionObjs = state.Davout.ActionObjs || {};
state.Davout.VsActionObjs = state.Davout.VsActionObjs || {};
state.Davout.TargetIdsOfAction = state.Davout.TargetIdsOfAction || [];  //Array of Arrays of IDs

Davout.ActionObj.Action = function (actionName, attribNameOnSheet, baseModNameOnSheet, doesApcPenApply) {
    this.actionName = actionName;
    this.chShAttributeName = attribNameOnSheet;
    this.chShbaseModName = baseModNameOnSheet;
    this.chShAcpName = "AC-Penalty";
    this.doesApcPenApply = doesApcPenApply;
};

Davout.ActionObj.Action.prototype.getActionFormula = function (charObj, modifier) {
    var actionFormula = charObj.get("name") + " ";
    actionFormula += this.actionName;
    actionFormula += ": [[floor(" + Davout.R20Utils.getAttribCurrentFor(charObj.get("id"), this.chShAttributeName) + "/2-5)+";
    actionFormula += Davout.R20Utils.getAttribCurrentFor(charObj.get("id"), this.chShbaseModName) + "+ 1d20+ ";
    actionFormula += modifier;
    if (this.doesApcPenApply) {
        actionFormula += " - " + Davout.R20Utils.getAttribCurrentFor(charObj.get("id"), this.chShAcpName);
    }
    actionFormula += "]]";
    return actionFormula;
};

Davout.ActionObj.command._action = function (msg, actionName) {
    if (state.Davout.ActionObjs[actionName] != undefined) {
        var tokenObjR20 = Davout.R20Utils.selectedToTokenObj(msg.selected[0]);
        var tokenId = tokenObjR20.get("id");
        if (!Davout.ConditionObj.isProhibited(tokenId, actionName)) {
            if (tokenObjR20 != undefined) {
                var playerModifier = Davout.ConditionObj.getModifierFor(tokenId, actionName);
                var charObj = Davout.R20Utils.tokenObjToCharObj(tokenObjR20);
                var actionObj = state.Davout.ActionObjs[actionName];
                var targetIdsOfPlayer = state.Davout.TargetIdsOfAction[msg.playerid];
                if (targetIdsOfPlayer == undefined || targetIdsOfPlayer.length == 0) {
                    Davout.Utils.sendDirectedMsgToChat(true, actionObj.getActionFormula(charObj, playerModifier) + ":<br>" + Davout.ConditionObj.listConditionsAffecting(tokenId, actionName));
                } else {
                    for (var i=0; i<targetIdsOfPlayer.length; i++ ){
                        var targetTokenId = targetIdsOfPlayer[i];
                        var targetModifier = Davout.ConditionObj.getModifierForTarget(targetTokenId, actionName);
                        Davout.Utils.sendDirectedMsgToChat(true,
                            actionObj.getActionFormula(charObj, playerModifier + targetModifier)
                                + ":<br>" + Davout.ConditionObj.listConditionsAffecting(tokenId, actionName)
                                + "Target:<br>" + Davout.ConditionObj.listConditionsAffectingForTarget(targetTokenId, actionName)
                        );
                    }
                }
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
Davout.ActionObj.command._setTargets = function (playerId, targets) {
    var tokenObjR20;
    if (state.Davout.TargetIdsOfAction == undefined) {
        state.Davout.TargetIdsOfAction = [];
    }
    state.Davout.TargetIdsOfAction[playerId] = [];

    _.each(targets, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            state.Davout.TargetIdsOfAction[playerId].push(tokenObjR20.get("id"));
        }
    });

    log("state.Davout.TargetIdsOfAction = " + state.Davout.TargetIdsOfAction[playerId]);
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
    if (Davout.R20Utils == undefined) {
        log("You must have Davout.R20Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.R20Utils!";
    }
    if (Davout.ConditionObj == undefined) {
        log("You must have Davout.ConditionObj installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.ConditionObj!";
    }

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!action <ActionName><br>ActionName cannot contain spaces.";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", true, "/w gm you may only have 1 token selected.")) {
            Davout.ActionObj.command._action(msg, args[0].value);
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
            Davout.ActionObj.command._setTargets(msg.playerid, msg.selected);
        }
    };
    community.command.add("target", addCommand);
});

// ActionsViaMacro

