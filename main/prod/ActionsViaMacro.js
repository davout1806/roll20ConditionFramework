var Davout = Davout || {};
Davout.ActionObj = Davout.ActionObj || {};
Davout.ActionObj.command = Davout.ActionObj.command || {};

state.Davout = state.Davout || {};
state.Davout.ActionObjs = state.Davout.ActionObjs || {};
state.Davout.DcChallengeObjs = state.Davout.DcChallengeObjs || {};
state.Davout.TargetIdsOfAction = state.Davout.TargetIdsOfAction || [];  //Array of Arrays of IDs


Davout.ActionObj.Action = function (actionName, attribNameOnSheet, baseModNameOnSheet, doesApcPenApply) {
    "use strict";
    this.actionName = actionName;
    this.chShAttributeName = attribNameOnSheet;
    this.chShBaseModName = baseModNameOnSheet;
    this.chShAcpName = "AC-Penalty";
    this.doesApcPenApply = doesApcPenApply;
};

Davout.ActionObj.Action.prototype.buildActionString = function (charObj, totalAffect, dieResult, targetTotalAffectable) {
    "use strict";
    if (dieResult === undefined) {
        dieResult = randomInteger(20);
    }

    var attributeValue = charObj.getAttribCurrentFor(this.chShAttributeName) + totalAffect.attributeMod;
    var baseValue = charObj.getAttribCurrentFor(this.chShBaseModName);
    var rollTotal = dieResult + Number(Math.floor(attributeValue / 2 - 5)) + Number(baseValue) + Number(totalAffect.condModTotal);
    if (targetTotalAffectable !== undefined){
        rollTotal += targetTotalAffectable.condModTotal;
    }

    var actionString = this.actionName;
    actionString += ": Rolls " + dieResult + " + ";
    actionString += "(" + this.chShAttributeName + ": " + Math.floor(attributeValue / 2 - 5);
    actionString += ") + (" + this.chShBaseModName + ": " + baseValue + ")";
    if (this.doesApcPenApply) {
        var acpValue = charObj.getAttribCurrentFor(this.chShAcpName);
        rollTotal -= Number(acpValue);
        actionString += " + (ACP: -" + acpValue + ")";
    }
    if (totalAffect.modList.length > 0){
        actionString += " + (Conditions: " + totalAffect.condModTotal + ")";
    }
    if (targetTotalAffectable !== undefined && targetTotalAffectable.modList.length > 0){
        actionString += " + (Opp Cond: " + targetTotalAffectable.condModTotal + ")";
    }

    actionString += " = <b>" + rollTotal + "</b><br>";
    actionString += totalAffect.buildModListString();
    if (targetTotalAffectable) {
        actionString += targetTotalAffectable.buildModListString();
    }

    actionString += totalAffect.buildNotesString();
    if (targetTotalAffectable) {
        actionString += targetTotalAffectable.buildNotesString();
    }

    return actionString;
};

Davout.ActionObj.StaticChallenge = function (name, attribNameOnSheet, baseNameOnSheet) {
    "use strict";
    this.name = name;
    this.chShAttributeName = attribNameOnSheet;
    this.chShBaseModName = baseNameOnSheet;
};

Davout.ActionObj.StaticChallenge.prototype.buildActionString = function (charObj) {
    "use strict";
    var actionFormula = charObj.get("name") + " ";
    actionFormula += this.name;
    actionFormula += ": [[" + Davout.R20Utils.getAttribCurrentFor(charObj.get("id"), this.chShAttributeName) + "+";
    actionFormula += Davout.R20Utils.getAttribCurrentFor(charObj.get("id"), this.chShBaseModName);
    actionFormula += "]]";
    return actionFormula;
};

Davout.ActionObj.command._action = function (msg, actionName) {
    "use strict";
    var tokenObjR20 = Davout.R20Utils.selectedToTokenObj(msg.selected[0]);
    if (tokenObjR20 === undefined) {
        throw "Selected object is not valid token";
    }

    var tokenId = tokenObjR20.get("id");
    var tokenCondition = Davout.TokenFactory.getInstance(tokenId);
    var charObj = Davout.R20Utils.tokenObjToCharObj(tokenObjR20);
    // TODO problem: actionName is not the attribute therefore conditions affecting the attribute are not included in totalAffect.
    var totalAffect = tokenCondition.getAffect(actionName);
    if (!totalAffect.isProhibited) {
        var actionObj = state.Davout.ActionObjs[actionName],
            targetIdsOfPlayer = state.Davout.TargetIdsOfAction[msg.playerid],
            actionMsg;
        if (targetIdsOfPlayer === undefined || targetIdsOfPlayer.length === 0) {
            actionMsg = actionObj.buildActionString(charObj, totalAffect, randomInteger(20));
        } else {
            var dieResult = randomInteger(20);
            for (var i = 0; i < targetIdsOfPlayer.length; i++) {
                var targetTokenId = targetIdsOfPlayer[i];
                var targetTokenCondition = Davout.TokenFactory.getInstance(targetTokenId);
                var targetTotalAffectable = targetTokenCondition.getAffectAsTarget(actionName);
                actionMsg = actionObj.buildActionString(charObj, totalAffect, dieResult, targetTotalAffectable);
                var dcObj = state.Davout.DcChallengeObjs[actionName];

                if (dcObj != undefined) {

                }
            }
        }
        Davout.Utils.sendDirectedMsgToChat(true, tokenObjR20.get("name") + " " + actionMsg);
    } else {
        sendChat("API", "/w gm " + tokenObjR20.get("name") + " is prohibited from performing "
            + Davout.Utils.capitaliseFirstLetter(actionName) + ".<br>"
            + totalAffect.buildNotesString());
    }
};

// TODO add target image around targets.
Davout.ActionObj.command._setTargets = function (playerId, targets) {
    "use strict";
    var tokenObjR20;
    if (state.Davout.TargetIdsOfAction == undefined) {
        state.Davout.TargetIdsOfAction = [];
    }
    state.Davout.TargetIdsOfAction[playerId] = [];

    _.each(targets, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("subtype") == "token") {
            state.Davout.TargetIdsOfAction[playerId].push(tokenObjR20.get("id"));
        }
    });

    log("state.Davout.TargetIdsOfAction = " + state.Davout.TargetIdsOfAction[playerId]);
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
            if (state.Davout.ActionObjs[args[0].value] != undefined) {
                Davout.ActionObj.command._action(msg, args[0].value);
            } else {
                log(args[0].value + " is an unknown action");
                sendChat("API", "/w gm " + Davout.Utils.capitaliseFirstLetter(args[0].value) + " is an unknown action");
            }
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

