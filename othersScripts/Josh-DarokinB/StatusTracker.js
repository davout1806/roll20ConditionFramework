/* ***********  STATUS TRACKER  *********************************************
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 *
 *   The purpose of this script is to track character and token status
 *   as well as durations of the status, with a reminder given on each turn.
 *   It allows the GM to manimpulate the controls, while players can only test
 *   their characters current status, if the GM allows it. It will use basic
 *   API commands.
 *   Please Note: This script will lock up one of the indicators on a token
 *   to show a character is under a specific effect. You can change which
 *   indicator to your preference.
 *
 *   Commands:
 *   !StatusAdd <status name> <duraction, -1 for perm> <description>
 *   !cStatusAdd <targetname> <status name> <duration, -1 for perm> <description> <GM Only Flag> // <marker name>
 *   !StatusDel <targetname> <status name>
 *   !StatusAll
 *   !StatusClearAll
 *
 *   For ease of use, add the following to a macro and assign it to your macro bar:

 *   !StatusAdd ?(Status name) ?(Status Duration, -1 for perm) ?(Status description) ?(Type GM for GM only) // ?(Status Indicator [default is purple])

 *   NOTE: If you end the command with GM, only the GM will be able to see the
 *   reminder.
 *
 *   NOTE: Names cannot contain spaces, but it searches for containing so for
 *   'Hank the Dwarf' you can put !Status Hank Bless 10
 *
 *****************************************************************************/
//Storage location
state.activeStatus = state.activeStatus || [];

var StatusTracker = StatusTracker || {};

//Personal Settings
StatusTracker.statusIndicator = "purple"; //default marker if DM does not designate one
StatusTracker.Chat = true;  //Uses chat window to give indicators
StatusTracker.ChatDescriptions = true; //displays descriptions
StatusTracker.ChatOnlyGM = false; //All chat only goes to the gm
StatusTracker.currentTurn = ""; //The current tokens turn
StatusTracker.bloodiedTintColor = "#FF0000"; //If you want a creature's token to be tinted when below 1/2 hp (bar1_value), 'transparent' for none.
StatusTracker.bloodiedMarker = "none"; //If you want a creature's token to get marked when below 1/2 hp (bar1_value), 'none' for none.
StatusTracker.deadMarker = "dead"; //Marker to show if the token is dead (0 bar1_value)

//Adding a status to the tracker
StatusTracker.AddStatus = function (CharID, statusName, statusDescript, Duration, GMOnly, Marker) {
    if (CharID == "") return; //Don't add empty statuses

    state.activeStatus.push({
        'CharID': CharID,
        'statusName': statusName,
        'statusDescript': statusDescript,
        'Duration': Duration,
        'GMOnly': GMOnly,
        'Marker': Marker
    });

    StatusTracker.addMarker(CharID, Marker);
    //StatusTracker.updateStatusMarkers();
};

StatusTracker.addMarker = function(CharID, Marker) {
    //Find the token with the ID: non-linked tokens
    var currChar;
    currChar = findObjs({
        _type: "graphic",
        _id: CharID,
        _pageid: Campaign().get("playerpageid")
    });

    //If CharID was not a token ID, it will result in a null. Now it checks
    //for a character page reference, and then links it to all the
    //tokens in the campaign linked to that character
    if (currChar[0] == undefined || currChar[0].get("represents") !== "") {
        currChar = findObjs({
            _type:"graphic",
            represents: CharID
        });
    }

    _.each(currChar, function(obj) {
        obj.set("statusmarkers", StatusTracker.addMarkerToString(obj.get("statusmarkers"), Marker));
    });
};

