var Davout = Davout || {};
Davout.ConditionFW = Davout.ConditionFW || {};
Davout.ConditionFW.command = Davout.ConditionFW.command || {};

state.Davout.ConditionFW.ActionLookup = state.Davout.ConditionFW.ActionLookup || {};

/**
 *
 * @param actionName        Format: Caps with spaces. Ex: Melee Attack
 * @param attrAffectedName  Format: Caps no spaces. Ex: Str
 * @param baseAffectedName  Format: Caps no spaces. Ex: Att-Melee-Base
 * @param doesApcPenApply
 * @constructor
 */
Davout.ConditionFW.Action = function Action(actionName, attrAffectedName, baseAffectedName, doesApcPenApply) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Action", arguments, [_.isString, _.isString, _.isString, _.isBoolean]);
    this.acName = actionName;
    this.acAttrAffectedName = attrAffectedName;
    this.acBaseAffectedName = baseAffectedName;
    this.acCharSheetAcpName = "AC-Penalty";
    this.acDoesApcPenApply = doesApcPenApply;
};

/**
 *
 * @returns {string} Name of reaction, used as affectedName in Effect.
 */
Davout.ConditionFW.Action.prototype.getTargetAffectedName = function () {
    return "VS-" + this.acName;
};

// todo this could use some clean up.
Davout.ConditionFW.Action.prototype.getResult = function (actingConditionedToken, targetTokenIdOfAction, affectCollection, dieResult) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Action.getResult", arguments, [Davout.Utils.isTrueObject, [_.isString, _.isUndefined], Davout.Utils.isTrueObject, [_.isNumber, _.isUndefined]]);

    var isProhibited = affectCollection.isProhibited();
    if (isProhibited === false) {
        dieResult = (dieResult === undefined) ? randomInteger(20) : dieResult;
        affectCollection.finalize();

        try {
            var attributeValue = Number(Davout.R20Utils.getAttribCurrentFor(actingConditionedToken.twcCharId, this.acAttrAffectedName)) + affectCollection.afCoFinalAttrbuteAffectMod;
            var baseValue = Number(Davout.R20Utils.getAttribCurrentFor(actingConditionedToken.twcCharId, this.acBaseAffectedName)) + affectCollection.afCoFinalActionAffectMod;
            var rollTotal = dieResult + Number(Math.floor(attributeValue / 2 - 5)) + Number(baseValue);

            var actionString = this.acName;
            actionString += ": Rolls " + dieResult + " + ";
            actionString += "(" + this.acAttrAffectedName + ": " + Math.floor(attributeValue / 2 - 5);
            actionString += ") + (" + this.acBaseAffectedName + ": " + baseValue + ")<br>";
            actionString += affectCollection.afCoDisplayMessage;

            if (this.acDoesApcPenApply) {
                var acpValue = Davout.R20Utils.getAttribCurrentFor(actingConditionedToken.twcCharId, this.acCharSheetAcpName);
                rollTotal -= Number(acpValue);
                actionString += " + (ACP: -" + acpValue + ")";
            }

            var actionStringTarget = "";
            if (targetTokenIdOfAction != undefined) {
                var targetAffects = affectCollection.afCoEffectsAffectingTargetReaction[targetTokenIdOfAction];
                actionStringTarget += "vs (" + Davout.R20Utils.getGraphicProp(targetTokenIdOfAction, "name");
                var rollTotalTarget = 0;
                var vsTotal = rollTotal;
                var vsConditionList = "";
                if (targetAffects !== undefined) {
                    for (var j = 0; j < targetAffects.length; j++) {
                        var targetAffect = targetAffects[j];

                        if (targetAffect !== undefined) {
                            rollTotalTarget += targetAffect.seaModifier;
                            vsConditionList += targetAffect.seaName + " ";
                        }
                    }
                    vsTotal += rollTotalTarget;
                }
                actionStringTarget += ": <b>" + vsTotal + "</b> " + vsConditionList + ")";
                actionStringTarget += "<br>";
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

// Actions

