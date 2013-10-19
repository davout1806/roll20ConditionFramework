/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 *
 *  Modifier by Me 2013-10-19
 */
var Combat_Begins = Combat_Begins || {};

Combat_Begins.statName = "Dex"; //Stats to be added to roll, commas between values
Combat_Begins.modifiers = new Array("Initiative-Base"); //Stats to be added to roll, commas between values
Combat_Begins.rollValue = 20; //rolling 1d20, change if you roll 1dXX
Combat_Begins.sendChat = true; //True if you want the chat log to show their results
Combat_Begins.command = Combat_Begins.command || {};

Combat_Begins.command._combatBegins = function (msg) {
    if (msg.type == "api" && msg.who.indexOf("(GM)") !== -1) {

        Campaign().set("initiativepage", true);

        if (Combat_Begins.sendChat == true) {
            sendChat("", "/desc Combat Begins!");
        }

        if (Campaign().get("turnorder") == "") turnorder = []; //NOTE: We check to make sure that the turnorder isn't just an empty string first. If it is treat it like an empty array.
        else turnorder = JSON.parse(Campaign().get("turnorder"));

        var mod = 0;
        var modlist = new Array();

        //Array of all characters on the players map
        var pCharacters = findObjs({
            layer: "objects",
            _type: "graphic",
            _pageid: Campaign().get("playerpageid"),
        }, {caseInsensitive: true});

        _.each(msg.selected, function (selected) {
            modlist.length = 0;
            mod = 0;

            var obj = getObj("graphic", selected._id);

            if (obj.get("represents") != "") {

                var currChar = getObj("character", obj.get("represents"));

                var attribObj = findObjs({
                    name: Combat_Begins.statName,
                    _type: "attribute",
                    _characterid: currChar.id,
                }, {caseInsensitive: true})[0];

                var attribModifier = Number(Math.floor(attribObj.get("current") / 2)) - 5;
                mod += attribModifier;
                modlist.push({name: Combat_Begins.statName, value: attribModifier || 0 });

                _.each(Combat_Begins.modifiers, function (attributeName) {
                    //cycle through each stat and add it to mod
                    var attribObj = findObjs({
                        name: attributeName,
                        _type: "attribute",
                        _characterid: currChar.id,
                    }, {caseInsensitive: true});

                    mod = mod + (Number(attribObj[0].get("current")) || 0);
                    modlist.push({name: attributeName, value: Number(attribObj[0].get("current") || 0) })
                });
            } else {
                mod = 0;
            }

            var rolled = randomInteger(Combat_Begins.rollValue);
            var init = (rolled + mod);
            var string = "";

            if (Combat_Begins.sendChat == true) {

                _.each(modlist, function (obj) {
                    string = string + (" + " + obj.value + " " + obj.name) || "";
                })
                sendChat("", obj.get("name") + " rolled a " + init + " (" + rolled.toString() + " rolled " + string + ")");
            }

            var Added = false;
            var loop = 0;


            //search for if it is existing
            while (loop < turnorder.length && Added == false) {
                if (turnorder[loop].id == selected._id) {
                    turnorder[loop].pr = init;
                    Added = true;
                }
                loop += 1;
            }

            if (Added == false) {//Update the turn order if present, else add it
                turnorder.push({
                    id: selected._id,
                    pr: init,
                });
            }
        });

        //sort turnorder by pr
        turnorder.sort(function(a,b) {
            first = a.pr;
            second = b.pr;

            return second - first;
        });
        //Add a new lists to the turn order
        Campaign().set("turnorder", JSON.stringify(turnorder));

    }
};

Combat_Begins.command._combatEnds = function (msg) {
        Campaign().set("turnorder", false);
        Campaign().set("initiativepage", false);
};

Combat_Begins.command._combatSuspend = function (msg) {
        if (Campaign().get("initiativepage", Campaign().get("playerpageid"))) {
            Campaign().set("initiativepage", false)
        }
        else {
            Campaign().set("initiativepage", Campaign().get("playerpageid"))
        }
};

on("ready", function () {
    if (community == undefined || !("command" in community)) {
        log("You must have community.command installed in a script tab before the tab this script is in to use pigalot.requests.phrases.");
        throw "Can't find community.command!";
    }

    var showCommand = {};
    showCommand.minArgs = 0;
    showCommand.maxArgs = 0;
    showCommand.typeList = [];
    showCommand.typeList = ["str"];
    showCommand.syntax = "!combatBegins";
    showCommand.handle = function (args, who, isGm, msg) {
        if (Davout.Utils.checkForSelectionAndMsgIfNot(msg.selected, "/w gm nothing is selected", false, "") && isGm) {
            Combat_Begins.command._combatBegins(msg);
        }
    };
    community.command.add("combatBegins", showCommand);

    var showCommand = {};
    showCommand.minArgs = 0;
    showCommand.maxArgs = 0;
    showCommand.typeList = [];
    showCommand.typeList = ["str"];
    showCommand.syntax = "!combatEnds";
    showCommand.handle = function (args, who, isGm, msg) {
            Combat_Begins.command._combatEnds(msg);
    };
    community.command.add("combatEnds", showCommand);

    var showCommand = {};
    showCommand.minArgs = 0;
    showCommand.maxArgs = 0;
    showCommand.typeList = [];
    showCommand.typeList = ["str"];
    showCommand.syntax = "!combatSuspend";
    showCommand.handle = function (args, who, isGm, msg) {
        Combat_Begins.command._combatSuspend(msg);
    };
    community.command.add("combatSuspend", showCommand);
});

// AutoInitiative

