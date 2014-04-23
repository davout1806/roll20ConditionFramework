
// A key design goal: Conditions are associated to individual tokens not characters.
// This allows the use of multiple tokens to be associated to a single character while
// each token can have different conditions. But each token needs to be associated a character.
//
// This framework is designed to work with Games whose action resolution is:
//    die roll + some base value for action (skill or attack) + some modifier value based on something (such as an attribute score) that is related to action.
//    Example from D&D: Action is Search(Int): d20 + ranks in Search + modifier from Int.
// For every action there MUST be a roll20 attribute on the roll20 character sheet for the action and for the action's
// associated attribute. In above example that would be Search and Int. The actual names for these are customizable but
// they must exist.
// How this framework would work with other games is undetermined.
//
// A Condition contains a list of Effects. An Effect can be associated to either an attribute,
// an action or a reaction to an action (such as "vs melee attack").
//
// Each Effect has the following (all of which are configurable):
// * a flag that determines whether the effect will prohibit the associated action
// * optional modifier
// * optional note string
//
// An Action is something the token is trying to do that requires a successful roll to succeed.
// This could be an attack or skill check. An Action has the following (all of which are configurable):
// * name of roll20 attribute for character attribute (as in D&D attribute ex: Strength)
//    from the character that is associated to the action.
//    For example, Melee Attack action could be STR
// * name of roll20 attribute for character ability (as in a character's rank in a skill)
//    from the character that is associated to the action.
//    For example, Sneak action could be Sneak_Skill
// * flag if APC effects action
// * name of APC attribute
//
// Additional Features:
// * GM can add/remove condition on all selected tokens. [done]
// * Ability to configure what Effects are associated with a given Condition. [done]
// * Ability to set timer on a specific condition on a specific token.
// * Ability to stack multiple occurrences of a Condition on the same token up to a configurable number. [done]
// * Ability to set a condition to be automatically added to token when a specific Condition has reached it max stack size. [done]
// * Apply optional Effect modifier to result. [done]
// * If Effect is associated to an attribute, it will be applied to that attribute of the character, which then affects the result. [done]
// * Code to define the conditions and their effects is separate from code that tracks and actually applies effects. [done]
// * Ability to select a targets of an action. [done]
//
// Currently the dice rolled is a single d20 but this can be customized by changing Davout.ConditionFW.actions.rollDie()
//
// Required design specifications:
// 1. Allow multiple tokens to use the same character.
// 2. Allow conditions to be assigned individually to tokens even if they share the same character.
//
// Desired design specifications:
// 1. Quickly perform action of a token, preferably without having to open character sheet (ALT+double click)
//
// ==========================================================================================================================
// * state.Davout.TokensWithConditionObj[id] where id is token id
// *
// * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
// * Therefore, must apply effects on rolls.



Davout = (Davout || {});
Davout.ConditionFW = Davout.ConditionFW || {};
Davout.ConditionFW.conditions = Davout.ConditionFW.conditions || {};

state.Davout = state.Davout || {};
state.Davout.ConditionFW = state.Davout.ConditionFW || {};
state.Davout.ConditionFW.ConditionLookup = state.Davout.ConditionFW.ConditionLookup || {};

/******************************************************************************************
 Class Declarations
 *******************************************************************************************/
/**
 * Represents a given type of Condition. There is 1 instance of this object for each type of Condition.
 * Some conditions can stack or in other words a token could have multiple grades of the same condition.
 * In some situations if a token already has a given Condition and receives that condition again, a different Condition
 *      is applied to that token. If this condition has multiple grades, the token will only receive the different
 *      Condition once the max number of grades has been reached.
 *
 * Constructor for Condition object
 * @param name                      Name of Condition
 * @param effects                   Array of Effects
 * @param [maxGradeNumber]          The max number of grades of this condition that can be assigned to a token. Default is 1.
 * @param [nextConditionName]       The name of next Condition if token has reached this Condition's maxGradeNumber and
 *                                  receives this Condition.
 * @constructor
 */
Davout.ConditionFW.Condition = function Condition (name, effects, maxGradeNumber, nextConditionName) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition", arguments, [_.isString, _.isArray, [_.isNumber, _.isUndefined], [_.isString, _.isUndefined]]);
    this.coName = name;
    if (maxGradeNumber == undefined) {
        this.coMaxGradeNumber = 1;
    } else {
        this.coMaxGradeNumber = maxGradeNumber;
    }
    this.coNextConditionName = nextConditionName;

    this.coEffects = {};
    for (var i = 0; i < effects.length; i++) {
        var nameOfAffected = effects[i].efNameOfAffected;
        if (this.coEffects[nameOfAffected] == undefined) {
            this.coEffects[nameOfAffected] = [];
        }
        this.coEffects[nameOfAffected].push(effects[i]);
    }
};

/**
 * Returns an array of all of the Effects of this Condition that affects the given actionName .
 * @param actionName    Name of action
 * @returns {*}
 */
Davout.ConditionFW.Condition.prototype.getEffectsAffectingAction = function (actionName) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition.prototype.getEffectsAffectingAction", arguments, [_.isString]);
    return this.effectsOnToken(actionName, false);
};

/**
 * Returns an array of all of the Effects of this Condition that affects the actor's given attributeName.
 * @param attributeName    Name of attribute
 * @returns {*}
 */
Davout.ConditionFW.Condition.prototype.getEffectsAffectingActorsAttr = function (attributeName) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition.prototype.getEffectsAffectingActorsAttr", arguments, [_.isString]);
    return this.effectsOnToken(attributeName, true);
};

