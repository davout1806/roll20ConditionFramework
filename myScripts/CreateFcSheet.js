var DavoutSheet = DavoutSheet || {};

DavoutSheet.diceType = "1d20";

DavoutSheet.attribs = [];
DavoutSheet.attribs["name"] = { name: "Name" , current: "", max: "" };
DavoutSheet.attribs["str"] = { name: "Str" , current: 0, max: 0 };
DavoutSheet.attribs["dex"] = { name: "Dex" , current: 0, max: 0 };
DavoutSheet.attribs["con"] = { name: "Con" , current: 0, max: 0 };
DavoutSheet.attribs["int"] = { name: "Int" , current: 0, max: 0 };
DavoutSheet.attribs["wis"] = { name: "Wis" , current: 0, max: 0 };
DavoutSheet.attribs["cha"] = { name: "Cha" , current: 0, max: 0 };
DavoutSheet.attribs["fort"] = { name: "Fortitude-Mod", current: 0, max: 0 };
DavoutSheet.attribs["ref"] = { name: "Reflex-Mod", current: 0, max: 0 };
DavoutSheet.attribs["will"] = { name: "Will-Mod", current: 0, max: 0 };
DavoutSheet.attribs["acp"] = { name: "AC-Penalty", current: 0, max: 0 };
DavoutSheet.attribs["spd"] = { name: "Speed", current: 30, max: 30 };
DavoutSheet.attribs["initBase"] = { name: "Initiative-Base" , current: 0, max: 0 };
DavoutSheet.attribs["acrobaticsBase"] = { name: "Acrobatics-Base", current: 0, max: 0 };
DavoutSheet.attribs["athleticsBase"] = { name: "Athletics-Base", current: 0, max: 0 };
DavoutSheet.attribs["blendBase"] = { name: "Blend-Base", current: 0, max: 0 };
DavoutSheet.attribs["bluffBase"] = { name: "Bluff-Base", current: 0, max: 0 };
DavoutSheet.attribs["craftingBase"] = { name: "Crafting-Base", current: 0, max: 0 };
DavoutSheet.attribs["haggleBase"] = { name: "Haggle-Base", current: 0, max: 0 };
DavoutSheet.attribs["impressBase"] = { name: "Impress-Base", current: 0, max: 0 };
DavoutSheet.attribs["intimidateBase"] = { name: "Intimidate-Base", current: 0, max: 0 };
DavoutSheet.attribs["investigateBase"] = { name: "Investigate-Base", current: 0, max: 0 };
DavoutSheet.attribs["medicineBase"] = { name: "Medicine-Base", current: 0, max: 0 };
DavoutSheet.attribs["noticeBase"] = { name: "Notice-Base", current: 0, max: 0 };
DavoutSheet.attribs["prestidigitationBase"] = { name: "Prestidigitation-Base", current: 0, max: 0 };
DavoutSheet.attribs["resolveBase"] = { name: "Resolve-Base", current: 0, max: 0 };
DavoutSheet.attribs["rideBase"] = { name: "Ride-Base", current: 0, max: 0 };
DavoutSheet.attribs["searchBase"] = { name: "Search-Base", current: 0, max: 0 };
DavoutSheet.attribs["senseMotiveBase"] = { name: "Sense-Motive-Base", current: 0, max: 0 };
DavoutSheet.attribs["sneakBase"] = { name: "Sneak-Base", current: 0, max: 0 };
DavoutSheet.attribs["survivalBase"] = { name: "Survival-Base", current: 0, max: 0 };
DavoutSheet.attribs["tacticsBase"] = { name: "Tactics-Base", current: 0, max: 0 };

DavoutSheet.saves = [];
DavoutSheet.saves["fort"] = { name: "Fort-Save", attribute: "Con", bonus: DavoutSheet.attribs["fort"].name };
DavoutSheet.saves["ref"] = { name: "Ref-Save", attribute: "Dex", bonus: DavoutSheet.attribs["ref"].name };
DavoutSheet.saves["will"] = { name: "Will-Save", attribute: "Wis", bonus: DavoutSheet.attribs["will"].name };

