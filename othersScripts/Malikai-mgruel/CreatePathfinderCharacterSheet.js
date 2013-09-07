// This is Malikai script with a few addons

var malikai = malikai || {};

malikai.diceType = "1d20";

malikai.charClasses = [
    'barbarian',
    'bard',
    'cleric',
    'druid',
    'fighter',
    'monk',
    'oracle',
    'paladin',
    'ranger',
    'rogue',
    'sorcerer',
    'summoner',
    'wizard',
    'gunslinger',
    'ninja',
    'samurai',
    'magus',
    'alchemist',
    'cavalier',
    'inquisitor',
    'witch'

];

malikai.attribs = [];
malikai.attribs["level"] = { name: "Level", current: 1, max: 1 };
malikai.attribs["casterlvl"] = { name: "Caster-Level", current: 0, max: 0 };
malikai.attribs["str"] = { name: "Str-Mod", current: 0, max: 0 };
malikai.attribs["dex"] = { name: "Dex-Mod", current: 0, max: 0 };
malikai.attribs["con"] = { name: "Con-Mod", current: 0, max: 0 };
malikai.attribs["int"] = { name: "Int-Mod", current: 0, max: 0 };
malikai.attribs["wis"] = { name: "Wis-Mod", current: 0, max: 0 };
malikai.attribs["cha"] = { name: "Cha-Mod", current: 0, max: 0 };
malikai.attribs["hp"] = { name: "HP", current: 0, max: 0 };
malikai.attribs["ac"] = { name: "AC", current: 0, max: 0 };
malikai.attribs["cmb"] = { name: "CMB", current: 0, max: 0 };
malikai.attribs["cmd"] = { name: "CMD", current: 0, max: 0 };
malikai.attribs["init"] = { name: "Initiative", current: 0, max: 0 };
malikai.attribs["fort"] = { name: "Fortitude-Mod", current: 0, max: 0 };
malikai.attribs["ref"] = { name: "Reflex-Mod", current: 0, max: 0 };
malikai.attribs["will"] = { name: "Will-Mod", current: 0, max: 0 };
malikai.attribs["bab"] = { name: "BAB", current: 0, max: 0 };
malikai.attribs["csb"] = { name: "Class-Skill-Bonus", current: 3, max: 3 };
malikai.attribs["acpan"] = { name: "AC-Penalty", current: 0, max: 0 };
malikai.attribs["spd"] = { name: "Speed", current: 30, max: 30 };
malikai.attribs["acrobaticsRanks"] = { name: "Acrobatics-Ranks", current: 0, max: 0 };
malikai.attribs["appraiseRanks"] = { name: "Appraise-Ranks", current: 0, max: 0 };
malikai.attribs["bluffRanks"] = { name: "Bluff-Ranks", current: 0, max: 0 };
malikai.attribs["climbRanks"] = { name: "Climb-Ranks", current: 0, max: 0 };
malikai.attribs["craftRanks"] = { name: "Craft-Ranks", current: 0, max: 0 };
malikai.attribs["diplomacyRanks"] = { name: "Diplomacy-Ranks", current: 0, max: 0 };
malikai.attribs["disableDeviceRanks"] = { name: "Disable-Device-Ranks", current: 0, max: 0 };
malikai.attribs["disguiseRanks"] = { name: "Disguise-Ranks", current: 0, max: 0 };
malikai.attribs["escapeArtistRanks"] = { name: "Escape-Artist-Ranks", current: 0, max: 0 };
malikai.attribs["flyRanks"] = { name: "Fly-Ranks", current: 0, max: 0 };
malikai.attribs["handleAnimalRanks"] = { name: "Handle-Animal-Ranks", current: 0, max: 0 };
malikai.attribs["healRanks"] = { name: "Heal-Ranks", current: 0, max: 0 };
malikai.attribs["intimidateRanks"] = { name: "Intimidate-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeArcanaRanks"] = { name: "Knowledge-Arcana-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeDungeoneeringRanks"] = { name: "Knowledge-Dungeoneering-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeEngineeringRanks"] = { name: "Knowledge-Engineering-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeGeographyRanks"] = { name: "Knowledge-Geography-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeHistoryRanks"] = { name: "Knowledge-History-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeLocalRanks"] = { name: "Knowledge-Local-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeNatureRanks"] = { name: "Knowledge-Nature-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeNobilityRanks"] = { name: "Knowledge-Nobility-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgePlanesRanks"] = { name: "Knowledge-Planes-Ranks", current: 0, max: 0 };
malikai.attribs["knowledgeReligionRanks"] = { name: "Knowledge-Religion-Ranks", current: 0, max: 0 };
malikai.attribs["linguisticsRanks"] = { name: "Linguistics-Ranks", current: 0, max: 0 };
malikai.attribs["perceptionRanks"] = { name: "Perception-Ranks", current: 0, max: 0 };
malikai.attribs["performRanks"] = { name: "Perform-Ranks", current: 0, max: 0 };
malikai.attribs["professionRanks"] = { name: "Profession-Ranks", current: 0, max: 0 };
malikai.attribs["rideRanks"] = { name: "Ride-Ranks", current: 0, max: 0 };
malikai.attribs["senseMotiveRanks"] = { name: "Sense-Motive-Ranks", current: 0, max: 0 };
malikai.attribs["sleightOfHandRanks"] = { name: "Sleight-of-Hand-Ranks", current: 0, max: 0 };
malikai.attribs["spellcraftRanks"] = { name: "Spellcraft-Ranks", current: 0, max: 0 };
malikai.attribs["stealthRanks"] = { name: "Stealth-Ranks", current: 0, max: 0 };
malikai.attribs["survivalRanks"] = { name: "Survival-Ranks", current: 0, max: 0 };
malikai.attribs["swimRanks"] = { name: "Swim-Ranks", current: 0, max: 0 };
malikai.attribs["useMagicDeviceRanks"] = { name: "Use-Magic-Device-Ranks", current: 0, max: 0 };

