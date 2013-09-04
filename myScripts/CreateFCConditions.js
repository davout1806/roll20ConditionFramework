/**
 * Created with IntelliJ IDEA.
 * User: Mike
 * Date: 9/2/13
 * Time: 3:35 AM
 * To change this template use File | Settings | File Templates.
 */

on("ready", function() {
    state.davoutFcConditions = state.davoutFcConditions || [];

    state.davoutFcConditions["fatiguedI"] = {effects: [{attrib: "str", modifier: -2}, {attrib: "dex", modifier: -2}, {attrib: "speed", modifier: -5}] };
    state.davoutFcConditions["fatiguedII"] = {effects: [{attrib: "str", modifier: -4}, {attrib: "dex", modifier: -4}, {attrib: "speed", modifier: -10}] };

});

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!fat") !== -1){
        if (msg.selected == undefined){
            sendChat("API", "nothing is selected");
            return;
        }

        _.each(msg.selected, function(obj){
            token = getObj("graphic", obj._id);
            if (token.get("represents") !== "") {
                state["davoutFcConditions_" + token.get("represents")] = "fatiguedI";
            }

        });

        log("char state= " + state["davoutFcConditions_" + token.get("represents")]);
        var conditionEffects = state.davoutFcConditions["fatiguedI"].effects;
        _.each(conditionEffects, function(obj){
            log("fat I condition= " + obj.attrib + " modified by " + obj.modifier);
        });
    }
});

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!cur") !== -1 ){
        _.each(msg.selected, function(obj){
            token = getObj("graphic", obj._id);
            if (token.get("represents") !== "") {
                var strAttribute = findObjs({_type: "attribute", name: "str", _characterid: token.get("represents")})[0];
                log("strAttribute = " + strAttribute.get("current"));
            }

        });

    }
});
