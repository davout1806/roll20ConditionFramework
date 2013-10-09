/**
 * state.Davout.TokensWithConditionObj[id] where id is token id
 *
 * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 * Therefore, must apply effects on rolls.
 *
 */

// TODO test char has Unconscious condition, removing Fatigued does not drop condition to Fatigued-IV
// TODO Non-modifier conditions
// TODO Scene conditions: conditions that exist throughout the area of the current scene.
// TODO locational conditions
// TODO display list of modifiers for each applicable condition.
// TODO action where character vs character ex: attack where each may have a condition.

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

Davout.ConditionObj.TokenWithConditions.prototype.addCondition = function (condition) {
    Davout.Utils.assertTrueObject(condition, "Davout.ConditionObj.TokenWithConditions.addCondition condition");
    if (Davout.Utils.contains(this.conditions, condition)) {
        if (condition.nextConditionNameIfStackable != null) {
            var nextCondition = state.Davout.ConditionObj[condition.nextConditionNameIfStackable];
            this.conditions.push(nextCondition);
            sendChat("API", "/w gm Condition " + condition.name + " was added to " + this.tokenName + " causing condition: " + nextCondition.name);
            log("Added: condition " + nextCondition.name + " to " + this.tokenName);
        } else {
            sendChat("API", "/w gm " + this.tokenName + " already has the non-stackable condition " + condition.name);
        }
    } else {
        this.conditions.push(condition);
        sendChat("API", "/w gm Condition " + condition.name + " was added to " + this.tokenName);
        log("Added: condition " + condition.name + " to " + this.tokenName);
    }
};

Davout.ConditionObj.TokenWithConditions.prototype.removeCondition = function (condition) {
    Davout.Utils.assertTrueObject(condition, "Davout.ConditionObj.TokenWithConditions.removeCondition condition");
    var followedNextCondition = false;
    var index = this.conditions.indexOf(condition);
    var gotoNextCondition = true;
    var conditionNameRemoved;
    if (index > -1) {
        console.log("condition = " + JSON.stringify(condition));
        var workCondition = condition;
        var nextCondition;
        while (workCondition.nextConditionNameIfStackable != null && gotoNextCondition) {
            nextCondition = state.Davout.ConditionObj[workCondition.nextConditionNameIfStackable];
            if (nextCondition.isReversableByName) {
                conditionNameRemoved = workCondition.name;
                workCondition = nextCondition;
                if (Davout.Utils.contains(this.conditions,nextCondition)) {
                    followedNextCondition = true;
                } else {
                    gotoNextCondition = false;
                }
            }
        }

        if (followedNextCondition) {
            this.conditions.splice(this.conditions.indexOf(workCondition), 1);
        } else {
            conditionNameRemoved = condition.name;
            this.conditions.splice(index, 1);
        }
        sendChat("API", "/w gm Condition " + conditionNameRemoved + " was removed from " + this.tokenName);
        log("Removed: condition " + conditionNameRemoved + " removed from " + this.tokenName);
    } else {
        sendChat("API", "Selected Token " + this.tokenName + " does not have condition: " + condition.name);
    }
};

Davout.ConditionObj.TokenWithConditions.prototype.getModifierFor = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.TokenWithConditions.getModifierFor affectable invalid parameter type";
    var modifier = 0;
    if (this.conditions != undefined) {
        for (var i = 0; i < this.conditions.length; i++) {
            modifier += this.conditions[i].getModifierFor(affectable);
        }
    }
    return modifier;
};

Davout.ConditionObj.TokenWithConditions.prototype.isProhibited = function (affectable) {
    var isProhibited = false;
    if (this.conditions != undefined) {
        for (var i = 0; i < this.conditions.length && !isProhibited; i++) {
            if (this.conditions[i].isProhibited(affectable)) {
                isProhibited = true;
            }
        }
    }

    return isProhibited;
};

Davout.ConditionObj.Condition = function (name, effects) {
    if (!_.isString(name)) throw "Davout.ConditionObj.Condition name invalid parameter type";
    if (!_.isArray(effects)) throw "Davout.ConditionObj.Condition effects invalid parameter type";
    this.name = name;
    this.effects = effects;
    this.nextConditionNameIfStackable = null;
    this.isReversableByName = false;
};

/**
 *
 * @param name                      Name of Condition
 * @param effects                   Array of Effects
 * @param nextConditionNameIfStackable  If not null, then Condition is stackable.
 * @param isReversableByName        If true then using initial condition word in remove command will "pop" the off the nextConditionNameIfStackable of the stack.
 * @constructor
 */
Davout.ConditionObj.Condition = function (name, effects, nextConditionNameIfStackable, isReversableByName) {
    if (!_.isString(name)) throw "Davout.ConditionObj.Condition name invalid parameter type";
    if (!_.isArray(effects)) throw "Davout.ConditionObj.Condition effects invalid parameter type";
    this.name = name;
    this.effects = effects;
    this.nextConditionNameIfStackable = nextConditionNameIfStackable;
    this.isReversableByName = isReversableByName;
};

Davout.ConditionObj.Condition.prototype.getModifierFor = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.Condition.getModifierFor affectable invalid parameter type";
    var modifier = 0;
    for (var i = 0; i < this.effects.length; i++) {
        if (this.effects[i].hasModifier) {
            modifier += this.effects[i].getModifierFor(affectable);
        }
    }
    return modifier;
};

Davout.ConditionObj.Condition.prototype.isProhibited = function (affectable) {
    var isProhibited = false;
    if (this.effects != undefined) {
        for (var i = 0; i < this.effects.length && !isProhibited; i++) {
            if (this.effects[i].isProhibited(affectable)) {
                isProhibited = true;
            }
        }
    }

    return isProhibited;
};

Davout.ConditionObj.Effect = function (affectable, note, modifier, prohibitive) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.Effect affectable invalid parameter type";

    this.modifier = false;
    this.affectable = affectable;
    this.note = note;
    this.prohibitive = prohibitive;

    if (!prohibitive) {
        if (modifier != null) {
            this.modifier = modifier;
            this.hasModifier = true;
        } else {
            this.modifier = NaN;
            this.hasModifier = false;
        }
    }
};

Davout.ConditionObj.Effect.prototype.getModifierFor = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.Effect affectable invalid parameter type";
    if (this.affectable == affectable) {
        return this.modifier;
    }
    return 0;
};

Davout.ConditionObj.Effect.prototype.isProhibited = function (affectable) {
    if (!_.isString(affectable)) throw "Davout.ConditionObj.isProhibited affectable invalid parameter type";
    return this.affectable == affectable && this.prohibitive;

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

    if (state.Davout.TokensWithConditionObj == undefined) return 0;
    if (state.Davout.TokensWithConditionObj[tokenId] == undefined) return 0;

    return state.Davout.TokensWithConditionObj[tokenId].getModifierFor(affectedName);
};

Davout.ConditionObj.isProhibited = function isProhibited(tokenId, affectedName) {
    if (!_.isString(tokenId)) throw "Davout.ConditionObj.getModifierFor tokenId invalid parameter type";
    if (!_.isString(affectedName)) throw "Davout.ConditionObj.getModifierFor affectedName invalid parameter type";

    if (state.Davout.TokensWithConditionObj == undefined) return false;
    if (state.Davout.TokensWithConditionObj[tokenId] == undefined) return false;

    return state.Davout.TokensWithConditionObj[tokenId].isProhibited(affectedName);
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

