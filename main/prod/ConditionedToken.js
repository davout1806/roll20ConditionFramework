Davout.ConditionFW = Davout.ConditionFW || {};
Davout.ConditionFW = Davout.ConditionFW || {};

/******************************************************************************************
 Class Declarations
 *******************************************************************************************/

Davout.ConditionFW.WorkingStateChar = function WorkingStateChar(charId) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.WorkingStateChar", arguments, [_.isString]);
    if (!(this instanceof Davout.ConditionFW.WorkingStateChar)) {return new Davout.ConditionFW.WorkingStateChar(charId)}
    this.chCharId = charId;
    var attributes = findObjs({ _type: 'attribute', _characterid: this.chCharId });
    _.each(attributes, function (attribute) {
        this.chCurrentValues = attribute.get("current");
    });
};

/**
 * Constructor for TokenWithConditions object, which represents the conditions on the associated roll20 token.
 * @constructor
 */
Davout.ConditionFW.ConditionedToken = function (tokenId) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.ConditionedToken", arguments, [_.isString]);
    if (!(this instanceof Davout.ConditionFW.ConditionedToken)) {return new Davout.ConditionFW.ConditionedToken(tokenId)}
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
    if (condition.coMaxStackSize > 1) {
        var conditionCount = _.where(this.twcConditions, {coName: condition.coName}).length;
        // if additional level of condition can be added to stack
        if (condition.coMaxStackSize > conditionCount) {
            this.twcConditions.push(condition);
            var displayCount = conditionCount + 1;
            sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.coName) + ": " + displayCount + " was added to " + this.twcName);
            log("Added: condition " + Davout.Utils.capitaliseFirstLetter(condition.coName) + ": " + displayCount + " to " + this.twcName);
        } else { // if max level of condition has been reached.
            // if the max level of condition causes a different condition to be applied.
            if (condition.coNextConditionName != null) {
                this.twcConditions.push(state.Davout.ConditionFW.ConditionLookup[condition.coNextConditionName]);
                sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.coNextConditionName) + " was added to " + this.twcName);
                log("Added: condition " + Davout.Utils.capitaliseFirstLetter(condition.coNextConditionName) + " to " + this.twcName);
            } else {
                sendChat("API", "/w gm " + this.twcName + " already has reached the stack limit for " + Davout.Utils.capitaliseFirstLetter(condition.coName));
            }
        }
    } else {
        // if token does not already have condition
        if (!_.findWhere(this.twcConditions, {coName: condition.coName})) {
            this.twcConditions.push(condition);
            sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.coName) + " was added to " + this.twcName);
            log("Added: condition " + Davout.Utils.capitaliseFirstLetter(condition.coName) + " to " + this.twcName);
        } else {
            sendChat("API", "/w gm " + this.twcName + " already has the non-stackable condition " + Davout.Utils.capitaliseFirstLetter(condition.coName));
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
        sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.coName) + " was removed from " + this.twcName);
        log("Removed: condition " + Davout.Utils.capitaliseFirstLetter(condition.coName) + " removed from " + this.twcName);
    } else {
        sendChat("API", "Selected Token " + Davout.Utils.capitaliseFirstLetter(condition.coName) + " does not have condition: " + Davout.Utils.capitaliseFirstLetter(condition.coName));
    }
};

/**
 * Function that return string of all conditions on the TokensWithConditionObj associated to the roll20 token with the given tokenId.
 * @returns {string}
 */
Davout.ConditionFW.ConditionedToken.prototype.listAllConditions = function () {
    "use strict";
    var conditions = this.twcConditions;
    var str = "";
    for (var i = 0; i < conditions.length; i++) {
        str += Davout.Utils.capitaliseFirstLetter(conditions[i].coName) + "<br>";
    }

    return str;
};


// todo modifiers from attributes
// todo dc challenge #
Davout.ConditionFW.ConditionedToken.prototype.getAffectForAction = function (actionObj, targetIdsArray) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.ConditionedToken.prototype.getAffectForAction", arguments, [Davout.Utils.isTrueObject, _.isArray]);

    var affectCollection = new Davout.ConditionFW.AffectCollection();

    _.each(this.twcConditions, function (condition) {
        var effectsAffectingAction = condition.getEffectsAffectingAction(actionObj.acName);
        affectCollection.affIsProhibited = effectsAffectingAction.isProhibited;
        affectCollection.addEffectsAffectingAction(effectsAffectingAction.affects);
        affectCollection.addEffectsAffectingActionAttr(condition.getEffectsAffectingActorsAttr(actionObj.acAttrAffectedName).affects);
    });

    _.each(targetIdsArray, function (targetTokenId) {
        _.each(Davout.ConditionFW.getTokenInstance(targetTokenId).twcConditions, function (condition) {
            affectCollection.addTargetEffectsAffects(targetTokenId, condition.getEffectsAffectingAction(actionObj.getTargetAffectedName()).affects);
        });
    });

    return affectCollection;
};

// ConditionedToken

