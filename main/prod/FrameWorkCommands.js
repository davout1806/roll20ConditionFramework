// TODO Non-modifier conditions
// TODO Scene conditions: conditions that exist throughout the area of the current scene.
// TODO locational conditions
// TODO remove condition based on timer.
// TODO add/remove status markers.
// TODO equipment effectsOnToken.
// TODO update javascript docs
// TODO add condition as gm viewable only
// TODO DC of targets

/**
 * Order of files:
 * ChatCommandHandler.js
 * Utils.js
 * Roll20Utils.js
 * EffectOnToken.js
 * ConditionedToken.js
 * Conditions.js
 * Actions.js
 * Actions<game>.js
 * DcCalculator.js
 * DcCalculator<game>.js
 * Conditions<game>.js
 * Target.js
 * FrameworkCommands.js
 * Events.js
 *
 */


Davout.ConditionFW = Davout.ConditionFW || {};

// The UNIQUE name of the targeting token.
Davout.ConditionFW.targetImgName = "_davoutTarget";

/**
 * Customize command strings
 */
Davout.ConditionFW.command = Davout.ConditionFW.command || {};
Davout.ConditionFW.command.addConditionCommand = "condAdd";
Davout.ConditionFW.command.delConditionCommand = "condDel";
Davout.ConditionFW.command.showConditionCommand = "condShow";
Davout.ConditionFW.command.actionCommand = "action";
Davout.ConditionFW.command.targetCommand = "target";
Davout.ConditionFW.command.clearTargetCommand = "clearTarget";
Davout.ConditionFW.command.clearStateCommand = "clearState";

/**
 * At times when an error occurs, objects within the state variable lose their "connection" to method.
 * This causes errors such as TypeError: Object [object Object] has no method 'getEffectsForAction'.
 */
Davout.ConditionFW.command._clearState = function () {
    state.Davout.ConditionFW.TokensWithConditionObj = {};
    state.Davout.ConditionFW.TargetIdOfAction = undefined;
    sendChat("API", "/w gm Stated Cleared.")
};