/**
 * Returns a new object that contains:
 *      boolean that states whether the action based on actor's conditions can be performed and
 *      an array of Davout.ConditionFW.EffectOnToken objects that either affects an action or an attribute
 * @param nameOfAffected            The name of the attribute or action that is affected.
 * @param isAffectingAttribute      boolean whether returned array should return affects on attributes (true) or actions (false)
 * @returns {{isProhibited: boolean, effectsOnToken: Array}}
 */
Davout.ConditionFW.Condition.prototype.effectsOnToken = function (nameOfAffected, isAffectingAttribute) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition.prototype.effectsOnToken", arguments, [_.isString, _.isBoolean, _.isString]);
    var effectsOnTokenList = [];
    var effects = [];
    var prohibited = false;
    if (this.coEffects[nameOfAffected] !== undefined) {
        effects = effects.concat(this.coEffects[nameOfAffected]);
    }
    var conditionName = this.coName;

    _.each(effects, function (effect) {
        var effectOnToken = effect.getEffectOnToken(conditionName, isAffectingAttribute);
        if (effect.efIsProhibited) {
            prohibited = true;
        }
        effectsOnTokenList.push(effectOnToken);
    });

    return {isProhibited: prohibited, effectsOnToken: effectsOnTokenList};
};

/**
 * Constructor for Effect object
 * @param nameOfAffected    The given action or attribute that this effect affects.
 * @param isAttribute
 * @param isProhibited      Whether or not this effect prevents the given action from being performed.
 * @param modifier          Modifier this effects applies to the given action or attribute
 * @param [note]            Any note related to how this effect affects the given action or attribute.
 * @constructor
 */
Davout.ConditionFW.Effect = function Effect (nameOfAffected, isAttribute, isProhibited, modifier, note) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Effect", arguments, [_.isString, _.isBoolean, _.isBoolean, _.isNumber, [_.isString, _.isUndefined]]);

    this.efModifier = NaN;
    this.efHasModifier = false;
    this.efNameOfAffected = nameOfAffected;
    this.efNote = (note === undefined) ? "" : note;
    this.efIsProhibited = isProhibited;
    this.efIsAttribute = isAttribute;

    if (!isProhibited) {
        if (modifier !== undefined) {
            this.efModifier = modifier;
            this.efHasModifier = true;
        }
    }
};

/**
 * Return a newly created Davout.ConditionFW.EffectOnToken that has the modifications of this Effect.
 * @param conditionName                     Name of Condition
 * @param isAffectingAttribute              boolean whether the effect is expected to affect an attribute (true) or an action (false)
 * @returns {Davout.ConditionFW.EffectOnToken}
 */
Davout.ConditionFW.Effect.prototype.getEffectOnToken = function (conditionName, isAffectingAttribute){
    Davout.Utils.argTypeCheck("Davout.ConditionFW.EffectOnToken", arguments, [_.isString, _.isBoolean]);
    if(this.efIsAttribute !== isAffectingAttribute){
        var msg ="not to be an Attribute";
        if (this.efIsAttribute){
            msg = "to be an Attribute"
        }
        throw "Davout.ConditionFW.Effect.prototype.getEffectOnToken Expecting affected " + msg;
    }
    return new Davout.ConditionFW.EffectOnToken(conditionName, this.efIsProhibited, this.efModifier, this.efNote);
};

/******************************************************************************************
 Function Declarations
 *****************************************************************************************/
/**
 * Return the Davout.ConditionFW.ConditionedToken object that is stored
 * in state.Davout.ConditionFW.TokensWithConditionObj at index tokenId.
 *
 * If there is no Davout.ConditionFW.ConditionedToken object at that index one will be created
 *
 * @param tokenId
 * @returns {*}
 */
Davout.ConditionFW.conditions.getTokenInstance = function (tokenId) {
    "use strict";
    if (!_.isString(tokenId)) throw "Davout.ConditionFW.conditions.getTokenInstance tokenId invalid parameter type";
    if (state.Davout.ConditionFW.TokensWithConditionObj == undefined) {
        state.Davout.ConditionFW.TokensWithConditionObj = {};
    }

    if (state.Davout.ConditionFW.TokensWithConditionObj[tokenId] == undefined) {
        var conditionedToken = new Davout.ConditionFW.ConditionedToken(tokenId);
        state.Davout.ConditionFW.TokensWithConditionObj[tokenId] = conditionedToken;
    }

    return state.Davout.ConditionFW.TokensWithConditionObj[tokenId];
};

/**
 * Perform actionType (ADD,DEL, or SHOW) for conditionName on all tokens in selected array.
 * @param actionType        ADD, DEL, or SHOW
 * @param selected          array of token
 * @param conditionName     the condition  Ignored for SHOW action
 */
Davout.ConditionFW.conditions.manageCondition = function (actionType, selected, conditionName) {
    "use strict";
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                var tokenConditions = Davout.ConditionFW.conditions.getTokenInstance(tokenId);
                switch (actionType) {
                    case "ADD":
                        if (state.Davout.ConditionFW.ConditionLookup[conditionName] === undefined) {
                            sendChat("API", "/w gm " + conditionName + " is not a valid condition");
                        } else {
                            tokenConditions.addCondition(state.Davout.ConditionFW.ConditionLookup[conditionName]);
                        }
                        break;
                    case "DEL":
                        if (state.Davout.ConditionFW.ConditionLookup[conditionName] === undefined) {
                            sendChat("API", "/w gm " + conditionName + " is not a valid condition");
                        } else {
                            tokenConditions.removeCondition(state.Davout.ConditionFW.ConditionLookup[conditionName]);
                        }
                        break;
                    case "SHOW":
                        sendChat("API", "/w gm " + tokenObjR20.get("name") + " has the following conditions:<br>" + tokenConditions.listAllConditions());
                        break;
                }
            }
        }
    });
};

// Conditions

