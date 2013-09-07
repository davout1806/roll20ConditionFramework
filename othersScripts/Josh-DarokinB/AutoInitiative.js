/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 */
var Combat_Begins = Combat_Begins || {};

Combat_Begins.fourth_ed = false; //If using 4th edition, it takes 1/2 'Level' and adds it for initiative
Combat_Begins.statName = new Array ("Dex"); //Stats to be added to roll, commas between values
Combat_Begins.rollValue = 20; //rolling 1d20, change if you roll 1dXX
Combat_Begins.sendChat = true; //True if you want the chat log to show their results

on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!CombatBegins") !== -1 && msg.who.indexOf("(GM)") !== -1) {

        Campaign().set("initiativepage", true );

        if (Combat_Begins.sendChat == true) {
            sendChat("", "/desc Combat Begins!");
        }

        if(Campaign().get("turnorder") == "") turnorder = []; //NOTE: We check to make sure that the turnorder isn't just an empty string first. If it is treat it like an empty array.
        else turnorder = JSON.parse(Campaign().get("turnorder"));

        var mod = 0;
        var modlist = new Array();

        //Array of all characters on the players map
        var pCharacters = findObjs({
            layer: "objects",
            _type: "graphic",
            _pageid: Campaign().get("playerpageid"),
        }, {caseInsensitive: true});

        _.each(msg.selected, function(selected) {
            modlist.length = 0;
            mod = 0;

            var obj = getObj("graphic", selected._id);

            if (obj.get("represents") != "") {

                var currChar = getObj("character", obj.get("represents"));

                _.each(Combat_Begins.statName, function(stat) {
                    //cycle through each stat and add it to mod
                    var modifier = findObjs({
                        name: stat,
                        _type: "attribute",
                        _characterid: currChar.id,
                    }, {caseInsensitive: true});

                    if (modifier.length !== 0 ) {
                        if (Combat_Begins.fourth_ed == true && modifier.get("name") == "Level") {
                            mod = mod + (Number(floor(modifier[0].get("current") / 2)))
                            modlist.push({name: stat, value: Number(floor(modifier[0].get("current") / 2)) })
                        } else {
                            mod = mod + (Number(modifier[0].get("current")) || 0);
                            modlist.push({name: stat, value: Number(modifier[0].get("current") || 0) })
                        }
                    }
                });
            } else {
                mod = 0;
            }

            var rolled = randomInteger(Combat_Begins.rollValue);
            var init = (rolled + mod);
            var string = "";

            if (Combat_Begins.sendChat == true ) {

                _.each(modlist, function(obj) {
                    string = string + (" + " + obj.value + " " + obj.name) || "";
                })
                sendChat("",  obj.get("name") + " rolled a " + init + " (" + rolled.toString() + " rolled " + string + ")");
            }

            var Added = false;
            var loop = 0;


            //search for if it is existing
            while (loop < turnorder.length && Added == false){
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

    if (msg.type == "api" && msg.content.indexOf("!CombatEnds") !== -1) {

        Campaign().set("turnorder", false );
        Campaign().set("initiativepage", false );
        if (MovementTracker.MovementTracker == true) { ResetAllPins() };
    };

    if (msg.type == "api" && msg.content.indexOf("!CombatSuspend") !== -1) {

        var initTracker = "";
        if (Campaign().get("initiativepage", Campaign().get("playerpageid") ) ) { Campaign().set("initiativepage", false ) }
        else { Campaign().set("initiativepage", Campaign().get("playerpageid") ) };

    };
});