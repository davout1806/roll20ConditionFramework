var DavoutConditions = DavoutConditions || {};
DavoutConditions.command = DavoutConditions.command || {};

DavoutConditions.getConditionsOnChar = function (charId) {
    return state["davoutFcConditions_" + charId];
};

DavoutConditions.addConditionToChar = function (charId, conditionName) {
    log("ADD prestate = " + conditionName + " " + JSON.stringify(state["davoutFcConditions_" + charId]));
    if (conditionName in state["davoutFcConditions_" + charId]) {
        return false;
    } else {
        state["davoutFcConditions_" + charId][conditionName] = true;
        log("ADDED");
        return true;
    }
};

DavoutConditions.removeConditionToChar = function (name, charId, conditionName) {
    log("Delete prestate = " + conditionName + " " + JSON.stringify(state["davoutFcConditions_" + charId]));
    if (conditionName in state["davoutFcConditions_" + charId]) {
        delete state["davoutFcConditions_" + charId][conditionName];
        log("REMOVED");
        return true;
    } else {
        sendChat("API", "Selected Token " + name + " does not have condition: " + conditionName);
        return false;
    }
};

DavoutConditions.command._add = function (selected, condition) {
    var tokenObjR20;
    var characterId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        characterId = tokenObjR20.get("represents");
        if (characterId !== "") {
            if (state.davoutFcConditions.graded["condition"] == undefined) {
                if (DavoutConditions.addConditionToChar(characterId, condition)) {
                    _.each(state.davoutFcConditions[condition].effects, function (obj) {
                        DavoutUtils.adjustAttributeForChar(characterId, obj.attrib, obj.modifier);
                        sendChat("API", "/w gm Condition " + condition + " was added to " + tokenObjR20.get("name"));
                    });
                }
            } else {

            }
        }
    });
};

DavoutConditions.command._del = function (selected, condition) {
    var tokenObjR20;
    var characterId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        characterId = tokenObjR20.get("represents");
        if (characterId !== "") {
            if (DavoutConditions.removeConditionToChar(tokenObjR20.get("name"), characterId, condition)) {
                _.each(state.davoutFcConditions[condition].effects, function (obj) {
                    DavoutUtils.adjustAttributeForChar(characterId, obj.attrib, -1 * obj.modifier);
                    sendChat("API", "/w gm Condition " + condition + " was removed from " + tokenObjR20.get("name"));
                });
            }
        }
    });
};

on("ready", function () {     // Requires community.command
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (DavoutUtils == undefined) {
        log("You must have DavoutUtils installed in a script tab before the tab this script is in to use.");
        throw "Can't find DavoutUtils!";
    }

    state.davoutFcConditions = state.davoutFcConditions || [];
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

    ]};

    var addCommand = {};
    addCommand.minArgs = 1;
    addCommand.maxArgs = 1;
    addCommand.typeList = [];
    addCommand.typeList = ["str"];
    addCommand.syntax = "!cond_add ConditionName";
    addCommand.handle = function (args, who, isGm, msg) {
        if (DavoutUtils.checkForSelectionAndSendIfNothing(msg.selected, "/w gm nothing is selected") && isGm){
            DavoutConditions.command._add(msg.selected, args[0].value);
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
        if (DavoutUtils.checkForSelectionAndSendIfNothing(msg.selected, "/w gm nothing is selected") && isGm){
            DavoutConditions.command._del(msg.selected, args[0].value);
        }
    };
    community.command.add("cond_del", removeCommand);
});
