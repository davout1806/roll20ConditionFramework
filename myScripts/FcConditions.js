
var DavoutConditions = DavoutConditions || {};
DavoutConditions.command = DavoutConditions.command || {};

DavoutConditions.command._add = function(){
    log("command H");

}

on("ready", function() {     // Requires community.command
    if(community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }

    var addCommand = {};
//    addCommand.minArgs = 1;
    addCommand.minArgs = 0;
    addCommand.maxArgs = 0;
//    addCommand.maxArgs = 1;
    addCommand.typeList = [];
//    addCommand.typeList = ["str"];
    addCommand.syntax = "!cond_add";
//    addCommand.syntax = "!cond_add ConditionName";
    addCommand.handle = function (args, who, isGm) {
       log("args = " + args);
       log("who = " + who);
       log("isGm = " + isGm);
       DavoutConditions.command._add();
//        DavoutConditions.command._add(args[0].value);
    };
    community.command.add("cond_add", addCommand);

    state.davoutFcConditions = state.davoutFcConditions || [];

    state.davoutFcConditions["fatiguedI"] = {effects: [{attrib: "str", modifier: -2}, {attrib: "dex", modifier: -2}, {attrib: "speed", modifier: -5}] };
    state.davoutFcConditions["fatiguedII"] = {effects: [{attrib: "str", modifier: -4}, {attrib: "dex", modifier: -4}, {attrib: "speed", modifier: -10}] };

});

DavoutConditions.getConditionsOnChar = function (charId){
    return state["davoutFcConditions_" + charId];
}

DavoutConditions.addConditionToChar = function(charId, conditionName){
    if (DavoutConditions.getConditionsOnChar(charId) == undefined){
        state["davoutFcConditions_" + charId] = [conditionName];
    } else {
        state["davoutFcConditions_" + charId].push(conditionName);
    }
}

on("chat:message", function(msg) {
    if(msg.type == "api" && DavoutUtils.isSenderGm(msg) && msg.content.indexOf("!fat") !== -1){
        if (msg.selected == undefined){
            sendChat("API", "nothing is selected");
            return;
        }

        _.each(msg.selected, function(obj){
            token = getObj("graphic", obj._id);
            log("obj._id = " + obj._id);
            var characterId = token.get("represents");
            if (characterId !== "") {
                DavoutConditions.addConditionToChar(characterId, "fatiguedI");
                var conditionEffects = state.davoutFcConditions["fatiguedI"].effects;
                _.each(conditionEffects, function(obj){
                    log("obj.attrib = " + obj.attrib);
                    DavoutUtils.adjustAttributeForChar(characterId, obj.attrib, obj.modifier);
                });
            }
        });
    }
});

on("chat:message", function(msg) {
    if(msg.type == "api" && DavoutUtils.isSenderGm(msg) && msg.content.indexOf("!cur") !== -1 ){
        var token;
        var characterId;
        _.each(msg.selected, function(obj){
            token = getObj("graphic", obj._id);
            characterId = token.get("represents");
            if (characterId !== "") {
                var strAttribute = findObjs({_type: "attribute", name: "curStr", _characterid: characterId})[0];
//                log("strAttribute = " + strAttribute.get("current"));
            }
        });
    }
});
