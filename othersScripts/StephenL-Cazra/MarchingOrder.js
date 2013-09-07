/*
 *  roll20 User: https://app.roll20.net/users/46544/stephen-l
 *  git User:    https://gist.github.com/Cazra/
 */

/**
 * A set of chat commands used to specify a marching order.
 * When a token moves, the one behind it in the marching order will move to its
 * former location recursively.
 *
 * The following commands are available:
 * !follow [myTokName], [leaderName]    Tells your token specifed by myTokName
 *              to follow another token specified by leaderName.
 * !unfollow [myTokName]   Makes your token stop following other tokens.
 *              You can also have a token stop following another token just by
 *              moving it. Any tokens behind yours will still follow yours.
 * !march [list of token names separated by commas]     GM-only:
 *              Specify a marching order for a list of tokens from front to back.
 * !unmarch [leaderName]    GM-only:
 *              Tell a token and all of the tokens following behind it to stop
 *              following each other.
 * !clearFollow     Clears the following link data for all tokens on the
 *              current page.
 */

/** Clears all following data for tokens on the current page. */
var clearFollowCmd = function(msg) {
    var curPageID = findObjs({_type: "campaign"})[0].get("playerpageid");
    var characters = findObjs({_type: "graphic", layer: "objects", _pageid: curPageID});
    for(var i in characters) {
        var character = characters[i];
        _unfollow(character);
    }

    sendChat(msg.who, "clear follow");
}


/** Command one of your tokens to follow another token. */
var followCmd = function(msg, myTokenName, prevTokenName) {
    var myToken = getToken(myTokenName);
    if(!myToken) {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " not found.")
        return;
    }
    var prevToken = getToken(prevTokenName);
    if(!prevToken) {
        sendChat(msg.who, "/w " + msg.who + " " + prevTokenName + " not found.")
        return;
    }

    // You may only tell a token you control to follow another token.
    if(myToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) !== -1 || msg.who.indexOf("(GM)") !== -1) {
        _followCmd(prevToken, myToken);
        sendChat(msg.who, "/em : " + myTokenName + " is following " + prevTokenName);
    }
    else {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " does not belong to you!");
    }
}

/** Helper function: Makes one token follow another token. */
var _followCmd = function(prev, cur) {
    if(!prev || !cur) {
        return;
    }

    // unbind all of cur's following links.
    _unfollowCmd(cur);

    var next = prev.nextToken;
    cur.prevToken = prev;
    cur.nextToken = next;

    prev.nextToken = cur;
    if(next) {
        next.prevToken = cur;
    }

}



/** Tells all of your character tokens to stop following other tokens. */
var unfollowCmd = function(msg, myTokenName) {
    var myToken = getToken(myTokenName);
    if(!myToken) {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " not found.")
        return;
    }

    // You may only tell a token you control to stop following another token.
    if(myToken.get("controlledby").indexOf(getPlayer(msg.who).get("_id")) !== -1 || msg.who.indexOf("(GM)") !== -1) {
        _unfollowCmd(myToken);
    }
    else {
        sendChat(msg.who, "/w " + msg.who + " " + myTokenName + " does not belong to you!");
    }

    sendChat(msg.who, "/em stepped out of marching order. ");
}

/** Helper method for making a character token stop following another token and stopped being followed by another token. */
var _unfollowCmd = function(token) {
    if(token.prevToken) {
        token.prevToken.nextToken = token.nextToken;
    }
    if(token.nextToken) {
        token.nextToken.prevToken = token.prevToken;
    }

    token.prevToken = null;
    token.nextToken = null;

}


/** Create a marching order from a comma-separated list of token names. */
var marchCmd = function(msg, targets) {
    var targetsArr = targets.split(",");
    var tokens = new Array();

    // make the tokens follow in the order given.
    var prev = null;
    for(var i in targetsArr) {
        var token = getToken(trimString(targetsArr[i]));
        if(!token) {
            sendChat(msg.who, "/w gm Cannot march. Bad token name: " + targetsArr[i]);
        }

        if(prev) {
            _followCmd(prev, token);
        }
        prev = token;
    }

    sendChat(msg.who, "/w gm Marching " + targets);
}


/** Disband a marching order by specifying its leader. */
var unmarchCmd = function(msg, leader) {
    var token = getToken(leader);
    if(!token) {
        sendChat(msg.who, "/w gm Cannot unmarch. Bad token name: " + leader);
    }

    while(token.nextToken) {
        var tokenNext = token.nextToken;
        _unfollowCmd(token);
        token = tokenNext;
    }

    sendChat(msg.who, "/w gm Disbanded " + leader + "'s marching line. ");
}


/** Interpret the chat commands. */
on("chat:message", function(msg) {
    var cmdName;
    var msgTxt;

    cmdName = "!clearFollow";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        clearFollowCmd(msg);
    }

    cmdName = "!follow ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);
        if(targetName.indexOf(",") == -1) {
            sendChat(msg.who, "/w " + msg.who + " must specify two comma-separated token names for !follow command.")
        }
        else {
            var targets = targetName.split(",");
            var me = trimString(targets[0]);
            var infront = trimString(targets[1]);
            followCmd(msg, me, infront);
        }
    }

    cmdName = "!unfollow ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);
        unfollowCmd(msg, targetName);
    }


    cmdName = "!march ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targets = msgTxt.slice(cmdName.length);
        marchCmd(msg, targets);
    }

    cmdName = "!unmarch ";
    msgTxt = msg.content;
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);
        unmarchCmd(msg, targetName);
    }
});


/** Do the marching order effect when the leader tokens move! */
on("change:graphic", function(obj, prev) {
    var prevToken = obj;
    var curToken = prevToken.nextToken;
    prevToken.prevLeft = prev["left"];
    prevToken.prevTop = prev["top"];

    // We stepped out of line. Stop following the guy in front of us.
    if(prevToken.prevToken) {
        prevToken.prevToken.nextToken = null;
        prevToken.prevToken = null;
    }

    // move everyone to the previous position of the token in front of them.
    while(curToken) {
        curToken.prevLeft = curToken.get("left");
        curToken.prevTop = curToken.get("top");

        curToken.set("left",prevToken.prevLeft);
        curToken.set("top",prevToken.prevTop);

        prevToken = curToken;
        curToken = curToken.nextToken;

        // avoid cycles.
        if(curToken == obj) {
            return;
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