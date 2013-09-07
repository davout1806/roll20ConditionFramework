var DavoutNpcStatParser = DavoutNpcStatParser || {};
DavoutNpcStatParser.command = DavoutNpcStatParser.command || {};

DavoutNpcStatParser.parseIntoCharStats = function (text) {
    text = unescape(text);
    text = text.replace("<strong>", "");
    text = text.replace("</strong>", "");
    var lines = text.split("<br>");  // \n in GM Notes.

    _.each(lines, function (line) {
        log(line);
    });
//    _.each(lines, function (line, lineIndex) {
//        this[lineIndex] = line.split(" ");
//    }, lines);
//
//    _.each(lines, function (line, lineIndex) {
//        _.each(line, function (word, lineIndex) {
//            log(word);
//        } );
//    } );
};

DavoutNpcStatParser.insertIntoSheet = function (charStats) {

};

DavoutNpcStatParser.command._parse = function (selected, npcType, isGm, msg){
    if (!DavoutUtils.checkForSelectionAndSendIfNothing(selected, "/w gm nothing is selected") && isGm) {
        log("no");
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
            DavoutNpcStatParser.insertIntoSheet(DavoutNpcStatParser.parseIntoCharStats(tokenObjR20.get("gmnotes")));
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
