/*
 *  roll20 User: https://app.roll20.net/users/46544/stephen-l
 *  git User:    https://gist.github.com/Cazra/
 */

/**
 * A set of chat commands used to set tokens to carry other tokens.
 * When a token moves, the any tokens it is carrying move to its new location.
 *
 * The following commands are available:
 * !carry [carrierName], [carriedName']  Tells your token specified by carrierName
 *              to carry another token. The carried token will remain in place
 *              uder the carrier token.
 * !drop [carrierName], [carriedName]   Tells your token to drop a carried token.
 * !dropAll [carrierName]       Tells your token to drop all carried tokens.
 */


/** Command one of your tokens to carry another token. */
var carryCmd = function(msg, myTokenName, carriedName) {
    var myToken = getToken(myTokenName);
    if(!myToken) {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " not found.")
        return;
    }
    var carriedToken = getToken(carriedName);
    if(!carriedToken) {
        sendChat(msg.who, "/w " + msg.who + " " + carriedName + " not found.")
        return;
    }

    // You must be in control of your token and the carried token.
    if((myToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) !== -1) || msg.who.indexOf("(GM)") !== -1) {
        if(carriedToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) || msg.who.indexOf("(GM)") !== -1) {
            _carryCmd(myToken, carriedToken);
            sendChat(msg.who, "/em : " + myTokenName + " is carrying " + carriedName);
        }
        else {
            sendChat(msg.who, "/w " + msg.who + " " + carriedName + " does not belong to you!");
        }
    }
    else {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " does not belong to you!");
    }
}

var _carryCmd = function(myToken, carriedToken) {
    // lazily make the list of carried tokens if it doesn't already exist.
    if(!myToken.carryList) {
        myToken.carryList = new Array();
    }

    myToken.carryList.push(carriedToken);
}

/** Command one of your tokens to stop carrying another token. */
var dropCmd = function(msg, myTokenName, carriedName) {
    var myToken = getToken(myTokenName);
    if(!myToken) {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " not found.")
        return;
    }
    var carriedToken = getToken(carriedName);
    if(!carriedToken) {
        sendChat(msg.who, "/w " + msg.who + " " + carriedName + " not found.")
        return;
    }

    // You must be in control of your token and the carried token.
    if((myToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) !== -1) || msg.who.indexOf("(GM)") !== -1) {
        if(carriedToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) !== -1 || msg.who.indexOf("(GM)") !== -1) {
            _dropCmd(myToken, carriedToken);
            sendChat(msg.who, "/em : " + myTokenName + " dropped " + carriedName);
        }
        else {
            sendChat(msg.who, "/w " + msg.who + " " + carriedName + " does not belong to you!");
        }
    }
    else {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " does not belong to you!");
    }
}

/** Command one of your tokens to stop carrying any tokens. */
var dropAllCmd = function(msg, myTokenName) {
    var myToken = getToken(myTokenName);
    if(!myToken) {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " not found.")
        return;
    }
    if(!myToken.carryList) {
        return;
    }

    // Iterate through a copy of our list instead of the actual list.
    var arrCopy = new Array();
    for(var i in myToken.carryList) {
        arrCopy.push(myToken.carryList[i]);
    }

    // You must be in control of your token and the carried token.
    if((myToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) !== -1) || msg.who.indexOf("(GM)") !== -1) {
        for(var i in arrCopy) {
            var carriedToken = arrCopy[i];
            log(carriedToken);
            _dropCmd(myToken, carriedToken);
            sendChat(msg.who, "/em : " + myTokenName + " dropped " + carriedToken.get("name"));
        }
    }
    else {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " does not belong to you!");
    }
}

var _dropCmd = function(myToken, carriedToken) {
    if(!myToken.carryList) {
        return;
    }
    var index = myToken.carryList.indexOf(carriedToken);
    if(index !== -1) {
        myToken.carryList.splice(index, 1);
    }
}



/** Interpret the chat commands. */
on("chat:message", function(msg) {
    var cmdName;
    var msgTxt;


    cmdName = "!carry ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);
        if(targetName.indexOf(",") == -1) {
            sendChat(msg.who, "/w " + msg.who + " must specify two comma-separated token names for !carry command.")
        }
        else {
            var targets = targetName.split(",");
            var me = trimString(targets[0]);
            var carried = trimString(targets[1]);
            carryCmd(msg, me, carried);
        }
    }


    cmdName = "!drop ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);
        if(targetName.indexOf(",") == -1) {
            sendChat(msg.who, "/w " + msg.who + " must specify two comma-separated token names for !drop command.");
        }
        else {
            var targets = targetName.split(",");
            var me = trimString(targets[0]);
            var carried = trimString(targets[1]);
            dropCmd(msg, me, carried);
        }
    }

    cmdName = "!dropAll ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);
        dropAllCmd(msg, targetName);
    }


});


/** Do the carrying logic when the carrier tokens move. */
on("change:graphic", function(obj, prev) {


    if(obj.carryList) {
        for(var i in obj.carryList) {
            var carried = obj.carryList[i];
            carried.set("left", obj.get("left"));
            carried.set("top", obj.get("top"));
        }
    }

});


////// Utility functions:

/**
 * Gets a player object for a given player name.
 */
var getPlayer = function(playerName) {
    if(playerName.indexOf(" (GM)") !== -1) {
        playerName = playerName.slice(0, playerName.length - 5)
    }
    return findObjs({_type: "player", _displayname: playerName})[0];
}


/**
 * Gets a token on the current map by name.
 */
var getToken = function(tokenName) {
    var curPageID = findObjs({_type: "campaign"})[0].get("playerpageid");
    return findObjs({_type: "graphic", layer: "objects", _pageid: curPageID, name: tokenName})[0];
}



/** Trims a string */
var trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}