/**
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

// TODO Non-modifier conditions
// TODO Scene conditions: conditions that exist throughout the area of the current scene.
// TODO locational conditions
// TODO action where character vs character ex: attack where each may have a condition.
// TODO remove condition based on timer.
// TODO add/remove status markers.
// TODO equipment affects.
// TODO update javascript docs

var Davout = Davout || {};
Davout.ConditionObj = Davout.ConditionObj || {};
Davout.ConditionObj.command = Davout.ConditionObj.command || {};
Davout.TokenFactory = Davout.TokenFactory || {};

state.Davout = state.Davout || {};
state.Davout.ConditionObj = state.Davout.ConditionObj || {};
state.Davout.TokensWithConditionObj = state.Davout.TokensWithConditionObj || {};

/******************************************************************************************
 Class Declarations
 *******************************************************************************************/

Davout.ConditionObj.TotalAffectable = function (affectableName) {
    "use strict";
    this.affectableName = affectableName;
    this.condModTotal = 0;
    this.isProhibited = false;
    this.modList = [];
    this.notes = [];
};

Davout.ConditionObj.TotalAffectable.prototype.add = function (condition) {
    "use strict";
    var conditionName = condition.name;
    var affects = condition.getAffects(this.affectableName);

    if (affects !== undefined) {
        for (var i = 0; i < affects.length; i++) {
            var effect = affects[i];
            if (effect.prohibitive) {
                this.isProhibited = true;
            } else {
                if (effect.hasModifier) {
                    this.condModTotal += effect.modifier;
                    this.modList.push({name: Davout.Utils.capitaliseFirstLetter(conditionName), value: effect.modifier});
                }
            }

            if (effect.notes != undefined && "" !== effect.notes) {
                this.notes.push(Davout.Utils.capitaliseFirstLetter(conditionName) + ", " + effect.notes);
            }
        }
    }
};

Davout.ConditionObj.TotalAffectable.prototype.buildModListString = function () {
    "use strict";
    var modListString = "";
    for (var i = 0; i < this.modList.length; i++) {
        modListString += this.modList[i].name + ": " + this.modList[i].value + "<br>";
    }

    return modListString;
};

Davout.ConditionObj.TotalAffectable.prototype.buildNotesString = function () {
    "use strict";
    var notesString = "";

    for (var i = 0; i < this.notes.length; i++) {
        notesString += this.notes[i] + "<br>";
    }

    return notesString;
};

Davout.Character = function (charId) {
    "use strict";
    this.charId = charId;
};

Davout.Character.prototype.getAttribCurrentFor = function (attributeName) {
    "use strict";
    var attributeSheetObj = findObjs({ _type: 'attribute', name: attributeName, _characterid: this.charId })[0]
    return attributeSheetObj.get("current");
};

/**
 * Constructor for TokenWithConditions object, which represents the conditions on the associated roll20 token.
 * @param tokenName     name of token
 * @constructor
 */
Davout.ConditionObj.TokenWithConditions = function (tokenId) {
    "use strict";
    if (!_.isString(tokenId)) throw "Davout.ConditionObj.TokenWithConditions tokenId invalid parameter type";
    this.tokenId = tokenId;
    this.name = getObj("graphic", this.tokenId).get("name");
    this.charId = Davout.R20Utils.tokenIdToCharId(this.tokenId);
    this.conditions = [];
};

/**
 * Add condition to this token
 * @param condition
 */
