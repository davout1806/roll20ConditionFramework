/**
 In order for each token to have individual conditions, each token requires its own character.
 state.davoutFcTokenConds[id] where id is character id

 Alternative is to not adjust the ratings but only apply effects on rolls.
 */
var DavoutConditions = DavoutConditions || {};
DavoutConditions.command = DavoutConditions.command || {};

state.davoutFcConditions = state.davoutFcConditions || [];
state.davoutFcCharConds = state.davoutFcCharConds || [];
state.davoutFcConditions.graded = state.davoutFcConditions.graded || [];

state.davoutFcConditions.graded["fatigued"] = ["fatiguedI", "fatiguedII", "fatiguedIII", "fatiguedIV", "unconscious"];

state.davoutFcConditions["fatiguedI"] = {effects: [
    {attrib: "str", modifier: -2},
    {attrib: "dex", modifier: -2},
    {attrib: "speed", modifier: -5}
] };
state.davoutFcConditions["fatiguedII"] = {effects: [
    {attrib: "str", modifier: -2},
    {attrib: "dex", modifier: -2},
    {attrib: "speed", modifier: -5}
] };
state.davoutFcConditions["fatiguedIII"] = {effects: [
    {attrib: "str", modifier: -2},
    {attrib: "dex", modifier: -2},
    {attrib: "speed", modifier: -5}
] };
state.davoutFcConditions["fatiguedIV"] = {effects: [
    {attrib: "str", modifier: -2},
    {attrib: "dex", modifier: -2},
    {attrib: "speed", modifier: -5}
] };
state.davoutFcConditions["deafened"] = {effects: [
    {attrib: "str", modifier: -2},
    {attrib: "dex", modifier: -2},
    {attrib: "speed", modifier: -5}
]};

DavoutConditions.getConditionsOnChar = function (charId) {
    return state["davoutFcCharConds"][charId];
};

DavoutConditions.addConditionToChar = function (charId, conditionName) {
    log("conditionName = " + conditionName);
    if (state["davoutFcCharConds"] == undefined){
        state["davoutFcCharConds"] = [];
    }
    if (state["davoutFcCharConds"][charId] == undefined){
        state["davoutFcCharConds"][charId] = [];
    }

    if (state["davoutFcCharConds"][charId].indexOf(conditionName) > -1 ) {
        return false;
    } else {
        state["davoutFcCharConds"][charId].push(conditionName);
        log("ADD poststate = " + state["davoutFcCharConds"][charId]);
        return true;
    }
};

DavoutConditions.removeConditionFromChar = function (name, charId, conditionName) {
    log("DEL prestate = " + conditionName + " " + state["davoutFcCharConds"][charId]);
    if (state["davoutFcCharConds"][charId].indexOf(conditionName) > -1 ) {
        state["davoutFcCharConds"][charId] = DavoutUtils.removeFromArrayFirstOccurOf(state["davoutFcCharConds"][charId],conditionName);
        log("Delete poststate = " + state["davoutFcCharConds"][charId]);
        return true;
    } else {
        sendChat("API", "Selected Token " + name + " does not have condition: " + conditionName);
        return false;
    }
};

DavoutConditions.addEffects = function addEffects(characterId, condition, tokenObjR20) {
    if (DavoutConditions.addConditionToChar(characterId, condition)) {
        // For each effect of added condition
        _.each(state.davoutFcConditions[condition].effects, function (obj) {
            DavoutUtils.adjustAttributeForChar(characterId, obj.attrib, obj.modifier);
        });
        sendChat("API", "/w gm Condition " + condition + " was added to " + tokenObjR20.get("name"));
    }
};

DavoutConditions.removeEffects = function removeEffects(characterId, condition, tokenObjR20) {
    if (DavoutConditions.removeConditionFromChar(tokenObjR20.get("name"), characterId, condition)) {
        // For each effect of removed condition
        _.each(state.davoutFcConditions[condition].effects, function (obj) {
            DavoutUtils.adjustAttributeForChar(characterId, obj.attrib, -1 * obj.modifier);
        });
        sendChat("API", "/w gm Condition " + condition + " was removed from " + tokenObjR20.get("name"));
    }
};

DavoutConditions.command._manageCondition = function (actionType, selected, condition) {
    var tokenObjR20;
    var characterId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        characterId = tokenObjR20.get("represents");
        if (characterId !== "") {
            switch (actionType){
                case "ADD":
                    DavoutConditions.addEffects(characterId, condition, tokenObjR20);
                    break;
                case "DEL":
                    DavoutConditions.removeEffects(characterId, condition, tokenObjR20);
                    break;
                case "SHOW":
                    log("Conditions = " + DavoutConditions.getConditionsOnChar(characterId) );
                    break;
            }
        }
    });
};

on("destroy:character", function (character) {
        log("Deleted state.davoutFcCharConds for " + character.get("name")) ;
        state.davoutFcCharConds[character] = null;
});

on('chat:message', function(msg) {

});

on("ready", function () {     // Requires community.command
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (DavoutUtils == undefined) {
        log("You must have DavoutUtils installed in a script tab before the tab this script is in to use.");
        throw "Can't find DavoutUtils!";
    }

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!cond_add ConditionName";
    addCommand.handle = function (args, who, isGm, msg) {
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected") && isGm){
            DavoutConditions.command._manageCondition("ADD", msg.selected, args[0].value);
        }
    };
    community.command.add("cond_add", addCommand);

    var removeCommand = {};
    removeCommand.minArgs = 1;
    removeCommand.maxArgs = 1;
    removeCommand.typeList = [];
    removeCommand.typeList = ["str"];
    removeCommand.syntax = "!cond_del ConditionName";
    removeCommand.handle = function (args, who, isGm, msg) {
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected") && isGm){
            DavoutConditions.command._manageCondition("DEL", msg.selected, args[0].value);
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
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected") && isGm){
            DavoutConditions.command._manageCondition("SHOW", msg.selected);
        }
    };
    community.command.add("cond_show", showCommand);
});

// FcConditions