DavoutSheet.skills = [
    { name: "Initiative", attribute: DavoutSheet.attribs["dex"].name, rank: DavoutSheet.attribs["initBase"].name, acp: true },
    { name: "Acrobatics", attribute: DavoutSheet.attribs["dex"].name, rank: DavoutSheet.attribs["acrobaticsBase"].name, acp: true },
    { name: "Athletics", attribute: DavoutSheet.attribs["str"].name, rank: DavoutSheet.attribs["athleticsBase"].name, acp: true },
    { name: "Blend", attribute: DavoutSheet.attribs["cha"].name, rank: DavoutSheet.attribs["blendBase"].name, acp: false },
    { name: "Bluff", attribute: DavoutSheet.attribs["cha"].name, rank: DavoutSheet.attribs["bluffBase"].name, acp: false },
    { name: "Crafting", attribute: DavoutSheet.attribs["int"].name, rank: DavoutSheet.attribs["craftingBase"].name, acp: false },
    { name: "Haggle", attribute: DavoutSheet.attribs["wis"].name, rank: DavoutSheet.attribs["haggleBase"].name, acp: false },
    { name: "Impress", attribute: DavoutSheet.attribs["cha"].name, rank: DavoutSheet.attribs["impressBase"].name, acp: false },
    { name: "Intimidate", attribute: DavoutSheet.attribs["wis"].name, rank: DavoutSheet.attribs["intimidateBase"].name, acp: false },
    { name: "Investigate", attribute: DavoutSheet.attribs["wis"].name, rank: DavoutSheet.attribs["investigateBase"].name, acp: false },
    { name: "Medicine", attribute: DavoutSheet.attribs["int"].name, rank: DavoutSheet.attribs["medicineBase"].name, acp: false },
    { name: "Notice", attribute: DavoutSheet.attribs["wis"].name, rank: DavoutSheet.attribs["noticeBase"].name, acp: false },
    { name: "Prestidigitation", attribute: DavoutSheet.attribs["dex"].name, rank: DavoutSheet.attribs["prestidigitationBase"].name, acp: true },
    { name: "Resolve", attribute: DavoutSheet.attribs["con"].name, rank: DavoutSheet.attribs["resolveBase"].name, acp: false },
    { name: "Ride", attribute: DavoutSheet.attribs["dex"].name, rank: DavoutSheet.attribs["rideBase"].name, acp: true },
    { name: "Search", attribute: DavoutSheet.attribs["int"].name, rank: DavoutSheet.attribs["searchBase"].name, acp: false },
    { name: "Sense-Motive", attribute: DavoutSheet.attribs["wis"].name, rank: DavoutSheet.attribs["senseMotiveBase"].name, acp: false },
    { name: "Sneak", attribute: DavoutSheet.attribs["dex"].name, rank: DavoutSheet.attribs["sneakBase"].name, acp: true },
    { name: "Survival", attribute: DavoutSheet.attribs["wis"].name, rank: DavoutSheet.attribs["survivalBase"].name, acp: false },
    { name: "Tactics", attribute: DavoutSheet.attribs["int"].name, rank: DavoutSheet.attribs["tacticsBase"].name, acp: false }
];

DavoutSheet.processAttribs = function processAttribs(character) {
    for (var index in DavoutSheet.attribs) {
        createObj("attribute", {
            name: DavoutSheet.attribs[index].name,
            current: DavoutSheet.attribs[index].current,
            max: DavoutSheet.attribs[index].max,
            characterid: character.id
        });
    };
};

