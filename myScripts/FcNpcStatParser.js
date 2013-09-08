var DavoutNpcStatParser = DavoutNpcStatParser || {};
DavoutNpcStatParser.command = DavoutNpcStatParser.command || {};

DavoutNpcStatParser.parseIntoCharStats = function (text) {
    var charStats = {};

    text = unescape(text);
    text = text.replace("<strong>", "");
    text = text.replace("</strong>", "");
    var lines = text.split("<br>");  // \n in GM Notes after unescape.

    charStats.name = DavoutNpcStatParser.findName(lines[0]);
//    log("name = " + charStats.name);
    charStats.attribs = DavoutNpcStatParser.findAttributes(lines[1]);

    return charStats;
};

DavoutNpcStatParser.findName = function(line){
    var words = line.split(" ");
    var nameWordStart;

    for (var i=0; i < words.length && nameWordStart == undefined; i++){
        if (words[i].indexOf(")") == -1){
//            log("1. words[i] = " + words[i]);
            nameWordStart = i;
        }
    }
//    log("nameWordStart = " + nameWordStart);

    var wordAfterName
    var i = nameWordStart;
    for (; i < words.length && wordAfterName == undefined; i++){
        if (words[i].indexOf("(") != -1){
//            log("2. words[i] = " + words[i]);
            wordAfterName = i;
        }
    }
//    log("wordAfterName = " + wordAfterName);
    if (wordAfterName === null){
        wordAfterName = nameWordStart + 1;
    }
//    log("wordAfterName = " + wordAfterName);

    var name = "";
    for (var i = nameWordStart; i < wordAfterName; i++){
        name += words[i] + " ";
    }

    return name.trim();
};

DavoutNpcStatParser.findAttributes = function (line) {
//    log("JSON.stringify(line) = " + JSON.stringify(line));
    var attribs = {};
    var attribPair = line.split(";");
    log("JSON.stringify(attribPair) = " + JSON.stringify(attribPair));
    for(var i=0; i < 6; i++){
        var splitPair = attribPair[i].split(": ");
        log("JSON.stringify(splitPair) = " + JSON.stringify(splitPair));
        var splitValue = splitPair[1].split("/");
        attribs[splitPair[0]] = splitValue[1];
        log("JSON.stringify(splitValue[1]) = " + JSON.stringify(splitValue[1]));
    }
    log("attribs = " + JSON.stringify(attribs));
    return attribs;
};

DavoutNpcStatParser.insertIntoSheet = function (charStats) {

};

DavoutNpcStatParser.command._parse = function (selected, npcType, isGm, msg){
    if (!DavoutUtils.checkForSelectionAndSendIfNothing(selected, "/w gm nothing is selected") && isGm) {
        return;
    }

    if (npcType.toLowerCase() != "special" && npcType.toLowerCase() != "standard") {
        sendChat("API", "/w gm invalid NPC-Type");
    }

    var tokenObjR20;
    var characterId;

    _.each(selected, function (obj){
        tokenObjR20 = getObj("graphic", obj._id);
        characterId = tokenObjR20.get("represents");
        if (characterId !== "") {
//            DavoutNpcStatParser.insertIntoSheet(DavoutNpcStatParser.parseIntoCharStats(tokenObjR20.get("gmnotes")));
            var x =DavoutNpcStatParser.parseIntoCharStats(tokenObjR20.get("gmnotes"));
            log("x = " + JSON.stringify(x));
        } else {
            sendChat("API", tokenObjR20.get("name") + " is not a character.");
        }
    });
};

on("ready", function () {
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }
    if (DavoutUtils == undefined) {
        log("You must have DavoutUtils installed in a script tab before the tab this script is in to use.");
        throw "Can't find DavoutUtils!";
    }

    var parseCommand = {};
    parseCommand.minArgs = 1;
    parseCommand.maxArgs = 1;
    parseCommand.typeList = [];
    parseCommand.typeList = ["str"];
    parseCommand.syntax = "!npc_parse NPC-Type<special|standard>";
    parseCommand.handle = function (args, who, isGm, msg) {
        DavoutNpcStatParser.command._parse(msg.selected, args[0].value, isGm, msg);
    };
    community.command.add("npc_parse", parseCommand);
});

// FcNpcStatParser