//Removes a marker of the listed type if it is present
StatusTracker.delMarker = function(CharID, Marker) {
    //Find the token with the ID: non-linked tokens
    var currChar;
    currChar = findObjs({
        _type: "graphic",
        _id: CharID,
        _pageid: Campaign().get("playerpageid")
    });

    //If CharID was not a token ID, it will result in a null. Now it checks
    //for a character page reference, and then links it to all the
    //tokens in the campaign linked to that character
    if (currChar[0] == undefined) {
        currChar = findObjs({
            _type: "graphic",
            represents: CharID
        });
    }

    _.each(currChar, function(obj){
        var returnString = StatusTracker.delMarkerFromString(obj.get("statusmarkers"), Marker);
        obj.set("statusmarkers", returnString);
    });
};

StatusTracker.addMarkerToString = function(Original, AddMarker){
    var splitOriginal = Original.split(",");
    var maxLoops = splitOriginal.length;
    var loop = 0;
    var Added = false;

    while (loop < maxLoops && Added == false) {
        if (splitOriginal[loop].indexOf(AddMarker) !== -1){
            //Handle multiple instances

            //already has more than one
            if(splitOriginal[loop].indexOf("@") !== -1) {
                var num = Number(splitOriginal[loop].substr(splitOriginal[loop].length - 1));
                num += 1;
                splitOriginal[loop] = splitOriginal[loop].substr(0,splitOriginal[loop].length - 1) + num;
                Added = true;
            }

            //already has it but not at multiple, first check to make sure not added
            //above, then add 1 more
            if(Added == false) {
                splitOriginal[loop] = splitOriginal[loop] + "@2";
                Added = true;
            }
        }
        loop += 1;
    }

    if (Added == false ) {
        return Original + "," + AddMarker;
    } else {
        return splitOriginal.join();
    }
};

StatusTracker.delMarkerFromString = function(Original, delMarker) {
    var splitOriginal = Original.split(",");
    var maxLoops = splitOriginal.length;
    var loop = 0;
    var Deleted = false;

    while (loop < maxLoops && Deleted == false) {
        if (splitOriginal[loop].indexOf(delMarker) !== -1){

            //already has more than one
            if(splitOriginal[loop].indexOf("@") !== -1) {
                var num = Number(splitOriginal[loop].substr(splitOriginal[loop].length - 1));
                //Lowers the count down
                num -= 1;

                //tests for solitary remaining
                if (num == 1 ) {
                    splitOriginal[loop] = splitOriginal[loop].substr(0,splitOriginal[loop].length - 2);
                } else {
                    splitOriginal[loop] = splitOriginal[loop].substr(0,splitOriginal[loop].length - 1) + num;
                }
                Deleted = true;
            }

            //Matches but there are not multiple, removes instance
            if (Deleted == false) {
                splitOriginal.splice(loop,1);
                Deleted = true;
            }
        }
        loop += 1;
    }
    return splitOriginal.join();
};

StatusTracker.getTokenName = function(CharID) {
    var Chars;
    var name;
    if (CharID == "") return "";

    //if Update character tokens
    Chars = findObjs({
        _type: "graphic",
        represents: CharID
    });

    if (Chars.length > 0 ) {
        name = Chars[0].get("name");
    }

    //if CharID is a token, turn on the status indicator for the token
    Chars = findObjs({
        _type: "graphic",
        _id: CharID
    });

    if (Chars.length > 0 ) {
        name = Chars[0].get("name");
    }

    return name;
};

StatusTracker.DelStatus = function(CharID, statusName){
    var loop = 0;
    var maxLoops = state.activeStatus.length;

    while (loop < maxLoops) {
        if (state.activeStatus[loop].statusName == statusName && state.activeStatus[loop].CharID == CharID) {
            //Message
            message = state.activeStatus[loop].statusName + " ends.";
            StatusTracker.sendMessage(message, state.activeStatus.GMOnly, state.activeStatus[loop].statusDescript);

            //Remove the relevant marker
            StatusTracker.delMarker(state.activeStatus[loop].CharID, state.activeStatus[loop].Marker);

            state.activeStatus.splice(loop,1);
            loop = loop - 1;
            maxLoops = maxLoops - 1;
        }
        loop = loop + 1;
    }
};