Davout.ConditionObj.TokenWithConditions.prototype.addCondition = function (condition) {
    "use strict";
    Davout.Utils.assertTrueObject(condition, "Davout.ConditionObj.TokenWithConditions.addCondition condition");
    // condition is stackable
    if (condition.maxStackSize > 1) {
        var conditionCount = _.where(this.conditions, {name: condition.name}).length;
        // if additional level of condition can be added to stack
        if (condition.maxStackSize > conditionCount) {
            this.conditions.push(condition);
            var displayCount = conditionCount + 1;
            sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.name) + ": " + displayCount + " was added to " + this.name);
            log("Added: condition " + Davout.Utils.capitaliseFirstLetter(condition.name) + ": " + displayCount + " to " + this.name);
        } else { // if max level of condition has been reached.
            // if the max level of condition causes a different condition to be applied.
            if (condition.nextConditionName != null) {
                this.conditions.push(state.Davout.ConditionObj[condition.nextConditionName]);
                sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.nextConditionName) + " was added to " + this.name);
                log("Added: condition " + Davout.Utils.capitaliseFirstLetter(condition.nextConditionName) + " to " + this.name);
            } else {
                sendChat("API", "/w gm " + this.name + " already has reached the stack limit for " + Davout.Utils.capitaliseFirstLetter(condition.name));
            }
        }
    } else {
        // if token does not already have condition
        if (!_.findWhere(this.conditions, {name: condition.name})) {
            this.conditions.push(condition);
            sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.name) + " was added to " + this.name);
            log("Added: condition " + Davout.Utils.capitaliseFirstLetter(condition.name) + " to " + this.name);
        } else {
            sendChat("API", "/w gm " + this.name + " already has the non-stackable condition " + Davout.Utils.capitaliseFirstLetter(condition.name));
        }
    }
};

/**
 * Remove condition from this token
 * @param condition
 */
Davout.ConditionObj.TokenWithConditions.prototype.removeCondition = function (condition) {
    "use strict";
    Davout.Utils.assertTrueObject(condition, "Davout.ConditionObj.TokenWithConditions.removeCondition condition");
    var index = this.conditions.indexOf(condition);
    if (index > -1) {
        this.conditions.splice(index, 1);
        sendChat("API", "/w gm Condition " + Davout.Utils.capitaliseFirstLetter(condition.name) + " was removed from " + this.name);
        log("Removed: condition " + Davout.Utils.capitaliseFirstLetter(condition.name) + " removed from " + this.name);
    } else {
        sendChat("API", "Selected Token " + Davout.Utils.capitaliseFirstLetter(condition.name) + " does not have condition: " + Davout.Utils.capitaliseFirstLetter(condition.name));
    }
};

/**
 * From all this token's conditions, add and return all modifiers from all the effects that affects a given action or attribute
 * @param affectableName    The given action or attribute
 * @returns {Davout.ConditionObj.TotalAffectable}
 */
Davout.ConditionObj.TokenWithConditions.prototype.getAffect = function (affectableName) {
    "use strict";
    if (!_.isString(affectableName)) throw "Davout.ConditionObj.TokenWithConditions.getModifierFor affectableName invalid parameter type";
    var totalAffectable = new Davout.ConditionObj.TotalAffectable(affectableName);
    if (this.conditions != undefined) {
        for (var i = 0; i < this.conditions.length; i++) {
            totalAffectable.add(this.conditions[i]);
        }
    }
    return totalAffectable;
};

Davout.ConditionObj.TokenWithConditions.prototype.getAffectAsTarget = function (affectableName) {
    "use strict";
    return this.getAffect("VS-" + affectableName);
};

/**
 * Function that return string of all conditions on the TokensWithConditionObj associated to the roll20 token with the given tokenId.
 * @returns {string}
 */
Davout.ConditionObj.TokenWithConditions.prototype.listAllConditions = function () {
    "use strict";
    var conditions = this.conditions;
    var str = "";
    for (var i = 0; i < conditions.length; i++) {
        str += Davout.Utils.capitaliseFirstLetter(conditions[i].name) + "<br>";
    }

    return str;
};

/**
 * Constructor for Condition object
 * @param name                      Name of Condition
 * @param effects                   Array of Effects
 * @param nextConditionNameIfStackable  If not null, then Condition is stackable.
 * @param isReversableByName        If true then using initial condition word in remove command will "pop" the off the nextConditionNameIfStackable of the stack.
 * @constructor
 */
Davout.ConditionObj.Condition = function (name, effects, maxStackSize, nextConditionName) {
    "use strict";
    if (!_.isString(name)) throw "Davout.ConditionObj.Condition name invalid parameter type";
    if (!_.isArray(effects)) throw "Davout.ConditionObj.Condition effects invalid parameter type";
    this.name = name;
    if (maxStackSize == undefined) {
        this.maxStackSize = 1;
    } else {
        this.maxStackSize = maxStackSize;
    }
    this.nextConditionName = nextConditionName;

    this.effects = {};
    for (var i = 0; i < effects.length; i++) {
        var affectableName = effects[i].affectable;
        if (this.effects[affectableName] == undefined) {
            this.effects[affectableName] = [];
        }
        this.effects[affectableName].push(effects[i]);
    }
};

