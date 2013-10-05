var DavoutNpcStatParser = DavoutNpcStatParser || {};
DavoutNpcStatParser.command = DavoutNpcStatParser.command || {};

DavoutNpcStatParser.finsSkills = function (line, compBonus) {

};
DavoutNpcStatParser.parseIntoCharStats = function (text, npcType) {
    var charStats = {};

    text = unescape(text);
    text = text.replace("<strong>", "");
    text = text.replace("</strong>", "");
    var lines = text.split("<br>");  // \n in GM Notes after unescape.
    _.each(lines, function (line){
        log("line = " + line);
    });

    charStats.name = DavoutNpcStatParser.findName(lines[0].trim());
    charStats.attribs = DavoutNpcStatParser.findAttributes(lines[1].trim());
    DavoutNpcStatParser.findStandardThreeAtt(lines[2].trim(), charStats);
    DavoutNpcStatParser.findHealthRangedRef(lines[3].trim(), npcType, charStats);
    DavoutNpcStatParser.findStandardThreeAtt(lines[4].trim(), charStats);
    charStats.speeds = DavoutNpcStatParser.findSpeeds(lines[5].trim());
    charStats.skills = DavoutNpcStatParser.finsSkills(lines[6].trim(), charStats.Comp);
    log("charStats = " + JSON.stringify(charStats));

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
//    log("JSON.stringify(attribPair) = " + JSON.stringify(attribPair));
    for(var i=0; i < 6; i++){
        var splitPair = attribPair[i].split(": ");
//        log("JSON.stringify(splitPair) = " + JSON.stringify(splitPair));
        var splitValue = splitPair[1].split("/");
        attribs[splitPair[0].trim()] = splitValue[1].trim();
//        log("JSON.stringify(splitValue[1]) = " + JSON.stringify(splitValue[1]));
    }
//    log("attribs = " + JSON.stringify(attribs));
    return attribs;
};

DavoutNpcStatParser.findStandardThreeAtt = function (line, charStats) {
//    log("JSON.stringify(line) = " + JSON.stringify(line));
    var attribPair = line.split("&nbsp;");
//    log("JSON.stringify(attribPair) = " + JSON.stringify(attribPair));
    for(var i=0; i < 3; i++){
        var splitPair = attribPair[i].split(": ");
//        log("JSON.stringify(splitPair) = " + JSON.stringify(splitPair));
        var splitValue = splitPair[1].split("=");
        charStats[splitPair[0].trim()] = splitValue[0].trim();
//        log("JSON.stringify(splitValue[1]) = " + JSON.stringify(splitValue[0]));
    }
//    log("charStats = " + JSON.stringify(charStats));
//    return charStats;
};

DavoutNpcStatParser.findHealthRangedRef = function (line, npcType, charStats) {
    var attribPair = line.split("&nbsp;");
    log("JSON.stringify(attribPair) = " + JSON.stringify(attribPair));
    var i = 0;
    if (npcType == "special"){
        i = 1;
        var health = attribPair[0].split(" ~ ");
        var vitalityWounds = health[1].split("/");
        log("vitalityWounds = " + vitalityWounds);
        charStats["Vitality"] = vitalityWounds[0].trim();
        charStats["Wounds"] = vitalityWounds[1].trim();
    }
    for(; i < 3; i++){
        var splitPair = attribPair[i].split(": ");
//        log("JSON.stringify(splitPair) = " + JSON.stringify(splitPair));
        var splitValue = splitPair[1].split("=");
        if (i === 0){
            charStats["DamageSave"] = splitValue[0].trim();
        } else {
            charStats[splitPair[0].trim()] = splitValue[0].trim();
        }
        log("JSON.stringify(splitValue[1]) = " + JSON.stringify(splitValue[0]));
    }
};

DavoutNpcStatParser.findSpeeds = function (line) {
    var speeds = {};
    var splitAtSpeed = line.split("Speed: ");
    var speedSplit = splitAtSpeed[1].split(", ");
    _.each(speedSplit, function (str){
        var speedTypeSplit = str.split(" ft. ");
        speeds[speedTypeSplit[1].trim()] = speedTypeSplit[0].trim();
    });

    return speeds;
};

DavoutNpcStatParser.finsSkills = function (line, compBonus) {
    var skills = {};
    line = line.substring("<em>Skills:</em> ".length);
    var signatureSkills = line.split("; ");
    _.each (signatureSkills, function (skill){
        var words = skill.split(" ");
        skills[words[0]]= words[3];
    });

    _.each(DavoutSheet.skills, function (skillName){
        if (skills[skillName.name] == undefined){
            skills[skillName.name] = compBonus;
        }
    });

    return skills;
};

DavoutNpcStatParser.insertIntoSheet = function (charStats) {

};

DavoutNpcStatParser.command._parse = function (selected, npcType, isGm, msg){
    if (!Davout.Utils.checkForSelectionAndMsgIfNot(selected, "/w gm nothing is selected", false, "") && isGm) {
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
            var x =DavoutNpcStatParser.parseIntoCharStats(tokenObjR20.get("gmnotes"), npcType);
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
    if (Davout.Utils == undefined) {
        log("You must have Davout.Utils installed in a script tab before the tab this script is in to use.");
        throw "Can't find Davout.Utils!";
    }
    if (DavoutSheet == undefined) {
        log("You must have DavoutSheet installed in a script tab before the tab this script is in to use.");
        throw "Can't find DavoutSheet!";
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

