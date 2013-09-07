/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 */

on("chat:message", function(msg) {
    var equipCmd = "!Equip ";

    if(msg.content.indexOf("!Equip") !== -1) {
        log("Equipping: ");

        // removes !equip from the string
        var cleanedMsg = msg.content.replace(equipCmd, "").split(" ");

        //Pulls name of the person being equipped with the weapon set in question
        var charName = cleanedMsg[0];

        //Pulls type of attack (melee,offhand,ranged) of equipped weapon
        var type = cleanedMsg[1];

        //Pulls name of the weapon
        var weaponName = cleanedMsg[2];

        //specific attack modifiers for the weapon in question
        var weaponAttackBonus = cleanedMsg[3];

        //base damage of the weapon
        var weaponDamage = cleanedMsg[4];

        //bonus damage from other effects
        var weaponBonusDamage = cleanedMsg[5];

        //bonus damage from other effects
        var weaponBonusType = cleanedMsg[6];

        log(charName + "'s " + type + " weapon, a " + weaponName + " with a " + weaponAttackBonus + " for attack, " + weaponDamage + " damage, with " + weaponBonusDamage + " " + weaponBonusType + " damage." );
        sendChat(charName, "/e equips " + weaponName )

        //Order matters for findObjs
        var targetMatched = findObjs({
            name: charName,
            _type: "character",
        });

        // this is where I need help. I cannot figure out how to string everything together to get this script to find the target character sheet and then set the relevant values into the right attributes.
        if (type == "melee" || type == "Melee") {

            _.each(targetMatched, function(obj) {

                //Melee Weapon Name
                var meleeWeapon = findObjs({
                    name: "MeleeWeapon",
                    _type: "attribute",
                    _characterid: obj.id,
                });
                _.each(meleeWeapon, function(meleewpn) {
                    meleewpn.set("current", weaponName);
                })

                //Melee Weapon Attack
                var meleeAttack = findObjs({
                    name: "MeleeAttack",
                    _type: "attribute",
                    _characterid: obj.id,
                });
                _.each(meleeAttack, function(meleeatt) {
                    meleeatt.set("current", weaponAttackBonus);
                })

                //Melee Damage
                var meleeDamage = findObjs({
                    name: "MeleeDamage",
                    _type: "attribute",
                    _characterid: obj.id,
                });
                _.each(meleeDamage, function(meleedmg) {
                    meleedmg.set("current", weaponDamage);
                })
            });
        }

        if (type == "offhand" || type == "Offhand") {

            _.each(targetMatched, function(obj) {
                var offhandWeapon = findObjs({
                    name: "MeleeOffWeapon",
                    _type: "attribute",
                    _characterid: obj.id,
                });

                _.each(offhandWeapon, function(offhandwpn) {
                    offhandwpn.set("current", weaponName);
                });

                var offhandAttack = findObjs({
                    name: "MeleeOffAttack",
                    _type: "attribute",
                    _characterid: obj.id,
                });

                _.each(offhandAttack, function(offhandatt) {
                    offhandatt.set("current", weaponAttackBonus);
                });

                var offhandDamage = findObjs({
                    name: "MeleeOffDamage",
                    _type: "attribute",
                    _characterid: obj.id,
                });

                _.each(offhandDamage, function(offhanddmg) {
                    offhanddmg.set("current", weaponDamage);
                });

            });
        }
        else {
            if (type == "ranged" || type == "Ranged") {
                _.each(targetMatched, function(obj) {
                    var rangedWeapon = findObjs({
                        name: "RangedWeapon",
                        _type: "attribute",
                        _characterid: obj.id,
                    });
                    _.each(rangedWeapon, function(rangedwpn) {
                        rangedwpn.set("current", weaponName);
                    });

                    var rangedAttack = findObjs({
                        name: "RangedAttack",
                        _type: "attribute",
                        _characterid: obj.id,
                    });
                    _.each(rangedAttack, function(rangeatt) {
                        rangedatt.set("current", weaponAttackBonus);
                    });

                    var rangedDamage = findObjs({
                        name: "RangedDamage",
                        _type: "attribute",
                        _characterid: obj.id,
                    });
                    _.each(rangedDamage, function(rangeddmg) {
                        rangeddmg.set("current", weaponDamage);
                    });

                });
            }
        }
    }
});
