/**
 * state.Davout.TokenConds[id] where id is token id
 *
 * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 * Therefore, must apply effects on rolls.
 */
Davout.Conditions = Davout.Conditions || {};
state.Davout = state.Davout || {};
state.Davout.TokenConds = state.Davout.TokenConds || [];

Davout.Conditions.TokenWithConditions = function () {
    this.conditions = [];
};

Davout.Conditions.TokenWithConditions.prototype = {
    addCondition: function (condition){
        log("condition = " + condition);
        this.conditions.push(condition);
    },
    removeCondition: function(condition){
        this.conditions = Davout.Utils.removeFromArrayFirstOccurOf(this.conditions, condition);
    },
    getModifierFor: function (affectable) {
        var modifier = 0;
        _.each(this.conditions, function (condition) {
            modifier += condition.getModifierFor(affectable);
        });
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
    }
};

Davout.Conditions.Action = function () {
    //action name -> action formula
};

Davout.Conditions.ActionFormula = function () {
    // list that contains attributes (operands) and operators.
};

Davout.Conditions.command = Davout.Conditions.command || {};

var state = []; // for testing only

state.Davout.Conditions = state.Davout.Conditions || [];
state.Davout.TokenConds = state.Davout.TokenConds || [];

Davout.Conditions.onTokenDestroyedEvent = function (){
    log("Deleted state.Davout.TokenConds for " + token.get("name"));
    state.Davout.TokenConds[token] = null;
};

Davout.Conditions.removeConditionFromToken = function (name, tokenId, conditionName) {
//    log("DEL prestate = " + conditionName + " " + state["davoutFcTokenConds"][tokenId]);
//    if (state["davoutFcTokenConds"][tokenId] != undefined && state["davoutFcTokenConds"][tokenId].indexOf(conditionName) > -1) {
//        state["davoutFcTokenConds"][tokenId] = Davout.Utils.removeFromArrayFirstOccurOf(state["davoutFcTokenConds"][tokenId], conditionName);
//        log("Delete poststate = " + state["davoutFcTokenConds"][tokenId]);
//        return true;
//    } else {
//        sendChat("API", "Selected Token " + name + " does not have condition: " + conditionName);
//        return false;
//    }
};

Davout.Conditions.addEffects = function addEffects(tokenId, condition) {
//    if (Davout.Conditions.addConditionToToken(tokenId, condition)) {
//        sendChat("API", "/w gm Condition " + condition + " was added to " + tokenName);
//    }
    if (state.Davout.TokenConds == undefined){
        state.Davout.TokenConds = [];
    }
    if (state.Davout.TokenConds[tokenId] == undefined){
        var tokenWithConditions = new Davout.Conditions.TokenWithConditions();
        tokenWithConditions.addCondition(condition);
        state.Davout.TokenConds[tokenId] = tokenWithConditions;
    } else {
        state.Davout.TokenConds[tokenId].addCondition(condition);
    }

};

Davout.Conditions.removeEffects = function removeEffects(tokenId, condition, tokenName) {
    if (Davout.Conditions.removeConditionFromToken(tokenName, tokenId, condition)) {
        sendChat("API", "/w gm Condition " + condition + " was removed from " + tokenName);
    }
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
                        Davout.Conditions.removeEffects(tokenId, condition, tokenObjR20.get("name"));
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

