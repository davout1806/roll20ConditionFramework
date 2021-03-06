Davout.ConditionFW = Davout.ConditionFW || {};

/******************************************************************************************
 Class Declarations
 *******************************************************************************************/

/**
 * Constructor for WorkingStateChar
 * @param charId
 * @constructor
 */
//Davout.ConditionFW.WorkingStateChar = function WorkingStateChar(charId) {
//    "use strict";
//    Davout.Utils.argTypeCheck("Davout.ConditionFW.WorkingStateChar", arguments, [_.isString]);
//    this.chCharId = charId;
//    var attributes = findObjs({ _type: 'attribute', _characterid: this.chCharId });
//    _.each(attributes, function (attribute) {
//        this.chCurrentValues = attribute.get("current");
//    });
//};

/**
 * Represents the conditions on the associated roll20 token.
 *
 * Constructor for TokenWithConditions object.
 * @constructor
 */
Davout.ConditionFW.ConditionedToken = function ConditionedToken (tokenId) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.ConditionedToken", arguments, [_.isString]);
    this.twcTokenId = tokenId;
    this.twcName = getObj("graphic", this.twcTokenId).get("name");
    this.twcCharId = Davout.R20Utils.tokenIdToCharId(this.twcTokenId);
    this.twcConditions = [];
};

/**
 * Add condition to this token
 * @param condition
 */
Davout.ConditionFW.ConditionedToken.prototype.addCondition = function (condition) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.ConditionedToken.addCondition", arguments, [Davout.Utils.isTrueObject]);
    // condition is stackable
    if (condition.coMaxGradeNumber > 1) {
        var conditionCount = _.where(this.twcConditions, {coName: condition.coName}).length;
        // if additional level of condition can be added to stack
        if (condition.coMaxGradeNumber > conditionCount) {
            this.twcConditions.push(condition);
            var displayCount = conditionCount + 1;
            sendChat("API", "/w gm Condition " + condition.coName + ": " + displayCount + " was added to " + this.twcName);
            log("Added: condition " + condition.coName + ": " + displayCount + " to " + this.twcName);
        } else { // if max level of condition has been reached.
            // if the max level of condition causes a different condition to be applied.
            if (condition.coNextConditionName != null) {
                this.twcConditions.push(state.Davout.ConditionFW.ConditionLookup[condition.coNextConditionName]);
                sendChat("API", "/w gm Condition " + condition.coNextConditionName + " was added to " + this.twcName);
                log("Added: condition " + condition.coNextConditionName + " to " + this.twcName);
            } else {
                sendChat("API", "/w gm " + this.twcName + " already has reached the stack limit for " + condition.coName);
            }
        }
    } else {
        // if token does not already have condition
        if (!_.findWhere(this.twcConditions, {coName: condition.coName})) {
            this.twcConditions.push(condition);
            sendChat("API", "/w gm Condition " + condition.coName + " was added to " + this.twcName);
            log("Added: condition " + condition.coName + " to " + this.twcName);
        } else {
            sendChat("API", "/w gm " + this.twcName + " already has the non-stackable condition " + condition.coName);
        }
    }
};

/**
 * Remove condition from this token
 * @param condition
 */
Davout.ConditionFW.ConditionedToken.prototype.removeCondition = function (condition) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.ConditionedToken.removeCondition", arguments, [Davout.Utils.isTrueObject]);
    var index = this.twcConditions.indexOf(condition);
    if (index > -1) {
        this.twcConditions.splice(index, 1);
        sendChat("API", "/w gm Condition " + condition.coName + " was removed from " + this.twcName);
        log("Removed: condition " + condition.coName + " removed from " + this.twcName);
    } else {
        sendChat("API", "/w gm Selected Token " + condition.coName + " does not have condition: " + condition.coName);
    }
};

/**
 * Returns string of all conditions on the TokensWithConditionObj associated to the roll20 token with the given tokenId.
 * @returns {string}
 */
Davout.ConditionFW.ConditionedToken.prototype.listAllConditions = function () {
    "use strict";
    var str = "";
    for (var i = 0; i < this.twcConditions.length; i++) {
        str += this.twcConditions[i].coName + "<br>";
    }

    return str;
};


// todo dc challenge #
Davout.ConditionFW.ConditionedToken.prototype.getEffectsForAction = function (actionObj, targetId) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.ConditionedToken.prototype.getEffectsForAction", arguments, [Davout.Utils.isTrueObject, [_.isString, _.isUndefined]]);

    var effectOnTokenCollection = new Davout.ConditionFW.EffectOnTokenCollection(this.twcName, actionObj.acName);

    _.each(this.twcConditions, function (condition) {
        var effectsAffectingAction = condition.getEffectsAffectingAction(actionObj.acName);
        effectOnTokenCollection.efToCoIsProhibited = effectsAffectingAction.isProhibited;
        effectOnTokenCollection.addEffectsAffectingAction(effectsAffectingAction.effectsOnToken);
        effectOnTokenCollection.addEffectsAffectingActionAttr(condition.getEffectsAffectingActorsAttr(actionObj.acAttrAffectedName).effectsOnToken);
    });

    if (targetId != undefined) {
        _.each(Davout.ConditionFW.conditions.getTokenInstance(targetId).twcConditions, function (condition) {
            effectOnTokenCollection.addTargetEffectsAffects(targetId, condition.getEffectsAffectingAction(actionObj.getEffectNameOnTarget()).effectsOnToken);
        });
    }

    return effectOnTokenCollection;
};

// ConditionedToken