StatusTracker.sendMessage = function(message, GMOnly, description) {
    if (StatusTracker.Chat == false) return;

    if (GMOnly == true || StatusTracker.ChatOnlyGM == true) {
        message = "/w gm " + message;
    }
    else
    {
        message = "/desc " + message;
    }

    if (StatusTracker.ChatDescriptions == true && description != "") {
        message = message + " (" + description + ")";
    }
    sendChat("", message);

};

StatusTracker.newTurn = function(CharID) {
    //loops through all durations and effects ones on the current character/token
    var loop = 0;
    var maxLoops = state.activeStatus.length;

    if (maxLoops == 0) return;

    while (loop < maxLoops) {
        //Decrement Duration
        var Duration = Number(state.activeStatus[loop].Duration || 1);

        // A -1 Duration is permanent, the current token/character's statuses are
        // increments for the next round.
        if (Duration > 0 && state.activeStatus[loop].CharID == CharID) {
            state.activeStatus[loop].Duration = Duration - 1;
        }

        //Still active, announced
        if (Duration > 1 && state.activeStatus[loop].CharID == CharID) {
            StatusTracker.sendMessage(StatusTracker.getTokenName(state.activeStatus[loop].CharID) + " " + state.activeStatus[loop].statusName + " for " + (Duration - 1) +
                " more rounds.", state.activeStatus[loop].GMOnly, state.activeStatus[loop].statusDescript);
        }

        //Permanent announced
        if (Duration == -1 && state.activeStatus[loop].CharID == CharID) {

            StatusTracker.sendMessage(StatusTracker.getTokenName(state.activeStatus[loop].CharID) + " " + state.activeStatus[loop].statusName + " still.", state.activeStatus[loop].GMOnly, state.activeStatus[loop].statusDescript);
        }

        //Ending effects
        if (Duration <= 1 && Duration !== -1 && state.activeStatus[loop].CharID == CharID) {

            StatusTracker.sendMessage( StatusTracker.getTokenName(state.activeStatus[loop].CharID) + " " + state.activeStatus[loop].statusName + " ends.", state.activeStatus[loop].GMOnly,  state.activeStatus[loop].statusDescript);
            StatusTracker.DelStatus(state.activeStatus[loop].CharID, state.activeStatus[loop].statusName);

            //drop loop by 1 now that there is 1 less object in the array.
            loop = 0;
            maxLoops = state.activeStatus.length;
        }

        loop = loop + 1;
    }

    //StatusTracker.updateStatusMarkers();
};

StatusTracker.getCurrentToken = function() {
    var turn_order = JSON.parse(Campaign().get('turnorder'));

    if (!turn_order.length) {
        return "";
    }

    var turn = turn_order.shift();
    return getObj('graphic', turn.id) || "";
};

on("change:campaign:turnorder", function() {
    var status_current_token = StatusTracker.getCurrentToken();

    if (status_current_token == "") return;

    if (status_current_token.id == StatusTracker.currentTurn) return;

    StatusTracker.currentTurn = status_current_token.id;

    if (status_current_token.get("represents") == "" ) {
        StatusTracker.newTurn(status_current_token.id);
    } else {
        StatusTracker.newTurn(status_current_token.get("represents"));
    }

    //StatusTracker.updateStatusMarkers();
});

on("chat:message", function(msg) {
    var cmd = "!StatusAll";

    if (msg.type == "api" && msg.content.indexOf(cmd) !== -1 && msg.who.indexOf("(GM)") !== -1) {
        var loop = 0;
        var maxLoops = state.activeStatus.length;

        while (loop < maxLoops) {
            sendChat("", "/w gm " + StatusTracker.getTokenName(state.activeStatus[loop].CharID) + " " + state.activeStatus[loop].statusName + " for " + state.activeStatus[loop].Duration + " rounds. [" + state.activeStatus[loop].Marker + " marker].");
            loop = loop + 1;
        }
    }
});

