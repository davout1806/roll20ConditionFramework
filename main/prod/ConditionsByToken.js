/**
 * state.davoutTokenConds[id] where id is token id
 *
 * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 * Therefore, must apply effects on rolls.
 */
var DavoutCond = DavoutCond || {};
state.davoutTokenConds = state.davoutTokenConds || [];

DavoutCond.TokenWithConditions = function () {
    this.conditions = [];
};

DavoutCond.TokenWithConditions.prototype = {
    addCondition: function (condition){
        log("condition = " + condition);
        this.conditions.push(condition);
    },
    removeCondition: function(condition){
        this.conditions = DavoutUtils.removeFromArrayFirstOccurOf(this.conditions, condition);
    },
    getModifierFor: function (affectable) {
        var modifier = 0;
        _.each(this.conditions, function (condition) {
            modifier += condition.getModifierFor(affectable);
        });
        return modifier;
    }
};

DavoutCond.Condition = function (name, effects) {
    this.name = name;
    this.effects = effects;
};

DavoutCond.Condition.prototype = {
    getModifierFor: function (affectable) {
        var modifier = 0;
        _.each(this.effects, function (effect) {
            modifier += effect.getModifierFor(affectable);
        });
        return modifier;
    }
};

DavoutCond.Effect = function (affectable, modifier) {
    this.affectable = affectable;
    this.modifier = modifier;
};

DavoutCond.Effect.prototype = {
    getModifierFor: function (affectable) {
        if (this.affectable == affectable) {
            return this.modifier;
        }
    }
};

DavoutCond.Action = function () {
    //action name -> action formula
};

DavoutCond.ActionFormula = function () {
    // list that contains attributes (operands) and operators.
};

DavoutCond.command = DavoutCond.command || {};

var state = []; // for testing only

state.davoutConditions = state.davoutConditions || [];
state.davoutTokenConds = state.davoutTokenConds || [];

DavoutCond.onTokenDestroyedEvent = function (){
    log("Deleted state.davoutTokenConds for " + token.get("name"));
    state.davoutTokenConds[token] = null;
};

DavoutCond.removeConditionFromToken = function (name, tokenId, conditionName) {
//    log("DEL prestate = " + conditionName + " " + state["davoutFcTokenConds"][tokenId]);
//    if (state["davoutFcTokenConds"][tokenId] != undefined && state["davoutFcTokenConds"][tokenId].indexOf(conditionName) > -1) {
//        state["davoutFcTokenConds"][tokenId] = DavoutUtils.removeFromArrayFirstOccurOf(state["davoutFcTokenConds"][tokenId], conditionName);
//        log("Delete poststate = " + state["davoutFcTokenConds"][tokenId]);
//        return true;
//    } else {
//        sendChat("API", "Selected Token " + name + " does not have condition: " + conditionName);
//        return false;
//    }
};

DavoutCond.addEffects = function addEffects(tokenId, condition) {
//    if (DavoutCond.addConditionToToken(tokenId, condition)) {
//        sendChat("API", "/w gm Condition " + condition + " was added to " + tokenName);
//    }
    if (state.davoutTokenConds == undefined){
        state.davoutTokenConds = [];
    }
    if (state.davoutTokenConds[tokenId] == undefined){
        var tokenWithConditions = new DavoutCond.TokenWithConditions();
        tokenWithConditions.addCondition(condition);
        state.davoutTokenConds[tokenId] = tokenWithConditions;
    } else {
        state.davoutTokenConds[tokenId].addCondition(condition);
    }

};

DavoutCond.removeEffects = function removeEffects(tokenId, condition, tokenName) {
    if (DavoutCond.removeConditionFromToken(tokenName, tokenId, condition)) {
        sendChat("API", "/w gm Condition " + condition + " was removed from " + tokenName);
    }
};

DavoutCond.command._manageCondition = function (actionType, selected, condition) {
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                switch (actionType) {
                    case "ADD":
                        DavoutCond.addEffects(tokenId, condition, tokenObjR20.get("name"));
                        break;
                    case "DEL":
                        DavoutCond.removeEffects(tokenId, condition, tokenObjR20.get("name"));
                        break;
                    case "SHOW":
                        sendChat("API", "/w gm " + tokenObjR20.get("name") + " has the following conditions " + DavoutCond.getConditionsOnToken(tokenId));
                        break;
                }
            }
        }
    });
};

on("destroy:token", DavoutCond.onTokenDestroyedEvent);

// ConditionsByToken