/**
 * From this condition, get all the effects that affect a given action or attribute
 * @param affectableName    The given action or attribute
 * @returns {*}
 */
Davout.ConditionObj.Condition.prototype.getAffects = function (affectableName) {
    "use strict";
    return this.effects[affectableName];
};

/**
 * Constructor for Effect object
 * @param affectableName    The given action or attribute that this effect affects.
 * @param notes         Any notes related to how this effect affects the given action or attribute.
 * @param modifier      Modifier this effects applies to the given action or attribute
 * @param prohibitive   Whether or not this effect prevents the given action from being performed.
 * @constructor
 */
Davout.ConditionObj.Effect = function (affectableName, notes, modifier, prohibitive) {
    "use strict";
    if (!_.isString(affectableName)) throw "Davout.ConditionObj.Effect affectableName invalid parameter type";

    this.modifier = NaN;
    this.hasModifier = false;
    this.affectable = affectableName;
    this.notes = notes;
    this.prohibitive = prohibitive;

    if (!prohibitive) {
        if (modifier != null) {
            this.modifier = modifier;
            this.hasModifier = true;
        }
    }
};

/******************************************************************************************
 Function Declarations
 *******************************************************************************************/
Davout.TokenFactory.getInstance = function (tokenId) {
    "use strict";
//    if (!_.isString(tokenId)) throw "Davout.TokenFactory.getInstance tokenId invalid parameter type";
    if (state.Davout.TokensWithConditionObj == undefined) {
        state.Davout.TokensWithConditionObj = {};
    }

    if (state.Davout.TokensWithConditionObj[tokenId] == undefined) {
        state.Davout.TokensWithConditionObj[tokenId] = new Davout.ConditionObj.TokenWithConditions(tokenId);
    }

    return state.Davout.TokensWithConditionObj[tokenId];
};

/**
 * Event: When roll20 token is destroyed and an associated TokenWithConditions exists, destroy it.
 */
Davout.ConditionObj.onTokenDestroyedEvent = function () {
    "use strict";
    log("Deleted state.Davout.TokensWithConditionObj for " + token.get("name"));
    state.Davout.TokensWithConditionObj[token.get("id")] = null;
};

Davout.ConditionObj.command._manageCondition = function (actionType, selected, conditionName) {
    "use strict";
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                switch (actionType) {
                    case "ADD":
                        var tokenCondition = Davout.TokenFactory.getInstance(tokenId);
                        tokenCondition.addCondition(state.Davout.ConditionObj[conditionName]);
                        break;
                    case "DEL":
                        var tokenCondition = Davout.TokenFactory.getInstance(tokenId);
                        tokenCondition.removeCondition(state.Davout.ConditionObj[conditionName]);
                        break;
                    case "SHOW":
                        Davout.Utils.sendDirectedMsgToChat(true, tokenObjR20.get("name") + " has the following conditions:<br>" + Davout.ConditionObj.listAllConditions(tokenId));
                        break;
                }
            }
        }
    });
};

on("destroy:token", Davout.ConditionObj.onTokenDestroyedEvent);

on("ready", function () {
    "use strict";
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (Davout.Utils == undefined) {
        log("You must have Davout.Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.Utils!";
    }

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!cond_add <ConditionName><br> ConditionName cannot contain spaces.";
    addCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionObj.command._manageCondition("ADD", msg.selected, args[0].value);
        }
    };
    community.command.add("cond_add", addCommand);

    var removeCommand = {};
    removeCommand.minArgs = 1;
    removeCommand.maxArgs = 1;
    removeCommand.typeList = [];
    removeCommand.typeList = ["str"];
    removeCommand.syntax = "!cond_del <ConditionName><br> ConditionName cannot contain spaces.";
    removeCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionObj.command._manageCondition("DEL", msg.selected, args[0].value);
        }
    };
    community.command.add("cond_del", removeCommand);

    var showCommand = {};
    showCommand.minArgs = 0;
    showCommand.maxArgs = 0;
    showCommand.typeList = [];
    showCommand.typeList = ["str"];
    showCommand.syntax = "!cond_show";
    showCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Davout.ConditionObj.command._manageCondition("SHOW", msg.selected);
        }
    };
    community.command.add("cond_show", showCommand);
});

// ConditionsByToken

