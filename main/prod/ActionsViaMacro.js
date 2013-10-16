var Davout = Davout || {};
Davout.Actions = Davout.Actions || {};
Davout.Actions.command = Davout.Actions.command || {};

state.Davout = state.Davout || {};
state.Davout.ActionObjs = state.Davout.ActionObjs || {};
state.Davout.TargetsOfAction = state.Davout.TargetsOfAction || [];

Davout.Actions.Action = function (actionName, attribNameOnSheet, baseModNameOnSheet, doesApcPenApply) {
    this.actionName = actionName;
    this.chShAttributeName = attribNameOnSheet;
    this.chShbaseModName = baseModNameOnSheet;
    this.chShAcpName = "AC-Penalty";
    this.doesApcPenApply = doesApcPenApply;
};

Davout.Actions.Action.prototype.execFunc = function (charObj, modifier) {
    var attributeSheetObj = findObjs({ _type: 'attribute', name: this.chShAttributeName, _characterid: charObj.get("id") })[0];
    var baseModSheetObj = findObjs({ _type: 'attribute', name: this.chShbaseModName, _characterid: charObj.get("id") })[0];

    var saveAction = "/w gm " + charObj.get("name") + " ";
    saveAction += this.actionName;
    saveAction += ": [[floor(" + attributeSheetObj.get("current") + "/2-5)+";
    saveAction += baseModSheetObj.get("current") + "+ 1d20+ ";
    saveAction += modifier;
    if (this.doesApcPenApply) {
        var acpSheetObj = findObjs({ _type: 'attribute', name: this.chShAcpName, _characterid: charObj.get("id") })[0];
        saveAction += " - " + acpSheetObj.get("current");
    }
    saveAction += "]]";
    sendChat("API", saveAction);
};

Davout.Actions.command._action = function (msg, actionName) {
    if (state.Davout.ActionObjs[actionName] != undefined) {
        var tokenObjR20 = Davout.R20Utils.selectedToTokenObj(msg.selected[0]);
        var tokenId = tokenObjR20.get("id");
        if (!Davout.ConditionObj.isProhibited(tokenId, actionName)) {
            if (tokenObjR20 != undefined) {
                var charObj = Davout.R20Utils.tokenObjToCharObj(tokenObjR20);
                var actionObj = state.Davout.ActionObjs[actionName];
                actionObj.execFunc(charObj, Davout.ConditionObj.getModifierFor(tokenId, actionName));
                Davout.Utils.sendDirectedMsgToChat(true, Davout.Utils.capitaliseFirstLetter(actionName) + ":<br>" + Davout.ConditionObj.listConditionsAffecting(tokenId, actionName));
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
Davout.Actions.command._setTargets = function (playerId, selected) {
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
            Davout.Actions.command._action(msg, args[0].value);
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
            Davout.Actions.command._setTargets(msg.playerid, msg.selected);
        }
    };
    community.command.add("target", addCommand);
});

// ActionsViaMacro

