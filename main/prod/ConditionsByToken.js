/**
 * state.Davout.TokensWithConditionObj[id] where id is token id
 *
 * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 * Therefore, must apply effects on rolls.
 *
 */

// TODO prevent adding duplicate conditions unless they are stackable.
// TODO Non-modifier conditions
// TODO Scene conditions: conditions that exist throughout the area of the current scene.
// TODO locational conditions

var Davout = Davout || {};
Davout.ConditionObj = Davout.ConditionObj || {};
Davout.ConditionObj.command = Davout.ConditionObj.command || {};

state.Davout = state.Davout || {};
state.Davout.ConditionObj = state.Davout.ConditionObj || {};
state.Davout.TokensWithConditionObj = state.Davout.TokensWithConditionObj || {};

/******************************************************************************************
 Class Declarations
 *******************************************************************************************/

Davout.ConditionObj.TokenWithConditions = function (tokenName) {
    if (!_.isString(tokenName)) throw "Davout.ConditionObj.TokenWithConditions tokenName invalid parameter type";
    this.tokenName = tokenName;
    this.conditions = [];
};

Davout.ConditionObj.TokenWithConditions.prototype.addCondition = function () {
    Davout.Utils.assertTrueObject(condition, "Davout.ConditionObj.TokenWithConditions.addCondition condition");
    this.conditions.push(condition);
    sendChat("API", "/w gm Condition " + condition.name + " was added to " + this.tokenName);
    log("Added: condition " + condition.name + " to " + this.tokenName);
};

Davout.ConditionObj.TokenWithConditions.prototype.removeCondition = function (condition) {
    Davout.Utils.assertTrueObject(condition, "Davout.ConditionObj.TokenWithConditions.removeCondition condition");
    var index = this.conditions.indexOf(condition);
    if (index > -1) {
        this.conditions.splice(index, 1);
        sendChat("API", "/w gm Condition " + condition.name + " was removed from " + this.tokenName);
        log("Removed: condition " + condition.name + " removed from " + this.tokenName);
    } else {
        sendChat("API", "Selected Token " + condition.name + " does not have condition: " + condition.name);
    }
};

Davout.ConditionObj.TokenWithConditions.prototype.getModifierFor = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.TokenWithConditions.getModifierFor affectable invalid parameter type";
    var modifier = 0;
    if (this.conditions != undefined) {
        _.each(this.conditions, function (condition) {
            modifier += condition.getModifierFor(affectable);
        });
    }
    return modifier;
};

Davout.ConditionObj.Condition = function (name, effects) {
    if (!_.isString(name)) throw "Davout.ConditionObj.Condition name invalid parameter type";
    if (!_.isArray(effects)) throw "Davout.ConditionObj.Condition effects invalid parameter type";
    this.name = name;
    this.effects = effects;
};

Davout.ConditionObj.Condition.prototype.getModifierFor = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.Condition.getModifierFor affectable invalid parameter type";
    var modifier = 0;
    _.each(this.effects, function (effect) {
        modifier += effect.getModifierFor(affectable);
    });
    return modifier;
};

Davout.ConditionObj.Effect = function (affectable, modifier) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.Effect affectable invalid parameter type";
    if (!_.isNumber(modifier)) throw "Davout.ConditionObj.Effect modifier invalid parameter type";
    this.affectable = affectable;
    this.modifier = modifier;
};

Davout.ConditionObj.Effect.prototype.getModifierFor = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.Effect affectable invalid parameter type";
    if (this.affectable == affectable) {
        return this.modifier;
    }
    return 0;
};

Davout.ConditionObj.Action = function () {
    //action name -> action formula
};

Davout.ConditionObj.ActionFormula = function () {
    // list that contains attributes (operands) and operators.
};

/******************************************************************************************
 Function Declarations
 *******************************************************************************************/
Davout.ConditionObj.onTokenDestroyedEvent = function () {
    log("Deleted state.Davout.TokensWithConditionObj for " + token.get("name"));
    state.Davout.TokensWithConditionObj[token] = null;
};

