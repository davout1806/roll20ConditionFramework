A key design goal: Conditions are associated to individual tokens not characters.
This allows the use of multiple tokens to be associated to a single character while
each token can have different conditions. But each token needs to be associated a character.

This framework is designed to work with Games whose action resolution is:
die roll + some base value for action (skill or attack) + some modifier value based on something (such as an attribute score) that is related to action.
Example from D&D: Action is Search(Int): d20 + ranks in Search + modifier from Int.
For every action there MUST be a roll20 attribute on the roll20 character sheet for the action and for the action's
associated attribute. In above example that would be Search and Int. The actual names for these are customizable but
they must exist.
How this framework would work with other games is undetermined.

A Condition contains a list of Effects. An Effect can be associated to either an attribute,
an action or a reaction to an action (such as "vs melee attack").

Each Effect has the following (all of which are configurable):
* a flag that determines whether the effect will prohibit the associated action
* optional modifier
* optional note string

An Action is something the token is trying to do that requires a successful roll to succeed.
This could be an attack or skill check. An Action has the following (all of which are configurable):
* name of roll20 attribute for character attribute (as in D&D attribute ex: Strength)
from the character that is associated to the action.
For example, Melee Attack action could be STR
* name of roll20 attribute for character ability (as in a character's rank in a skill)
from the character that is associated to the action.
For example, Sneak action could be Sneak_Skill
* flag if APC effects action
* name of APC attribute

Additional Features:
* GM can add/remove condition on all selected tokens. [done]
* Ability to configure what Effects are associated with a given Condition. [done]
* Ability to set timer on a specific condition on a specific token.
* Ability to stack multiple occurrences of a Condition on the same token up to a configurable number. [done]
* Ability to set a condition to be automatically added to token when a specific Condition has reached it max stack size. [done]
* Apply optional Effect modifier to result. [done]
* If Effect is associated to an attribute, it will be applied to that attribute of the character, which then affects the result. [done]
* Code to define the conditions and their effects is separate from code that tracks and actually applies effects. [done]
* Ability to select a targets of an action. [done]

Currently the dice rolled is a single d20 but this can be customized by changing Davout.ConditionFW.actions.rollDie()

Required design specifications:
1. Allow multiple tokens to use the same character.
2. Allow conditions to be assigned individually to tokens even if they share the same character.

Desired design specifications:
1. Quickly perform action of a token, preferably without having to open character sheet (ALT+double click)

==========================================================================================================================
* state.Davout.TokensWithConditionObj[id] where id is token id
*
* Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
* Therefore, must apply effects on rolls.

// TODO Non-modifier conditions
// TODO Scene conditions: conditions that exist throughout the area of the current scene.
// TODO locational conditions
// TODO remove condition based on timer.
// TODO add/remove status markers.
// TODO equipment effectsOnToken.
// TODO update javascript docs
// TODO add condition as gm viewable only
// TODO DC of targets

/**
* Order of files:
* ChatCommandHandler.js
* Utils.js
* Roll20Utils.js
* EffectOnToken.js
* ConditionedToken.js
* Conditions.js
* Actions.js
* Actions<game>.js
* DcCalculator.js
* DcCalculator<game>.js
* Conditions<game>.js
* Target.js
* FrameworkCommands.js
* Events.js
*
*/
