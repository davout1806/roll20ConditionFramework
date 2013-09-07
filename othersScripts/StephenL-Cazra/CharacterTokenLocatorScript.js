/*
 *  roll20 User: https://app.roll20.net/users/46544/stephen-l
 *  git User:    https://gist.github.com/Cazra/
 */

// This is a script for a chat command that can be used to find a character
// token you've misplaced on the map. It can work two ways:
// You can specify a token by name, say "Dave the Dwarf", with
// !find Dave the Dwarf
// or you can find the token for your character with
// !find me
//
// How it works is it generates a very large temporary aura on the token.
// The aura shrinks and you can follow it in.
//
// It will preserve and restore the old state of the aura from
// before it was used with this script.
//

on("chat:message", function(msg) {
    var cmdName = "!find ";
    var msgTxt = msg.content;
    var curPageID = findObjs({_type: "campaign"})[0].get("playerpageid");
    var curPage = findObjs({_type: "page", _id: curPageID})[0];

    // Finds all objects-layer tokens on the current page and makes them reverse-ping.
    var findTokenByName = function(tokName) {
        var tokens = findObjs({_type: "graphic", layer:"objects", _pageid: curPageID, name: tokName});

        for(var i in tokens) {
            var token = tokens[i];

            // save the aura state so we can restore it later.
            var oldAuraRadius = token.get("aura1_radius");
            var oldAuraSquare = token.get("aura1_square");
            var oldAuraShow = token.get("showplayers_aura1");
            var oldAuraEdit = token.get("playersedit_aura1");

            // Figure out the initial radius of the shrinking aura to barely fit the grid.
            var pageWidth = curPage.get("width")*curPage.get("scale_number");
            var pageHeight = curPage.get("height")*curPage.get("scale_number");
            var x = token.get("left")/70.0*curPage.get("scale_number");
            if(curPage.get("width")/2 > x ) {
                x = curPage.get("width") - x;
            }
            var y = token.get("top")/70.0*curPage.get("scale_number");
            if(curPage.get("height")/2 > y) {
                y = curPage.get("width") - y;
            }

            var maxPageSide = Math.max(x, y);
            var radius = Math.floor(Math.sqrt(2*(maxPageSide*maxPageSide)));

            // animation shrinks the aura down from a really big aura.
            var interval = setInterval(function() {
                if(radius <= 0) {
                    token.set("aura1_radius", oldAuraRadius);
                    token.set("aura1_square", oldAuraSquare);
                    token.set("showplayers_aura1", oldAuraShow);
                    token.set("playersedit_aura1", oldAuraEdit);
                    clearInterval(interval);
                }
                else {
                    token.set("aura1_radius", radius);
                    token.set("aura1_square", false);
                    token.set("showplayers_aura1", false);
                    token.set("playersedit_aura1", true);
                    radius -= curPage.get("scale_number")*2;
                }
            }, 500);
        }
    }



    // Did we enter our "find" command in the chat?
    if(msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
        var targetName = msgTxt.slice(cmdName.length);

        // we're finding the token for YOUR character.
        if(targetName === "me") {
            // figure out which player is "me"
            var playerName = msg.who;
            if(playerName.indexOf(" (GM)") !== -1) {
                playerName = playerName.slice(0, playerName.length - 5)
            }
            var player = findObjs({_type: "player", _displayname: playerName})[0];

            // figure out the name of that player's character. Assume that's
            // also the name of their token.
            var characters = findObjs({_type: "character"});
            for(var i in characters) {
                var character = characters[i];
                findTokenByName(character.get("name"));
            }
        }

        // we're finding a token by name.
        else {
            findTokenByName(targetName);
        }
    }
});

