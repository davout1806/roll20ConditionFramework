/**
 state.davoutFcTokenConds[id] where id is token id

 Since tokens might be associated to 0, 1, or more characters, it is not possible to adjust the ratings.
 Therefore, must apply effects on rolls.
 */
var DavoutConditions = DavoutConditions || {};
DavoutConditions.command = DavoutConditions.command || {};

state.davoutFcConditions = state.davoutFcConditions || [];
state.davoutFcTokenConds = state.davoutFcTokenConds || [];
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

DavoutConditions.test = function (){
    sendChat("API", "/w gm EXECUTED");
};

DavoutConditions.getConditionsOnToken = function (tokenId) {
    if (state["davoutFcTokenConds"][tokenId] == undefined){
        return "";
    } else {
    return state["davoutFcTokenConds"][tokenId];
    }
};

DavoutConditions.addConditionToToken = function (tokenId, conditionName) {
    log("conditionName = " + conditionName);
    if (state["davoutFcTokenConds"] == undefined) {
        state["davoutFcTokenConds"] = [];
    }
    if (state["davoutFcTokenConds"][tokenId] == undefined) {
        state["davoutFcTokenConds"][tokenId] = [];
    }

    if (state["davoutFcTokenConds"][tokenId].indexOf(conditionName) > -1) {
        return false;
    } else {
        state["davoutFcTokenConds"][tokenId].push(conditionName);
        log("ADD poststate = " + state["davoutFcTokenConds"][tokenId]);
        return true;
    }
};

DavoutConditions.removeConditionFromToken = function (name, tokenId, conditionName) {
    log("DEL prestate = " + conditionName + " " + state["davoutFcTokenConds"][tokenId]);
    if (state["davoutFcTokenConds"][tokenId] != undefined && state["davoutFcTokenConds"][tokenId].indexOf(conditionName) > -1) {
        state["davoutFcTokenConds"][tokenId] = DavoutUtils.removeFromArrayFirstOccurOf(state["davoutFcTokenConds"][tokenId], conditionName);
        log("Delete poststate = " + state["davoutFcTokenConds"][tokenId]);
        return true;
    } else {
        sendChat("API", "Selected Token " + name + " does not have condition: " + conditionName);
        return false;
    }
};

DavoutConditions.addEffects = function addEffects(tokenId, condition, tokenName) {
    if (DavoutConditions.addConditionToToken(tokenId, condition)) {
        sendChat("API", "/w gm Condition " + condition + " was added to " + tokenName);
    }
};

DavoutConditions.removeEffects = function removeEffects(tokenId, condition, tokenName) {
    if (DavoutConditions.removeConditionFromToken(tokenName, tokenId, condition)) {
        sendChat("API", "/w gm Condition " + condition + " was removed from " + tokenName);
    }
};

DavoutConditions.command._manageCondition = function (actionType, selected, condition) {
    var tokenObjR20;
    var tokenId;

    _.each(selected, function (obj) {
        tokenObjR20 = getObj("graphic", obj._id);
        if (tokenObjR20.get("_subtype") == "token") {
            tokenId = tokenObjR20.get("id");
            if (tokenId != "") {
                switch (actionType) {
                    case "ADD":
                        DavoutConditions.addEffects(tokenId, condition, tokenObjR20.get("name"));
                        break;
                    case "DEL":
                        DavoutConditions.removeEffects(tokenId, condition, tokenObjR20.get("name"));
                        break;
                    case "SHOW":
                        sendChat("API", "/w gm " + tokenObjR20.get("name") + " has the following conditions " + DavoutConditions.getConditionsOnToken(tokenId));
                        break;
                }
            }
        }
    });
};

on("destroy:token", function (token) {
    log("Deleted state.davoutFcTokenConds for " + token.get("name"));
    state.davoutFcTokenConds[token] = null;
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
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected") && isGm) {
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
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected") && isGm) {
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
        if (DavoutUtils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected") && isGm) {
            DavoutConditions.command._manageCondition("SHOW", msg.selected);
        }
    };
    community.command.add("cond_show", showCommand);
});

// FcConditions

