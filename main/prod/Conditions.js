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
    if (!(this instanceof Davout.ConditionFW.Condition)) {return new Davout.ConditionFW.Condition(name, effects, maxStackSize, nextConditionName)} // Ensure this acts as a constructor rather than a function
    Davout.Utils.argTypeCheck("Davout.ConditionFW.Condition", arguments, [_.isString, _.isArray, [_.isNumber, _.isUndefined], [_.isString, _.isUndefined]]);
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
        var affect = effect.getAffect(conditionName, isAffectingAttribute);
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
    if (!(this instanceof Davout.ConditionFW.Effect)) {return new Davout.ConditionFW.Effect(nameOfAffected, isAttribute, isProhibited, modifier, note)}
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

Davout.ConditionFW.Effect.prototype.getAffect = function (conditionName, isAffectingAttribute){
    Davout.Utils.argTypeCheck("Davout.ConditionFW.SingleEffectsAffect", arguments, [_.isString, _.isBoolean]);
    if(this.efIsAttribute !== isAffectingAttribute){
        var msg ="not to an Attribute";
        if (this.efIsAttribute){
            msg = "to be an Attribute"
        }
        throw "Davout.ConditionFW.Effect.prototype.getAffect Expecting affected " + msg;
    }
    return new Davout.ConditionFW.SingleEffectsAffect(Davout.Utils.capitaliseFirstLetter(conditionName), this.efIsProhibited, this.efModifier, this.efNote);
};

/******************************************************************************************
 Function Declarations
 *******************************************************************************************/
Davout.ConditionFW.getTokenInstance = function (tokenId) {
    "use strict";
    if (!_.isString(tokenId)) throw "Davout.ConditionFW.getTokenInstance twcTokenId invalid parameter type";
    if (state.Davout.ConditionFW.TokensWithConditionObj == undefined) {
        state.Davout.ConditionFW.TokensWithConditionObj = {};
    }

    if (state.Davout.ConditionFW.TokensWithConditionObj[tokenId] == undefined) {
        state.Davout.ConditionFW.TokensWithConditionObj[tokenId] = new Davout.ConditionFW.ConditionedToken(tokenId);
    }

    return state.Davout.ConditionFW.TokensWithConditionObj[tokenId];
};