on("chat:message", function(msg) {
    var cmd = "!StatusClearAll";

    if (msg.type == "api" && msg.content.indexOf(cmd) !== -1 && msg.who.indexOf("(GM)") !== -1) {
        state.activeStatus = [];
    }

    //StatusTracker.updateStatusMarkers();
});

on("chat:message", function(msg) {
    var cmd = "!StatusAdd ";

    if (msg.type == "api" && msg.content.indexOf(cmd) !== -1 && msg.who.indexOf("(GM)") !== -1) {
        var CharID = "";

        var cleanedMsg = msg.content.replace(cmd, "");

        //Pulls any marker first
        var marker = cleanedMsg.split("// ")[1] || StatusTracker.statusIndicator;
        cleanedMsg = cleanedMsg.split("//")[0];

        //Pulls the effect name
        var statusName = cleanedMsg.split(" ")[0];
        cleanedMsg = cleanedMsg.substr(statusName.length + 1); //Removes the target from the array

        //Pulls the duration
        var Duration = cleanedMsg.split(" ")[0];
        cleanedMsg = cleanedMsg.substr(Duration.length + 1); //Removes the target from the array

        var GMOnly = false;
        if (cleanedMsg.substr(cleanedMsg.length - 2) == "GM") {
            GMOnly = true;
            cleanedMsg = cleanedMsg.substr(0, cleanedMsg.length - 2);
        }

        //The remainder is the description
        var statusDescription = cleanedMsg;

        //Adds the status to each of the selected tokens
        _.each(msg.selected, function (obj){
            //Pulls the selected ID
            token = getObj("graphic", obj._id);

            if (token.get("represents") == "") {
                CharID = token.id;
            } else {
                CharID = token.get("represents");
            }

            if (obj._type == "graphic") { //only if the selected is a token
                StatusTracker.AddStatus(CharID, statusName, statusDescription, Duration, GMOnly, marker);
            }
        })
    }
});

on("chat:message", function(msg) {
    var cmd = "!StatusDel ";

    if (msg.type == "api" && msg.content.indexOf(cmd) !== -1 && msg.who.indexOf("(GM)" !== -1)) {
        var CharID = "";

        var cleanedMsg = msg.content.replace(cmd, "");

        //Pulls the effect name
        var statusName = cleanedMsg.split(" ")[0];
        cleanedMsg.substr(statusName.length + 1); //Removes the target from the array

        _.each(msg.selected, function (obj){
            //Pulls the selected ID
            token = getObj("graphic", obj._id);

            if (token.get("represents") == "") {
                CharID = token._id;
            } else {
                CharID = token.get("represents");
            }

            if (obj._type == "graphic") { //only if the selected is a token
                StatusTracker.DelStatus(CharID, statusName);
            }
        })
    }
});

on("change:graphic", function(obj, prev) {
    if(obj.get("bar1_max") == "") return;

    //If bar1_value did not change, exit
    if(obj.get("bar1_value") == prev["bar1_value"]) return;

    if(obj.get("bar1_value") <= 0) {
        obj.set({
            tint_color: "transparent",
            bar1_value: 0
        });
        StatusTracker.delMarker(obj.id, StatusTracker.bloodiedMarker);
        StatusTracker.addMarker(obj.id, StatusTracker.deadMarker);
    }
    else if(obj.get("bar1_value") <= obj.get("bar1_max") / 2) {
        obj.set({
            tint_color: StatusTracker.bloodiedTintColor
        });
        StatusTracker.delMarker(obj.id, StatusTracker.deadMarker);
        StatusTracker.addMarker(obj.id, StatusTracker.bloodiedMarker);
    }
    else{
        obj.set({
            tint_color: "transparent"
        });
        StatusTracker.delMarker(obj.id, StatusTracker.deadMarker);
        StatusTracker.delMarker(obj.id, StatusTracker.bloodiedMarker);
    }
});