on("ready", function () {
    "use strict";
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (Davout.Utils == undefined) {
        log("You must have Davout.Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.Utils,j";
    }
    if (Davout.R20Utils == undefined) {
        log("You must have Davout.R20Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.R20Utils.j";
    }
    if (Davout.ConditionFW.target == undefined) {
        log("You must have Target installed in a script tab before the tab this script is in to use.");
        throw "Can't find Target.js";
    }
    if (Davout.ConditionFW.actions == undefined) {
        log("You must have Actions installed in a script tab before the tab this script is in to use.");
        throw "Can't find Actions.js";
    }
    if (Davout.ConditionFW.conditions == undefined) {
        log("You must have Conditions installed in a script tab before the tab this script is in to use.");
        throw "Can't find Conditions.js";
    }

    try {
        var addCommand = {};
        addCommand.gmOnly = true;
        addCommand.minArgs = 1;
        addCommand.maxArgs = 1;
        addCommand.typeList = [];
        addCommand.typeList = ["str"];
        addCommand.syntax = "!" + Davout.ConditionFW.command.addConditionCommand + " <ConditionName><br> ConditionName cannot contain spaces.";
        addCommand.handle = function (args, who, isGm, msg) {
            if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
                Davout.ConditionFW.conditions.manageCondition("ADD", msg.selected, Davout.Utils.capitaliseFirstLetter(args[0].value));
            }
        };
        community.command.add(Davout.ConditionFW.command.addConditionCommand, addCommand);

        var removeCommand = {};
        removeCommand.gmOnly = true;
        removeCommand.minArgs = 1;
        removeCommand.maxArgs = 1;
        removeCommand.typeList = [];
        removeCommand.typeList = ["str"];
        removeCommand.syntax = "!" + Davout.ConditionFW.command.delConditionCommand + " <ConditionName><br> ConditionName cannot contain spaces.";
        removeCommand.handle = function (args, who, isGm, msg) {
            if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
                Davout.ConditionFW.conditions.manageCondition("DEL", msg.selected, Davout.Utils.capitaliseFirstLetter(args[0].value));
            }
        };
        community.command.add(Davout.ConditionFW.command.delConditionCommand, removeCommand);

        var showCommand = {};
        showCommand.gmOnly = true;
        showCommand.minArgs = 0;
        showCommand.maxArgs = 0;
        showCommand.typeList = [];
        showCommand.typeList = ["str"];
        showCommand.syntax = "!" + Davout.ConditionFW.command.showConditionCommand;
        showCommand.handle = function (args, who, isGm, msg) {
            if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
                Davout.ConditionFW.conditions.manageCondition("SHOW", msg.selected, "");
            }
        };
        community.command.add(Davout.ConditionFW.command.showConditionCommand, showCommand);

        var actionCommand = {};
        actionCommand.minArgs = 1;
        actionCommand.maxArgs = 2;
        actionCommand.typeList = [];
        actionCommand.typeList = ["str", "str"];
        actionCommand.syntax = "!" + Davout.ConditionFW.command.actionCommand + " <ActionName> [dieRoll]<br>ActionName cannot contain spaces.";
        actionCommand.handle = function (args, who, isGm, msg) {
            if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", true, "/w gm you may only have 1 token selected.")) {
                var actionName = Davout.Utils.capitaliseFirstLetter(args[0].value);
                var dieRoll = (args[1] === undefined) ? undefined : Number(args[1].value);

                if (dieRoll === undefined || !isNaN(dieRoll)) {
                    if (state.Davout.ConditionFW.ActionLookup[actionName] != undefined) {
                        Davout.ConditionFW.actions.performAction(Davout.R20Utils.selectedToTokenObj(msg.selected[0]), actionName, dieRoll);
                    } else {
                        log(args[0].value + " is an unknown action");
                        sendChat("API", "/w gm " + actionName + " is an unknown action");
                    }
                } else {
                    sendChat("API", "Die roll must be a number!");
                }
            }
        };
        community.command.add(Davout.ConditionFW.command.actionCommand, actionCommand);

        var setTargetCommand = {};
        setTargetCommand.minArgs = 1;
        setTargetCommand.maxArgs = 1;
        setTargetCommand.typeList = [];
        setTargetCommand.typeList = ["str"];
        setTargetCommand.syntax = "!" + Davout.ConditionFW.command.targetCommand;
        setTargetCommand.handle = function (args, who, isGm, msg) {
            var targetId = args[0];
            Davout.ConditionFW.target.setTarget(targetId.value);
        };
        community.command.add(Davout.ConditionFW.command.targetCommand, setTargetCommand);

        var clearTargetCommand = {};
        clearTargetCommand.minArgs = 1;
        clearTargetCommand.maxArgs = 1;
        clearTargetCommand.typeList = [];
        clearTargetCommand.typeList = ["str"];
        clearTargetCommand.syntax = "!" + Davout.ConditionFW.command.clearTargetCommand;
        clearTargetCommand.handle = function (args, who, isGm, msg) {
            Davout.ConditionFW.target.clearTarget();
        };
        community.command.add(Davout.ConditionFW.command.clearTargetCommand, clearTargetCommand);

        var clearStateCommand = {};
        clearStateCommand.minArgs = 0;
        clearStateCommand.maxArgs = 0;
        clearStateCommand.typeList = [];
        clearStateCommand.typeList = [];
        clearStateCommand.syntax = "!" + Davout.ConditionFW.command.clearStateCommand;
        clearStateCommand.handle = function (args, who, isGm, msg) {
            Davout.ConditionFW.command._clearState();
        };
        community.command.add(Davout.ConditionFW.command.clearStateCommand, clearStateCommand);
    } catch (e) {
        log("There was an error. " + e);
        sendChat("API", "/w gm There was an error. " + e);
    }
});

// FrameworkCommands