malikai.skills = [
    { name: "Acrobatics", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["acrobaticsRanks"].name, acpan: true, classSkill: ['barbarian', 'bard', 'cleric', 'monk', 'rogue','gunslinger','ninja'] },
    { name: "Appraise", attribute: malikai.attribs["int"].name, rank: malikai.attribs["appraiseRanks"].name, classSkill: ['bard', 'cleric', 'rogue', 'sorcerer', 'wizard','ninja','alchemist'] },
    { name: "Bluff", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["bluffRanks"].name, classSkill: ['bard','rogue','sorcerer','gunslinger','ninja','samurai','cavalier','inquisitor'] },
    { name: "Climb", attribute: malikai.attribs["str"].name, rank: malikai.attribs["climbRanks"].name, acpan: true, classSkill: ['barbarian','bard','druid','fighter','monk','ranger','rogue','gunslinger','ninja','samurai','magus','cavalier','inquisitor'] },
    { name: "Craft", attribute: malikai.attribs["int"].name, rank: malikai.attribs["craftRanks"].name, classSkill: ['all'] },
    { name: "Diplomacy", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["diplomacyRanks"].name, classSkill: ['bard','cleric','oracle','paladin','rogue','ninja','samurai','cavalier','inquisitor'] },
    { name: "Disable-Device", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["disableDeviceRanks"].name, acpan: true, classSkill: ['rogue','ninja','alchemist'] },
    { name: "Disguise", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["disguiseRanks"].name, classSkill: ['bard','rogue','ninja','inquisitor'] },
    { name: "Escape-Artist", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["escapeArtistRanks"].name, acpan: true, classSkill: ['bard','monk','rogue','ninja'] },
    { name: "Fly", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["flyRanks"].name, acpan: true, classSkill: ['druid','summoner','sorcerer','wizard','magus','alchemist','witch'] },
    { name: "Handle-Animal", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["handleAnimalRanks"].name,  classSkill: ['barbarian','druid','fighter','paladin','ranger','summoner','gunslinger','samurai','cavalier'] },
    { name: "Heal", attribute: malikai.attribs["wis"].name, rank: malikai.attribs["healRanks"].name, classSkill: ['cleric','druid','oracle','paladin','ranger','alchemist','inquisitor','witch'] },
    { name: "Intimidate", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["intimidateRanks"].name, classSkill: ['barbarian','bard','fighter','monk','ranger','rogue','sorcerer','gunslinger','ninja','samurai','magus','cavalier','inquisitor','witch'] },
    { name: "Knowledge-Arcana", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeArcanaRanks"].name, classSkill: ['bard','cleric','sorcerer','summoner','wizard','alchemist','inquisitor','witch'] },
    { name: "Knowledge-Dungeoneering", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeDungeoneeringRanks"].name, classSkill: ['bard','fighter','ranger','rogue','summoner','wizard','magus','inquisitor'] },
    { name: "Knowledge-Engineering", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeEngineeringRanks"].name, classSkill: ['bard','fighter','summoner','wizard','gunslinger'] },
    { name: "Knowledge-Geography", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeGeographyRanks"].name, classSkill: ['bard','druid','ranger','summoner','wizard'] },
    { name: "Knowledge-History", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeHistoryRanks"].name, classSkill: ['bard','cleric','monk','oracle','summoner','wizard','witch'] },
    { name: "Knowledge-Local", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeLocalRanks"].name, classSkill: ['bard','rogue','summoner','wizard','gunslinger','ninja'] },
    { name: "Knowledge-Nature", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeNatureRanks"].name, classSkill: ['barbarian','bard','druid','ranger','summoner','wizard','alchemist','inquisitor'] },
    { name: "Knowledge-Nobility", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeNobilityRanks"].name, classSkill: ['bard','cleric','paladin','summoner','wizard','ninja'] },
    { name: "Knowledge-Planes", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgePlanesRanks"].name, classSkill: ['bard','cleric','oracle','summoner','wizard','magus','inquisitor','witch'] },
    { name: "Knowledge-Religion", attribute: malikai.attribs["int"].name, rank: malikai.attribs["knowledgeReligionRanks"].name, classSkill: ['bard','cleric','monk','oracle','paladin','summoner','wizard','inquisitor'] },
    { name: "Linguistics", attribute: malikai.attribs["int"].name, rank: malikai.attribs["linguisticsRanks"].name, classSkill: ['bard','cleric','rogue','summoner','wizard','ninja'] },
    { name: "Perception", attribute: malikai.attribs["wis"].name, rank: malikai.attribs["perceptionRanks"].name, classSkill: ['barbarian','bard','druid','monk','ranger','rogue','gunslinger','ninja','alchemist','inquisitor'] },
    { name: "Perform", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["performRanks"].name, classSkill: ['bard','monk','rogue','ninja'] },
    { name: "Profession", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["professionRanks"].name, classSkill: ['bard','cleric','druid','fighter','monk','oracle','paladin','ranger','rogue','sorcerer','summoner','wizard','gunslinger','ninja','samurai','magus','alchemist','cavalier','inquisitor','witch'] },
    { name: "Ride", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["rideRanks"].name, acpan: true, classSkill: ['barbarian','druid','fighter','monk','paladin','summoner','ranger','gunslinger','samurai','magus','cavalier','inquisitor'] },
    { name: "Sense-Motive", attribute: malikai.attribs["wis"].name, rank: malikai.attribs["senseMotiveRanks"].name, classSkill: ['bard','cleric','monk','oracle','paladin','rogue','ninja','samurai','cavalier','inquisitor'] },
    { name: "Sleight-of-Hand", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["sleightOfHandRanks"].name, acpan: true, classSkill: ['bard','rogue','gunslinger','ninja','alchemist'] },
    { name: "Spellcraft", attribute: malikai.attribs["int"].name, rank: malikai.attribs["spellcraftRanks"].name, classSkill: ['bard','cleric','druid','oracle','paladin','ranger','sorcerer','summoner','wizard','magus','alchemist','inquisitor','witch'] },
    { name: "Stealth", attribute: malikai.attribs["dex"].name, rank: malikai.attribs["stealthRanks"].name, acpan: true, classSkill: ['bard','monk','ranger','rogue','ninja','inquisitor'] },
    { name: "Survival", attribute: malikai.attribs["wis"].name, rank: malikai.attribs["survivalRanks"].name, classSkill: ['barbarian','druid','fighter','ranger','gunslinger','alchemist','inquisitor'] },
    { name: "Swim", attribute: malikai.attribs["str"].name, rank: malikai.attribs["swimRanks"].name, acpan: true, classSkill: ['barbarian','druid','fighter','monk','ranger','rogue','gunslinger','ninja','samurai','magus','cavalier','inquisitor'] },
    { name: "Use-Magic-Device", attribute: malikai.attribs["cha"].name, rank: malikai.attribs["useMagicDeviceRanks"].name, classSkill: ['bard','rogue','sorcerer','summoner','ninja','magus','alchemist','witch'] }
];

malikai.saves = [];
malikai.saves["fort"] = { name: "Fortitude-Save", attribute: malikai.attribs["con"].name, bonus: malikai.attribs["fort"].name };
malikai.saves["ref"] = { name: "Reflex-Save", attribute: malikai.attribs["dex"].name, bonus: malikai.attribs["ref"].name };
malikai.saves["will"] = { name: "Will-Save", attribute: malikai.attribs["wis"].name, bonus: malikai.attribs["will"].name };

malikai.processAttribs = function processAttribs(character) {
    for (var index in malikai.attribs) {
        createObj("attribute", {
            name: malikai.attribs[index].name,
            current: malikai.attribs[index].current,
            max: malikai.attribs[index].max,
            characterid: character.id
        });
    };
}

malikai.getSkillBonus = function getSkillBonus(skill, charType) {
    log("Skill: " + JSON.stringify(skill));
    if (_.indexOf(skill.classSkill, charType) !== -1
        || _.indexOf(skill.classSkill, 'all') !== -1) {
        return "+@{" + malikai.attribs["csb"].name + "}";
    }
    return "";
}

malikai.createAbilityAction = function createAbilityAction(skill, charType) {
    var abilityAction = skill.name;
    abilityAction += "\n/r ";
    abilityAction += malikai.diceType;
    abilityAction += "+@{" + skill.attribute + "}";
    abilityAction += "+@{" + skill.rank + "}";
    abilityAction += malikai.getSkillBonus(skill, charType);
    if (skill.acpan) {
        abilityAction += "+@{" + malikai.attribs["acpan"].name + "}";
    }
    return abilityAction;
}

malikai.createSaveAction = function createSaveAction(save) {
    var saveAction = save.name;
    saveAction += "\n/r ";
    saveAction += malikai.diceType;
    saveAction += "+@{" + save.attribute + "}";
    saveAction += "+@{" + save.bonus + "}";
    return saveAction;
}

malikai.processSkills = function processSkills(character, charType) {
    for (var skill in malikai.skills) {
        var abilityAction = malikai.createAbilityAction(malikai.skills[skill], charType);
        var abilities = findObjs({
            name: malikai.skills[skill].name,
            type: "ability",
            description: "",
            characterid: character.id
        }, {caseInsensitive: true});
        if (abilities.length > 0) {
            _.each(abilities, function(ability) {
                var userModifier = malikai.retrieveUserModifiers(malikai.skills[skill], ability.get("action"));
                log("Retrieved User-Modifier: " + userModifier);
                abilityAction += userModifier;
                ability.set("action", abilityAction);
            })
        } else {
            createObj("ability", {
                name: malikai.skills[skill].name,
                description: "",
                action: abilityAction,
                characterid: character.id
            });
        }
    };

    var placeHolder = findObjs({
        name: "--------------------------",
        description: "",
        action: "",
        type: "ability",
        characterid: character.id
    }, {caseInsensitive: true});
    if (placeHolder.length < 1) {
        createObj("ability", {
            name: "--------------------------",
            description: "",
            action: "",
            characterid: character.id
        });
    }

    for (var save in malikai.saves) {
        var saveAction = malikai.createSaveAction(malikai.saves[save]);
        var savingthrows = findObjs({
            name: malikai.saves[save].name,
            description: "",
            type: "ability",
            characterid: character.id
        }, {caseInsensitive: true});
        if (savingthrows.length > 0) {
            _.each(savingthrows, function(save){
                save.set("action", saveAction);
            });
        } else {
            createObj("ability", {
                name: malikai.saves[save].name,
                description: "",
                action: saveAction,
                characterid: character.id
            });
        }
    };

    var placeHolder = findObjs({
        name: "--------------------------",
        description: "",
        action: "",
        type: "ability",
        characterid: character.id
    }, {caseInsensitive: true});
    if (placeHolder.length < 1) {
        createObj("ability", {
            name: "--------------------------",
            description: "",
            action: "",
            characterid: character.id
        });
    }
}

malikai.retrieveUserModifiers = function retrieveUserModifiers(currentSkill, actionCommand) {
    var modifier = actionCommand.replace(currentSkill.name+"\n/r " + malikai.diceType + "+@{" + currentSkill.attribute + "}", "");
    log("Modifier - Step 1: " + modifier);
    modifier = modifier.replace("+@{" + malikai.attribs["csb"].name + "}", "");
    log("Modifier - Step 2: " + modifier);
    modifier = modifier.replace("+@{" + malikai.attribs["acpan"].name + "}", "");
    log("Modifier - Step 3: " + modifier);
    return modifier;
}

malikai.parseCommand = function parseCommand(msg) {
    if (msg.type == "api" && msg.who.indexOf("(GM)") == -1) {
        sendChat("System", "Only the GM is allowed to switch classes.");
        return;
    }
    if(msg.type == "api" && msg.content.indexOf("!skill ") !== -1) {
        var cmdParts = msg.content.replace("!skill ", "").split(" ");
        var charClass;

        _.each(cmdParts, function(part) {
            var indexOfClass = _.indexOf(malikai.charClasses, part);
            if (indexOfClass > -1) {
                charClass = malikai.charClasses[indexOfClass];
                cmdParts = _.without(cmdParts, part);
            }
        });

        if (typeof charClass === undefined) {
            sendChat('System', 'Usage: !skill charName charClass');
            sendChat('System', 'Value for charClass: ' + malikai.charClasses);
            return;
        }

        var result = {};
        result.charName = cmdParts.join(" ");
        log("Charname: " + result.charName);
        result.charType = charClass;
        log("CharType: " + result.charType);
        return result;
    }
}

on("ready", function() {
    on("add:character", function(char) {
        malikai.processAttribs(char);
        malikai.processSkills(char, 'all');
    });

    on("chat:message", function(msg) {
        var chatCmd = malikai.parseCommand(msg);
        if (typeof chatCmd === 'undefined') {
            return;
        }

        sendChat('System', 'Setting class ' + chatCmd.charType + ' for ' + chatCmd.charName);

        var characters = findObjs({
            _type: "character",
            archived: false,
            name: chatCmd.charName
        }, {caseInsensitive: true});
        _.each(characters, function(character) {
            log("Name: " + character.get("name"));
            log("Bio: " + character.get("bio"));
            log("GM-Notes: " + character.get("gmnotes"));
            log("Archived: " + character.get("archived"));
            log("In player journals: " + character.get("inplayerjournals"));
            log("Controlled By: " + character.get("controlledby"));
            malikai.processSkills(character, chatCmd.charType);
        });
    });
});
