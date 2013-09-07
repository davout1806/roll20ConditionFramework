/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 */

on("change:attribute", function(obj, prev) {
    if(obj.get("name") !== "HP") return;
    var damageTaken = 0;
    var currentHp =0;
    var oldHp = 0;
    var max = 0;
    var charName = getObj("character", obj.get("_characterid"));

    currentHp = obj.get("current");
    oldHp = prev["current"];
    max = obj.get("max");
    if (currentHp > max) {
        currentHp = max;
        obj.set("current", currentHp);
    }
    damageTaken = currentHp - oldHp;


    if (damageTaken < 0 ) {
        sendChat(charName.get("name"), "/me has taken " + -1 * damageTaken + " damage");
    }

    if (damageTaken > 0 ) {
        sendChat(charName.get("name"), "/me has healed " + damageTaken + " damage");
    }
});

on("change:graphic:bar1_value", function(obj, prev) {
    //Ignores players, handled above
    if(obj.get("represents") != "") return;
    if (Campaign().get("initiativepage") == false) return;

    var damageTaken = 0;
    var currentHp =0;
    var oldHp = 0;
    var max = 0;
    var charName = obj.get("name");

    currentHp = obj.get("bar1_value");
    oldHp = prev["bar1_value"];
    max = obj.get("bar1_max");
    if (currentHp > max) {
        currentHp = max;
        obj.set("bar1_value", currentHp);
    }
    damageTaken = currentHp - oldHp;

    if (damageTaken < 0 ) {
        sendChat(charName, "/me has taken " + -1 * damageTaken + " damage");
    }

    if (damageTaken > 0 ) {
        sendChat(charName, "/me has healed " + damageTaken + " damage");
    }
});