var DavoutSheet = DavoutSheet || {};

DavoutSheet.diceType = "1d20";

DavoutSheet.attribs = [];
DavoutSheet.attribs["name"] = { name: "Name" , current: "", max: "" };
DavoutSheet.attribs["str"] = { name: "Str" , current: 10, max: 0 };
DavoutSheet.attribs["dex"] = { name: "Dex" , current: 10, max: 0 };
DavoutSheet.attribs["con"] = { name: "Con" , current: 10, max: 0 };
DavoutSheet.attribs["int"] = { name: "Int" , current: 10, max: 0 };
DavoutSheet.attribs["wis"] = { name: "Wis" , current: 10, max: 0 };
DavoutSheet.attribs["cha"] = { name: "Cha" , current: 10, max: 0 };
DavoutSheet.attribs["fort"] = { name: "Fortitude-Mod", current: 0, max: 0 };
DavoutSheet.attribs["ref"] = { name: "Reflex-Mod", current: 0, max: 0 };
DavoutSheet.attribs["will"] = { name: "Will-Mod", current: 0, max: 0 };
DavoutSheet.attribs["acp"] = { name: "AC-Penalty", current: 0, max: 0 };
DavoutSheet.attribs["spd"] = { name: "Speed", current: 30, max: 0 };
DavoutSheet.attribs["spdFly"] = { name: "Flying-Speed", current: 0, max: 0 };
DavoutSheet.attribs["spdSwim"] = { name: "Swimming-Speed", current: 0, max: 0 };
DavoutSheet.attribs["spdBurrow"] = { name: "Burrow-Speed", current: 0, max: 0 };
DavoutSheet.attribs["initBase"] = { name: "Initiative-Base" , current: 0, max: 0 };
DavoutSheet.attribs["attMeleeBase"] = { name: "Att-Melee-Base" , current: 0, max: 0 };
DavoutSheet.attribs["attHurlBase"] = { name: "Att-Hurl-Base" , current: 0, max: 0 };
DavoutSheet.attribs["attRangeBase"] = { name: "Att-Range-Base" , current: 0, max: 0 };
DavoutSheet.attribs["damMeleeBase"] = { name: "Dam-Melee-Base" , current: 0, max: 0 };
DavoutSheet.attribs["damHurlBase"] = { name: "Dam-Hurl-Base" , current: 0, max: 0 };
DavoutSheet.attribs["damRangeBase"] = { name: "Dam-Range-Base" , current: 0, max: 0 };

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

// TODO create code to generate ability rolls
DavoutSheet.combat = [];
DavoutSheet.combat["initiative"] = { name: "Initiative", attribute: "Dex", bonus: DavoutSheet.attribs["initBase"].name };
DavoutSheet.combat["attackMelee"] = { name: "Attack-Melee", attribute: "Str", bonus: DavoutSheet.attribs["attMeleeBase"].name };
DavoutSheet.combat["attackHurl"] = { name: "Attack-Hurl", attribute: "Dex", bonus: DavoutSheet.attribs["attRangeBase"].name };
DavoutSheet.combat["attackRange"] = { name: "Attack-Range", attribute: "Dex", bonus: DavoutSheet.attribs["attRangeBase"].name };
DavoutSheet.combat["damageMelee"] = { name: "Damage-Melee", attribute: "Str", bonus: DavoutSheet.attribs["damMeleeBase"].name };
DavoutSheet.combat["damageHurl"] = { name: "Damage-Hurl", attribute: "Str", bonus: DavoutSheet.attribs["damHurlBase"].name };
DavoutSheet.combat["damageRange"] = { name: "Damage-Range", attribute: "Dex", bonus: DavoutSheet.attribs["damRangeBase"].name };

