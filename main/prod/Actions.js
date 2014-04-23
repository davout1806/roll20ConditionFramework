var Davout = Davout || {};
Davout.ConditionFW = Davout.ConditionFW || {};
Davout.ConditionFW.command = Davout.ConditionFW.command || {};
Davout.ConditionFW.actions = Davout.ConditionFW.actions || {};

state.Davout.ConditionFW.ActionLookup = state.Davout.ConditionFW.ActionLookup || {};

/**
 * @param actionName                Name of the action
 *          Format: Caps with spaces. Ex: Melee Attack
 * @param attrAffectedName          Name of the roll20 character sheet attribute that represents a character's attribute
 *          that is associated with this action. D&D Ex: if action was Search it's associated attribute is INT. So what
 *          is the name of the roll20 attribute on roll20 character sheet that is used for
 *          Format: Caps no spaces. Ex: Str-Score
 * @param baseAffectedName          Name of the roll20 character sheet attribute that represents a character base score
 *          to perform this action.
 *          Format: Caps no spaces. Ex: Att-Melee-Base
 * @param doesApcPenApply           boolean - does the APC penalty apply to this action?
 * @param hasTargetBasedDcChallenge boolean - does this action have DC that is based on the target of the action?
 * @constructor
 */
Davout.ConditionFW.Action = function Action(actionName, attrAffectedName, baseAffectedName, doesApcPenApply, hasTargetBasedDcChallenge) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Action", arguments, [_.isString, _.isString, _.isString, _.isBoolean, _.isBoolean]);
    this.acName = actionName;
    this.acAttrAffectedName = attrAffectedName;
    this.acBaseAffectedName = baseAffectedName;
    this.acCharSheetAcpName = "AC-Penalty";
    this.acDoesApcPenApply = doesApcPenApply;
    this.acTargetBasedDcChallenge = undefined;
    if (hasTargetBasedDcChallenge === true){
        this.acTargetBasedDcChallenge = state.Davout.ConditionFW.DcChallengeLookup[this.acName];
    }
};

/**
 * Returns name of Effect that might be on target of action.
 * Ex: In Fantasy Craft if a target of an attack is Blinded, then attacker get a +2 bonus to hit.
 *      So in my Blinded Condition there is an Effect with name of VS-Melee Attack.
 * @returns {string}
 */
Davout.ConditionFW.Action.prototype.getEffectNameOnTarget = function () {
    return "VS-" + this.acName;
};

/**
 * TODO this code could use some clean up.
 *
 * This will display in chat the result of the die/dice plus all modifiers from all effects from all conditions that
 * affect this action that are currently on the acting token.
 * It will also include all modifiers from all effects from all conditions that affect the target of action if Effect
 * modifies acting token die roll as opposed to modifying it's "defense". See example in doc for
 * Davout.ConditionFW.Action.prototype.getEffectNameOnTarget
 *
 * @param actingConditionedToken    A Davout.ConditionFW.ConditionedToken object that is the token performing the action.
 * @param targetTokenIdOfAction     Either the Id of the target token or undefined.
 * @param effectOnTokenCollection   A Davout.ConditionFW.EffectOnTokenCollection object for the acting token
 * @param dieResult                 Either a number entered via the roll20 Input Window or Undefined.
 *                                  Undefined means the system is to roll the die, otherwise the user has entered a
 *                                  value that represents what he/she rolled. For those who like to roll physical dice.
 */
