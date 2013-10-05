/**
 * state.Davout.TokensWithConditions[id] where id is token id
 *
 * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 * Therefore, must apply effects on rolls.
 */

var Davout = Davout || {};
Davout.Conditions = Davout.Conditions || {};
state.Davout = state.Davout || {};
state.Davout.TokensWithConditions = state.Davout.TokensWithConditions || [];

/******************************************************************************************
    Class Declarations
*******************************************************************************************/

Davout.Conditions.TokenWithConditions = function (tokenName) {
    this.tokenName = tokenName;
    this.conditions = [];
};

Davout.Conditions.TokenWithConditions.prototype = {
    addCondition: function (condition) {
        this.conditions.push(condition);
        sendChat("API", "/w gm Condition " + condition + " was added to " + this.tokenName);
        log("Added: condition = " + condition);
    },
    removeCondition: function (condition) {
        var index = this.conditions.indexOf(condition);
        if (index > -1){
            this.conditions = this.conditions.splice(index, 1);
            sendChat("API", "/w gm Condition " + condition + " was removed from " + this.tokenName);
            log("Removed: condition = " + condition);
        } else {
            sendChat("API", "Selected Token " + name + " does not have condition: " + condition.name);
        }
    },
    getModifierFor: function (affectable) {
        var modifier = 0;
        if (this.conditions != undefined) {
            _.each(this.conditions, function (condition) {
                modifier += condition.getModifierFor(affectable);
            });
        }
        return modifier;
    }
};

Davout.Conditions.Condition = function (name, effects) {
    this.name = name;
    this.effects = effects;
};

Davout.Conditions.Condition.prototype = {
    getModifierFor: function (affectable) {
        var modifier = 0;
        _.each(this.effects, function (effect) {
            modifier += effect.getModifierFor(affectable);
        });
        return modifier;
    }
};

Davout.Conditions.Effect = function (affectable, modifier) {
    this.affectable = affectable;
    this.modifier = modifier;
};

Davout.Conditions.Effect.prototype = {
    getModifierFor: function (affectable) {
        if (this.affectable == affectable) {
            return this.modifier;
        }
        return 0;
    }
};

Davout.Conditions.Action = function () {
    //action name -> action formula
};

Davout.Conditions.ActionFormula = function () {
    // list that contains attributes (operands) and operators.
};

Davout.Conditions.command = Davout.Conditions.command || {};

state.Davout.Conditions = state.Davout.Conditions || [];
state.Davout.TokensWithConditions = state.Davout.TokensWithConditions || [];

Davout.Conditions.onTokenDestroyedEvent = function () {
    log("Deleted state.Davout.TokensWithConditions for " + token.get("name"));
    state.Davout.TokensWithConditions[token] = null;
};

Davout.Conditions.addEffects = function addEffects(tokenId, condition, tokenName) {
    if (state.Davout.TokensWithConditions == undefined) {
        state.Davout.TokensWithConditions = [];
    }
    if (state.Davout.TokensWithConditions[tokenId] == undefined) {
        var tokenWithConditions = new Davout.Conditions.TokenWithConditions(tokenName);
        tokenWithConditions.addCondition(condition);
        state.Davout.TokensWithConditions[tokenId] = tokenWithConditions;
    } else {
        state.Davout.TokensWithConditions[tokenId].addCondition(condition);
    }
};

Davout.Conditions.removeEffects = function removeEffects(tokenId, condition) {
    if (state.Davout.TokensWithConditions[tokenId] != undefined){
        state.Davout.TokensWithConditions[tokenId].removeCondition(condition);
    }
};

Davout.Conditions.getModifierFor = function getModifierFor(tokenId, conditionName){
    if (state.Davout.TokensWithConditions == undefined) {
        return 0;
    }

    if (state.Davout.TokensWithConditions[tokenId] == undefined){
        return 0;
    }
    return state.Davout.TokensWithConditions[tokenId].getModifierFor(conditionName);
};

Davout.Conditions.command._manageCondition = function (actionType, selected, condition) {
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                switch (actionType) {
                    case "ADD":
                        Davout.Conditions.addEffects(tokenId, condition, tokenObjR20.get("name"));
                        break;
                    case "DEL":
                        Davout.Conditions.removeEffects(tokenId, condition);
                        break;
                    case "SHOW":
                        sendChat("API", "/w gm " + tokenObjR20.get("name") + " has the following conditions " + Davout.Conditions.getConditionsOnToken(tokenId));
                        break;
                }
            }
        }
    });
};

on("destroy:token", Davout.Conditions.onTokenDestroyedEvent);

// ConditionsByToken

