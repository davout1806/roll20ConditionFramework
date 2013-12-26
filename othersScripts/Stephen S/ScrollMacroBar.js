var macroScroll = macroScroll || {};


on("chat:message", function(msg) {
    if(msg.type == "api"){
        if(msg.content.indexOf(' ') == -1){
            var msgMessage = null;
            var msgApiCommand = msg.content.substr(1, msg.content.length);
        }else{
            var msgMessage = msg.content.substr(msg.content.indexOf(' ') + 1);
            var msgApiCommand = msg.content.substr(1, msg.content.indexOf(' ')-1);
        };
        macroScroll.Playerid = msg.playerid;


        if(msgApiCommand == "macroids"){
            macroScroll.utilityScroll = "API_Utility_Scrolling_Macro_Bar";
            macroids();
        };


        if(msgApiCommand == "macroleftone"){
            macroleft(1);
            macroupdate();
        };
        if(msgApiCommand == "macrorightone"){
            macroright(1);
            macroupdate();
        };
        if(msgApiCommand == "macroleftmany"){
            macroleft(3);
            macroupdate();
        };
        if(msgApiCommand == "macrorightmany"){
            macroright(3);
            macroupdate();
        };
    };
});


macroids = function(msg) {
    var findPlayers = findObjs({_type: "player",});
    var findMacros = findObjs({_type: "macro",});
    var playerCode = "<code>"
    playerCode = playerCode + "Refresh using \"!macroids\""
    playerCode = playerCode + "</code><br><br>"
    _.each(findMacros, function(loopMacros) {
        if(loopMacros.get("action").length == 0){
            var createrid = loopMacros.get("_playerid")
            var createrR20id = "Unknown";
            var createrDname = "Unknown";
            _.each(findPlayers, function(loopPlayer) {
                if(loopPlayer.get("_id") == createrid){
                    createrDname = loopPlayer.get("_displayname");
                    createrR20id = loopPlayer.get("_id");
                }
            });
            playerCode = playerCode + "<code>"
            playerCode = playerCode + loopMacros.get("name") + " _id = " + loopMacros.get("_id") + "<br>";
            playerCode = playerCode + createrDname + " _id = " + createrR20id + "<br>";
            playerCode = playerCode + "</code></br><br>"
        };
    });
    if(findObjs({ _type: "handout", name: macroScroll.utilityScroll }).length == 0){
        createObj("handout", {
            name: macroScroll.utilityScroll,
        });
    };
    APIPlayerCode = findObjs({ _type: "handout", name: macroScroll.utilityScroll })
    APIPlayerCode[0].set("notes", playerCode);
};

macroleft = function(repeat) {
    var characterid = undefined;
    var findCharacter = findObjs({_type: "character", name: macroScroll.Playerid});
    var characterid = findCharacter[0].get("_id");
    if(characterid !== undefined){
        var findAbility = findObjs({_type: "ability", _characterid: characterid});
        var nameArray = [];
        var actnArray = [];
        for (var abilityCount = 0;abilityCount<findAbility.length;abilityCount++){
            nameArray[abilityCount] = findAbility[abilityCount].get("name");
            actnArray[abilityCount] = findAbility[abilityCount].get("name");
        };
        var i = 0;
        while (i < repeat) {
            nameArray.push(nameArray.shift());
            actnArray.push(actnArray.shift());
            i++;
        };
        for (var abilityCount = 0;abilityCount<findAbility.length;abilityCount++){
            findAbility[abilityCount].set({name: nameArray[abilityCount]});
            findAbility[abilityCount].set({name: actnArray[abilityCount]});
        };
    };
};


macroright = function(repeat) {
    var characterid = undefined;
    var findCharacter = findObjs({_type: "character", name: macroScroll.Playerid});
    var characterid = findCharacter[0].get("_id");
    if(characterid !== undefined){
        var findAbility = findObjs({_type: "ability", _characterid: characterid});
        var nameArray = [];
        var actnArray = [];
        for (var abilityCount = 0;abilityCount<findAbility.length;abilityCount++){
            nameArray[abilityCount] = findAbility[abilityCount].get("name");
            actnArray[abilityCount] = findAbility[abilityCount].get("name");
        };
        nameArray.reverse()
        actnArray.reverse()
        var i = 0;
        while (i < repeat) {
            nameArray.push(nameArray.shift());
            actnArray.push(actnArray.shift());
            i++;
        };
        nameArray.reverse()
        actnArray.reverse()
        for (var abilityCount = 0;abilityCount<findAbility.length;abilityCount++){
            findAbility[abilityCount].set({name: nameArray[abilityCount]});
            findAbility[abilityCount].set({name: actnArray[abilityCount]});
        };
    };
};


macroupdate = function() {
    var characterid = undefined;
    var findCharacter = findObjs({_type: "character",name: macroScroll.Playerid});
    var characterid = findCharacter[0].get("_id");
    var findAbility = findObjs({_type: "ability", _characterid: characterid});
    if(characterid !== undefined){
        var findAttribute = findObjs({_type: "attribute", _characterid: characterid});
        var buttonidArray = [];
        for (var attributeCount = 0;attributeCount<findAttribute.length;attributeCount++){
            buttonidArray[attributeCount] = findAttribute[attributeCount].get("current");
        };
    };
    for (var buttonCount = 0;buttonCount<buttonidArray.length;buttonCount++){
        findObjs({_type: "macro", _id: buttonidArray[buttonCount]})[0].set({name: findAbility[buttonCount].get("name")});
        findObjs({_type: "macro", _id: buttonidArray[buttonCount]})[0].set({action: findAbility[buttonCount].get("action")});
    };
};

// ScrollMacroBar