DavoutSheet.skills = [
    { name: "Acrobatics", attribute: DavoutSheet.attribs["dex"].name, bonus: DavoutSheet.attribs["acrobaticsBase"].name, acp: true },
    { name: "Athletics", attribute: DavoutSheet.attribs["str"].name, bonus: DavoutSheet.attribs["athleticsBase"].name, acp: true },
    { name: "Blend", attribute: DavoutSheet.attribs["cha"].name, bonus: DavoutSheet.attribs["blendBase"].name, acp: false },
    { name: "Bluff", attribute: DavoutSheet.attribs["cha"].name, bonus: DavoutSheet.attribs["bluffBase"].name, acp: false },
    { name: "Crafting", attribute: DavoutSheet.attribs["int"].name, bonus: DavoutSheet.attribs["craftingBase"].name, acp: false },
    { name: "Haggle", attribute: DavoutSheet.attribs["wis"].name, bonus: DavoutSheet.attribs["haggleBase"].name, acp: false },
    { name: "Impress", attribute: DavoutSheet.attribs["cha"].name, bonus: DavoutSheet.attribs["impressBase"].name, acp: false },
    { name: "Intimidate", attribute: DavoutSheet.attribs["wis"].name, bonus: DavoutSheet.attribs["intimidateBase"].name, acp: false },
    { name: "Investigate", attribute: DavoutSheet.attribs["wis"].name, bonus: DavoutSheet.attribs["investigateBase"].name, acp: false },
    { name: "Medicine", attribute: DavoutSheet.attribs["int"].name, bonus: DavoutSheet.attribs["medicineBase"].name, acp: false },
    { name: "Notice", attribute: DavoutSheet.attribs["wis"].name, bonus: DavoutSheet.attribs["noticeBase"].name, acp: false },
    { name: "Prestidigitation", attribute: DavoutSheet.attribs["dex"].name, bonus: DavoutSheet.attribs["prestidigitationBase"].name, acp: true },
    { name: "Resolve", attribute: DavoutSheet.attribs["con"].name, bonus: DavoutSheet.attribs["resolveBase"].name, acp: false },
    { name: "Ride", attribute: DavoutSheet.attribs["dex"].name, bonus: DavoutSheet.attribs["rideBase"].name, acp: true },
    { name: "Search", attribute: DavoutSheet.attribs["int"].name, bonus: DavoutSheet.attribs["searchBase"].name, acp: false },
    { name: "Sense-Motive", attribute: DavoutSheet.attribs["wis"].name, bonus: DavoutSheet.attribs["senseMotiveBase"].name, acp: false },
    { name: "Sneak", attribute: DavoutSheet.attribs["dex"].name, bonus: DavoutSheet.attribs["sneakBase"].name, acp: true },
    { name: "Survival", attribute: DavoutSheet.attribs["wis"].name, bonus: DavoutSheet.attribs["survivalBase"].name, acp: false },
    { name: "Tactics", attribute: DavoutSheet.attribs["int"].name, bonus: DavoutSheet.attribs["tacticsBase"].name, acp: false }
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

DavoutSheet.createSkillOrCombatAction = function createSkillOrCombatAction(skill, charType) {
    var abilityAction = "/w gm @{Name} ";
    abilityAction += skill.name;
    abilityAction += ": [[floor(@{" + skill.attribute + "}/2-5)";
    abilityAction += "+@{" + skill.bonus + "}";
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

DavoutSheet.createSeparator = function createSeparator(character, label) {
    var placeHolder = findObjs({
        name: "----" + label + "----",
        description: "",
        action: "/w gm ----" + label + "----",
        type: "ability",
        characterid: character.id
    }, {caseInsensitive: true});
    if (placeHolder.length < 1) {
        createObj("ability", {
            name: "----" + label + "----",
            description: "",
            action: "/w gm ----" + label + "----",
            characterid: character.id
        });
    }
};

DavoutSheet.processSkills = function processSkills(character, charType) {
    for (var save in DavoutSheet.saves) {
        var saveAction = DavoutSheet.createSaveAction(DavoutSheet.saves[save]);
            createObj("ability", {
                name: DavoutSheet.saves[save].name,
                description: "",
                action: saveAction,
                characterid: character.id
            });
    };

    DavoutSheet.createSeparator(character, "Combat");

    for (var combat in DavoutSheet.combat) {
        var combatAction = DavoutSheet.createSkillOrCombatAction(DavoutSheet.combat[combat], charType);
        createObj("ability", {
            name: DavoutSheet.combat[combat].name,
            description: "",
            action: combatAction,
            characterid: character.id
        });
    };

    DavoutSheet.createSeparator(character, "Skills");
    
    for (var skill in DavoutSheet.skills) {
        var abilityAction = DavoutSheet.createSkillOrCombatAction(DavoutSheet.skills[skill], charType);
            createObj("ability", {
                name: DavoutSheet.skills[skill].name,
                description: "",
                action: abilityAction,
                characterid: character.id
            });
    };
};

on("ready", function() {
    on("add:character", function(char) {
        DavoutSheet.processAttribs(char);
        DavoutSheet.processSkills(char, 'all');
    });
});

// CreateFcSheet