Davout.ConditionObj.addConditionTo = function addConditionTo(tokenId, conditionName, tokenName) {
    if (!_.isString(tokenId)) throw "Davout.ConditionObj.addConditionTo tokenId invalid parameter type";
    if (!_.isString(conditionName)) throw "Davout.ConditionObj.addConditionTo conditionName invalid parameter type";
    if (!_.isString(tokenName)) throw "Davout.ConditionObj.addConditionTo tokenName invalid parameter type";
    if (state.Davout.TokensWithConditionObj == undefined) {
        state.Davout.TokensWithConditionObj = {};
    }
    var condition = state.Davout.ConditionObj[conditionName];
    if (state.Davout.TokensWithConditionObj[tokenId] == undefined) {
        var tokenWithConditions = new Davout.ConditionObj.TokenWithConditions(tokenName);
        tokenWithConditions.addCondition(condition);
        state.Davout.TokensWithConditionObj[tokenId] = tokenWithConditions;
    } else {
        var tokenWithConditions = state.Davout.TokensWithConditionObj[tokenId];
        tokenWithConditions.addCondition(condition);
        state.Davout.TokensWithConditionObj[tokenId] = tokenWithConditions;
    }
};

Davout.ConditionObj.removeConditionFrom = function removeConditionFrom(tokenId, conditionName) {
    if (!_.isString(tokenId)) throw "Davout.ConditionObj.removeConditionFrom tokenId invalid parameter type";
    if (!_.isString(conditionName)) throw "Davout.ConditionObj.removeConditionFrom conditionName invalid parameter type";
    if (state.Davout.TokensWithConditionObj[tokenId] != undefined) {
        var tokenWithConditions = state.Davout.TokensWithConditionObj[tokenId];
        tokenWithConditions.removeCondition(state.Davout.ConditionObj[conditionName]);
        state.Davout.TokensWithConditionObj[tokenId] = tokenWithConditions;
    }
};

Davout.ConditionObj.getModifierFor = function getModifierFor(tokenId, affectedName) {
    if (!_.isString(tokenId)) throw "Davout.ConditionObj.getModifierFor tokenId invalid parameter type";
    if (!_.isString(affectedName)) throw "Davout.ConditionObj.getModifierFor affectedName invalid parameter type";
    if (state.Davout.TokensWithConditionObj == undefined) {
        return 0;
    }

    if (state.Davout.TokensWithConditionObj[tokenId] == undefined) {
        return 0;
    }
    return state.Davout.TokensWithConditionObj[tokenId].getModifierFor(affectedName);
};

Davout.ConditionObj.command._manageCondition = function (actionType, selected, conditionName) {
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                switch (actionType) {
                    case "ADD":
                        Davout.ConditionObj.addConditionTo(tokenId, conditionName, tokenObjR20.get("name"));
                        break;
                    case "DEL":
                        Davout.ConditionObj.removeConditionFrom(tokenId, conditionName);
                        break;
                    case "SHOW":
                        sendChat("API", "/w gm " + tokenObjR20.get("name") + " has the following conditions " + Davout.ConditionObj.getConditionsOnToken(tokenId));
                        break;
                }
            }
        }
    });
};

on("destroy:token", Davout.ConditionObj.onTokenDestroyedEvent);

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
    addCommand.syntax = "!cond_add ConditionName";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionObj.command._manageCondition("ADD", msg.selected, args[0].value);
        }
    };
    community.command.add("cond_add", addCommand);

    var removeCommand = {};
    removeCommand.minArgs = 1;
    removeCommand.maxArgs = 1;
    removeCommand.typeList = [];
    removeCommand.typeList = ["str"];
    removeCommand.syntax = "!cond_del ConditionName";
    removeCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionObj.command._manageCondition("DEL", msg.selected, args[0].value);
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
            Davout.ConditionObj.command._manageCondition("SHOW", msg.selected);
        }
    };
    community.command.add("cond_show", showCommand);
});

// ConditionsByToken