Davout.ConditionFW.Action.prototype.getResult = function (actingConditionedToken, targetTokenIdOfAction, effectOnTokenCollection, dieResult) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Action.getResult", arguments, [Davout.Utils.isTrueObject, [_.isString, _.isUndefined], Davout.Utils.isTrueObject, [_.isNumber, _.isUndefined]]);

    var isProhibited = effectOnTokenCollection.isProhibited();
    if (isProhibited === false) {
        dieResult = (dieResult === undefined) ? Davout.ConditionFW.actions.rollDie() : dieResult;
        effectOnTokenCollection.finalize();

        try {
            var attributeValue = Number(Davout.R20Utils.getAttribCurrentFor(actingConditionedToken.twcCharId, this.acAttrAffectedName)) + effectOnTokenCollection.efToCoFinalAttrbuteAffectMod;
            var baseValue = Number(Davout.R20Utils.getAttribCurrentFor(actingConditionedToken.twcCharId, this.acBaseAffectedName)) + effectOnTokenCollection.efToCoFinalActionAffectMod;
            var rollTotal = dieResult + Number(Math.floor(attributeValue / 2 - 5)) + Number(baseValue);

            var actionString = this.acName;
            actionString += ": Rolls " + dieResult + " + ";
            actionString += "(" + this.acAttrAffectedName + ": " + Math.floor(attributeValue / 2 - 5);
            actionString += ") + (" + this.acBaseAffectedName + ": " + baseValue + ")<br>";
            actionString += effectOnTokenCollection.efToCoDisplayMessage;

            if (this.acDoesApcPenApply) {
                var acpValue = Davout.R20Utils.getAttribCurrentFor(actingConditionedToken.twcCharId, this.acCharSheetAcpName);
                rollTotal -= Number(acpValue);
                actionString += " + (ACP: -" + acpValue + ")";
            }

            var actionStringTarget = "";
            if (targetTokenIdOfAction != undefined) {
                var targetAffects = effectOnTokenCollection.efToCoEffectsAffectingTargetReaction[targetTokenIdOfAction];
                actionStringTarget += "vs " + Davout.R20Utils.getGraphicProp(targetTokenIdOfAction, "name");
                var vsConditionList = "";
                if (targetAffects !== undefined) {
                    for (var j = 0; j < targetAffects.length; j++) {
                        var targetAffect = targetAffects[j];

                        if (targetAffect !== undefined) {
                            rollTotal += targetAffect.seaModifier;
                            vsConditionList += targetAffect.seaName + " (" + targetAffect.seaModifier + ")";
                        }
                    }
                }
                actionStringTarget += "<br>" + vsConditionList;
            }

            sendChat("API", "/w gm Total: <b>" + rollTotal + "</b><br>" + actionString + actionStringTarget);
        } catch (e) {
            sendChat("API", "/w gm ERROR: Could not perform action.<br>" + e);
        }
    }
    else {
        sendChat("API", isProhibited);
    }
};

/******************************************************************************************
 Function Declarations
 *******************************************************************************************/
/**
 *
 * @param actor         roll20 token that is performing the action
 * @param actionName    Name of action to perform
 * @param dieResult     Value from roll20 Input Value Window
 */
Davout.ConditionFW.actions.performAction = function (actor, actionName, dieResult) {
    "use strict";
    if (actor === undefined) {
        sendChat("API", "/w gm Selected object is not valid token.");
        return;
    }

    if (Davout.R20Utils.tokenObjToCharId(actor) === undefined) {
        sendChat("API", "/w gm Selected object does not have a backing character sheet.");
        return;
    }

    var tokenId = actor.get("id");
    var tokenWithCondition = Davout.ConditionFW.conditions.getTokenInstance(tokenId);
    var targetIdOfAction = state.Davout.ConditionFW.TargetIdOfAction;
    var action = state.Davout.ConditionFW.ActionLookup[actionName];
    var effectOnTokenCollection = tokenWithCondition.getEffectsForAction(action, targetIdOfAction);
    action.getResult(tokenWithCondition, targetIdOfAction, effectOnTokenCollection, dieResult);
    if (action.acTargetBasedDcChallenge != undefined){
        action.acTargetBasedDcChallenge.calc(targetIdOfAction);
    }
};

/**
 * Return result of action dice roll.
 * @returns {*}
 */
Davout.ConditionFW.actions.rollDie = function () {
    return randomInteger(20);
};

// Actions