DavoutSheet.getSkillBonus = function getSkillBonus(skill, charType) {
//    log("Skill: " + JSON.stringify(skill));
    if (_.indexOf(skill.classSkill, charType) !== -1
        || _.indexOf(skill.classSkill, 'all') !== -1) {
        return "+@{" + DavoutSheet.attribs["csb"].name + "}";
    }
    return "";
};

DavoutSheet.createSaveAction = function createSaveAction(save) {
    var saveAction = "/w gm @{Name} ";
    saveAction += save.name;
    saveAction += ": [[floor(@{" + save.attribute + "}/2-5)";
    saveAction += "+@{" + save.bonus + "}+";
    saveAction += DavoutSheet.diceType;
    saveAction += "]]";
    return saveAction;
};

DavoutSheet.createSkillAction = function createSkillAction(skill, charType) {
    var abilityAction = "/w gm @{Name} ";
    abilityAction += skill.name;
    abilityAction += ": [[floor(@{" + skill.attribute + "}/2-5)";
    abilityAction += "+@{" + skill.rank + "}";
    abilityAction += DavoutSheet.getSkillBonus(skill, charType);
    if (skill.acp) {
        abilityAction += "+@{" + DavoutSheet.attribs["acp"].name + "}";
    }
    abilityAction += "+" + DavoutSheet.diceType;
    abilityAction += "]]";
    return abilityAction;
};

DavoutSheet.retrieveUserModifiers = function retrieveUserModifiers(currentSkill, actionCommand) {
    var modifier = actionCommand.replace(currentSkill.name+"\n/r " + DavoutSheet.diceType + "+@{" + currentSkill.attribute + "}", "");
//    log("Modifier - Step 1: " + modifier);
    modifier = modifier.replace("+@{" + DavoutSheet.attribs["csb"].name + "}", "");
//    log("Modifier - Step 2: " + modifier);
    modifier = modifier.replace("+@{" + DavoutSheet.attribs["acp"].name + "}", "");
//    log("Modifier - Step 3: " + modifier);
    return modifier;
};

DavoutSheet.createSeparator = function createSeparator(character) {
    var placeHolder = findObjs({
        name: "--------------------------",
        description: "",
        action: "/w gm --------------------------",
        type: "ability",
        characterid: character.id
    }, {caseInsensitive: true});
    if (placeHolder.length < 1) {
        createObj("ability", {
            name: "--------------------------",
            description: "",
            action: "/w gm --------------------------",
            characterid: character.id
        });
    }
};

DavoutSheet.processSkills = function processSkills(character, charType) {
    for (var save in DavoutSheet.saves) {
        var saveAction = DavoutSheet.createSaveAction(DavoutSheet.saves[save]);
        var savingthrows = findObjs({
            name: DavoutSheet.saves[save].name,
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
                name: DavoutSheet.saves[save].name,
                description: "",
                action: saveAction,
                characterid: character.id
            });
        }
    };

    DavoutSheet.createSeparator(character);
    
    for (var skill in DavoutSheet.skills) {
        var abilityAction = DavoutSheet.createSkillAction(DavoutSheet.skills[skill], charType);
        var abilities = findObjs({
            name: DavoutSheet.skills[skill].name,
            type: "ability",
            description: "",
            characterid: character.id
        }, {caseInsensitive: true});
        if (abilities.length > 0) {
            _.each(abilities, function(ability) {
                var userModifier = DavoutSheet.retrieveUserModifiers(DavoutSheet.skills[skill], ability.get("action"));
                //log("Retrieved User-Modifier: " + userModifier);
                abilityAction += userModifier;
                ability.set("action", abilityAction);
            })
        } else {
            createObj("ability", {
                name: DavoutSheet.skills[skill].name,
                description: "",
                action: abilityAction,
                characterid: character.id
            });
        }
    };

    DavoutSheet.createSeparator(character);
};

on("ready", function() {
    on("add:character", function(char) {
        DavoutSheet.processAttribs(char);
        DavoutSheet.processSkills(char, 'all');
    });
});