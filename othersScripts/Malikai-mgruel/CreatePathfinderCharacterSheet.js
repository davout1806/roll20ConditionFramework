/*
 * roll20 User: https://app.roll20.net/users/2267/malikai
 * git User:    https://gist.github.com/mgruel/
 */
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
    'wizard'
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

malikai.skills = [
    { name: "Acrobatics", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['barbarian', 'bard', 'cleric', 'monk', 'rogue'] },
    { name: "Appraise", attribute: malikai.attribs["int"].name, classSkill: ['bard', 'cleric', 'rogue', 'sorcerer', 'wizard'] },
    { name: "Bluff", attribute: malikai.attribs["cha"].name, classSkill: ['bard','rogue','sorcerer'] },
    { name: "Climb", attribute: malikai.attribs["str"].name, acpan: true, classSkill: ['barbarian','bard','druid','fighter','monk','ranger','rogue'] },
    { name: "Craft", attribute: malikai.attribs["int"].name, classSkill: ['all'] },
    { name: "Diplomacy", attribute: malikai.attribs["cha"].name, classSkill: ['bard','cleric','oracle','paladin','rogue'] },
    { name: "Disable-Device", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['rogue'] },
    { name: "Disguise", attribute: malikai.attribs["cha"].name, classSkill: ['bard','rogue'] },
    { name: "Escape-Artist", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['bard','monk','rogue'] },
    { name: "Fly", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['druid','summoner','sorcerer','wizard'] },
    { name: "Handle-Animal", attribute: malikai.attribs["cha"].name, classSkill: ['barbarian','druid','fighter','paladin','ranger','summoner'] },
    { name: "Heal", attribute: malikai.attribs["wis"].name, classSkill: ['cleric','druid','oracle','paladin','ranger'] },
    { name: "Intimidate", attribute: malikai.attribs["cha"].name, classSkill: ['barbarian','bard','fighter','monk','ranger','rogue','sorcerer'] },
    { name: "Knowledge-Arcana", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','sorcerer','summoner','wizard'] },
    { name: "Knowledge-Dungeoneering", attribute: malikai.attribs["int"].name, classSkill: ['bard','fighter','ranger','rogue','summoner','wizard'] },
    { name: "Knowledge-Engineering", attribute: malikai.attribs["int"].name, classSkill: ['bard','fighter','summoner','wizard'] },
    { name: "Knowledge-Geography", attribute: malikai.attribs["int"].name, classSkill: ['bard','druid','ranger','summoner','wizard'] },
    { name: "Knowledge-History", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','monk','oracle','summoner','wizard'] },
    { name: "Knowledge-Local", attribute: malikai.attribs["int"].name, classSkill: ['bard','rogue','summoner','wizard'] },
    { name: "Knowledge-Nature", attribute: malikai.attribs["int"].name, classSkill: ['barbarian','bard','druid','ranger','summoner','wizard'] },
    { name: "Knowledge-Nobility", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','paladin','summoner','wizard'] },
    { name: "Knowledge-Planes", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','oracle','summoner','wizard'] },
    { name: "Knowledge-Religion", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','monk','oracle','paladin','summoner','wizard'] },
    { name: "Linguistics", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','rogue','summoner','wizard'] },
    { name: "Perception", attribute: malikai.attribs["wis"].name, classSkill: ['barbarian','bard','druid','monk','ranger','rogue'] },
    { name: "Perform", attribute: malikai.attribs["cha"].name, classSkill: ['bard','monk','rogue'] },
    { name: "Profession", attribute: malikai.attribs["cha"].name, classSkill: ['bard','cleric','druid','fighter','monk','oracle','paladin','ranger','rogue','sorcerer','summoner','wizard'] },
    { name: "Ride", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['barbarian','druid','fighter','monk','paladin','summoner','ranger'] },
    { name: "Sense-Motive", attribute: malikai.attribs["wis"].name, classSkill: ['bard','cleric','monk','oracle','paladin','rogue'] },
    { name: "Sleight-of-Hand", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['bard','rogue'] },
    { name: "Spellcraft", attribute: malikai.attribs["int"].name, classSkill: ['bard','cleric','druid','oracle','paladin','ranger','sorcerer','summoner','wizard'] },
    { name: "Stealth", attribute: malikai.attribs["dex"].name, acpan: true, classSkill: ['bard','monk','ranger','rogue'] },
    { name: "Survival", attribute: malikai.attribs["wis"].name, classSkill: ['barbarian','druid','fighter','ranger'] },
    { name: "Swim", attribute: malikai.attribs["str"].name, acpan: true, classSkill: ['barbarian','druid','fighter','monk','ranger','rogue'] },
    { name: "Use-Magic-Device", attribute: malikai.attribs["cha"].name, classSkill: ['bard','rogue','sorcerer','summoner'] }
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