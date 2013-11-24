/**
 *
 * A key design goal: Conditions are associated to individual tokens not characters. This allows the use of multiple tokens to be associated to a single character while each token can have different conditions. But each token needs to be associated a character.

 A Condition contains a list of Effects. An Effect can be associated to either an attribute, an action or a reaction to an action (such as "vs melee attack")

 Each Effect has the following (all of which are configurable):

 a flag that determines whether the effect will prohibit the associated action
 optional modifier
 optional note string

 An Action is something the token is trying to do that requires a successful roll to succeed. This could be an attack or skill check. An Action has the following (all of which are configurable):

 name of attribute (as in D&D attribute ex: Strength) from the character that is associated to the action. For example, Melee Attack action could be STR
 name of attribute (as in a character's rank in a skill) from the character that is associated to the action. For example, Sneak action could be Sneak_Skill
 flag if APC effects action
 name of APC attribute

 Additional Features:

 GM can add/remove condition on all selected tokens. [done]
 Ability to configure what Effects are associated with a given Condition. [done]
 Ability to set timer on a specific condition on a specific token.
 Ability to stack multiple occurrences of a Condition on the same token up to a configurable number. [done]
 Ability to set a condition to be automatically added to token when a specific Condition has reached it max stack size. [done]
 Apply optional Effect modifier to result. [done]
 If Effect is associated to an attribute, it will be applied to that attribute of the character, which then affects the result. [done]
 Code to define the conditions and their effects is separate from code that tracks and actually applies effects. [done]
 Ability to select 1 or more targets of an action.
 Compute roll result for each target.

 Required design specifications:
 1. Allow multiple tokens to use the same character.
 2. Allow conditions to be assigned individually to tokens even if they share the same character.

 Desired design specifications:
 1. Quickly perform action of a token, preferably without having to open character sheet (ALT+double click)

 * state.Davout.TokensWithConditionObj[id] where id is token id
 *
 * Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 * Therefore, must apply effects on rolls.
 *
 */

Davout = (Davout || {});
Davout.ConditionFW = Davout.ConditionFW || {};

state.Davout = state.Davout || {};
state.Davout.ConditionFW = state.Davout.ConditionFW || {};
state.Davout.ConditionFW.ConditionLookup = state.Davout.ConditionFW.ConditionLookup || {};

/******************************************************************************************
 Class Declarations
 *******************************************************************************************/

/**
 * Constructor for Condition object
 * @param name                      Name of Condition
 * @param effects                   Array of Effects
 * @param [maxStackSize]
 * @param [nextConditionName]
 * @constructor
 */
Davout.ConditionFW.Condition = function Condition (name, effects, maxStackSize, nextConditionName) {
    "use strict";
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition", arguments, [_.isString, _.isArray, [_.isNumber, _.isUndefined], [_.isString, _.isUndefined]]);
//    if (!(this instanceof Davout.ConditionFW.Condition)) {return new Davout.ConditionFW.Condition(name, effects, maxStackSize, nextConditionName)} // Ensure this acts as a constructor rather than a function
    this.coName = name;
    if (maxStackSize == undefined) {
        this.coMaxStackSize = 1;
    } else {
        this.coMaxStackSize = maxStackSize;
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

Davout.ConditionFW.Condition.prototype.getEffectsAffectingAction = function (actionName) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition.prototype.getEffectsAffectingAction", arguments, [_.isString]);
    return this.affects(actionName, false);
};

Davout.ConditionFW.Condition.prototype.getEffectsAffectingActorsAttr = function (actionName) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition.prototype.getEffectsAffectingActorsAttr", arguments, [_.isString]);
    return this.affects(actionName, true);
};

Davout.ConditionFW.Condition.prototype.affects = function (nameOfAffected, isAffectingAttribute) {
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition.prototype.affects", arguments, [_.isString, _.isBoolean, _.isString]);
    var affectList = [];
    var effects = [];
    var prohibited = false;
    if (this.coEffects[nameOfAffected] !== undefined) {
        effects = effects.concat(this.coEffects[nameOfAffected]);
    }
    var conditionName = this.coName;

    _.each(effects, function (effect) {
        var affect = effect.getSingleEffectsAffect(conditionName, isAffectingAttribute);
        if (effect.efIsProhibited) {
            prohibited = true;
        }
        affectList.push(affect);
    });

    return {isProhibited: prohibited, affects: affectList};
};

/**
 * Constructor for Effect object
 * @param nameOfAffected    The given action or attribute that this effect affects.
 * @param isAttribute
 * @param isProhibited   Whether or not this effect prevents the given action from being performed.
 * @param modifier      Modifier this effects applies to the given action or attribute
 * @param [note]         Any note related to how this effect affects the given action or attribute.
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

Davout.ConditionFW.Effect.prototype.getSingleEffectsAffect = function (conditionName, isAffectingAttribute){
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isString, _.isBoolean]);
    if(this.efIsAttribute !== isAffectingAttribute){
        var msg ="not to be an Attribute";
        if (this.efIsAttribute){
            msg = "to be an Attribute"
        }
        throw "Davout.ConditionFW.Effect.prototype.getSingleEffectsAffect Expecting affected " + msg;
    }
    return new Davout.ConditionFW.SingleEffectsAffect(conditionName, this.efIsProhibited, this.efModifier, this.efNote);
};

/******************************************************************************************
 Function Declarations
 *******************************************************************************************/
Davout.ConditionFW.getTokenInstance = function (tokenId) {
    "use strict";
    if (!_.isString(tokenId)) throw "Davout.ConditionFW.getTokenInstance tokenId invalid parameter type";
    if (state.Davout.ConditionFW.TokensWithConditionObj == undefined) {
        state.Davout.ConditionFW.TokensWithConditionObj = {};
    }

    if (state.Davout.ConditionFW.TokensWithConditionObj[tokenId] == undefined) {
        var conditionedToken = new Davout.ConditionFW.ConditionedToken(tokenId);
        state.Davout.ConditionFW.TokensWithConditionObj[tokenId] = conditionedToken;
    }

    return state.Davout.ConditionFW.TokensWithConditionObj[tokenId];
};

// Conditions

