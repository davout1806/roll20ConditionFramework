/**
 * Created with IntelliJ IDEA.
 * User: Mike
 * Date: 9/2/13
 * Time: 3:35 AM
 * To change this template use File | Settings | File Templates.
 */

var DavoutConditions = DavoutConditions || {};

on("ready", function() {
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
