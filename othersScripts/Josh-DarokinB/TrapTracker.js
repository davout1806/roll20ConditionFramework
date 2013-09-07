/*
 *  roll20 User: https://app.roll20.net/users/84478/josh
 *  git User:    https://gist.github.com/DarokinB
 */
//Settings
var TrapTracker = TrapTracker || {};

TrapTracker.GMOnly = false; //Only sends notifications to the GM
TrapTracker.Disable = false; //Defaults to enable/disable the system. Chat commands to turn on and off exist.
TrapTracker.TrapPrefix = "xTrap"; //The prefix for traps for the system to search for
TrapTracker.GMName = "DM (GM)";
TrapTracker.accuracy = 5; //The points of intersection that need to be hit to set it off. With 5, about half the square needs to be hit. Min 1;

TrapTracker.convertHTML = function(obj) {
    var tString = obj;
    tString = tString.replace(/%20/g, " ");
    tString = tString.replace(/%21/g, "!");
    tString = tString.replace(/%23/g, "#");
    tString = tString.replace(/%24/g, "$");
    tString = tString.replace(/%25/g, "%");
    tString = tString.replace(/%26/g, "&");
    tString = tString.replace(/%27/g, "'");
    tString = tString.replace(/%28/g, "(");
    tString = tString.replace(/%29/g, ")");
    tString = tString.replace(/%2A/g, "*");
    tString = tString.replace(/%2B/g, "+");
    tString = tString.replace(/%2C/g, ",");
    tString = tString.replace(/%2D/g, "-");
    tString = tString.replace(/%2E/g, ".");
    tString = tString.replace(/%2F/g, "/");
    tString = tString.replace(/%3A/g, ":");
    tString = tString.replace(/%3B/g, ";");
    tString = tString.replace(/%3C/g, "<");
    tString = tString.replace(/%3D/g, "=");
    tString = tString.replace(/%3E/g, ">");
    tString = tString.replace(/%3F/g, "?");
    tString = tString.replace(/%40/g, "@");
    tString = tString.replace(/%5B/g, "[");
    tString = tString.replace(/%5C/g, "\ ");
    tString = tString.replace(/%5D/g, "]");
    tString = tString.replace(/%5E/g, "^");
    tString = tString.replace(/%5F/g, "_");
    tString = tString.replace(/%7B/g, "{");
    tString = tString.replace(/%7C/g, "|");
    tString = tString.replace(/%7D/g, "}");
    tString = tString.replace(/%7E/g, "~");
    tString = tString.replace(/<div>/g, "\n");
    tString = TrapTracker.removeDivs(tString);
    return tString;
}

TrapTracker.removeDivs = function(obj) {
    var string = obj;
    var left = string.indexOf("<");
    var right = string.indexOf(">");

    if ((left == -1 || right == -1)) return string;

    return TrapTracker.removeDivs(string.substr(0, left) + string.substr(right + 1));
}

on("change:graphic", function(obj, prev) {
    if ((obj.get("left") == prev["left"]) && obj.get("top") == prev["top"]) return; //Exit if no movement.

//searches for all traps, and checks to see if the moved token passed over the trap
    var Traps = findObjs({
        _type: "graphic",
        layer: "gmlayer",
        _pageid: Campaign().get("playerpageid"),
    });
    _.each(Traps, function(trap) {
        if (trap.get("name").indexOf(TrapTracker.TrapPrefix) == -1) return; //ignores non-traps
        if (trap.get("left") == prev["left"] && trap.get("top") == prev["top"]) return; //ignore if leaving trap

        if (TrapTracker.stepTest(obj, trap, prev) == true) {
            var string = TrapTracker.convertHTML(trap.get("gmnotes"));
            sendChat(TrapTracker.GMName, string);
        }
    });
});

TrapTracker.stepTest = function(token, trap, prev) {
    //First, draw a polygon based on the path traveled
    var PathTraveled = [];
    PathTraveled.push({x: token.get("left"), y: token.get("top")}); //current top left
    PathTraveled.push({x: token.get("left") + token.get("width"), y: token.get("top")}); //current top right
    PathTraveled.push({x: prev["left"], y: prev["top"]}); //old top left
    PathTraveled.push({x: prev["left"] + token.get("width"), y: prev["top"]}); //old top right
    PathTraveled.push({x: prev["left"] + token.get("width"), y: prev["top"] + token.get("height")}); //old bottom right
    PathTraveled.push({x: prev["left"], y: prev["top"] + token.get("height")}); //old bottom left
    PathTraveled.push({x: token.get("left") + token.get("width"), y: token.get("top") + token.get("height")}); //current bottom right
    PathTraveled.push({x: token.get("left"), y: token.get("top") + token.get("height")}); //current bottom left



    //remove two points that are not needed because they are inside the polygon
    var highestX = PathTraveled[0].x;
    var highestY = PathTraveled[0].y;
    var lowestX = PathTraveled[0].x;
    var lowestY = PathTraveled[0].y;

    var i = 0;

    while (i < 8) {
        if (PathTraveled[i].x < lowestX) { lowestX = PathTraveled[i].x };
        if (PathTraveled[i].x > highestX) { highestX = PathTraveled[i].x };
        if (PathTraveled[i].y < lowestY) { lowestY = PathTraveled[i].y };
        if (PathTraveled[i].y > highestY) { highestY = PathTraveled[i].y };
        i += 1;
    }

    //remove the non-max/min points (they are in the center of the polygon)
    i = 0;
    while (i < 8) {
        if (PathTraveled[0].x < highestX && PathTraveled[0].x > lowestX && PathTraveled[0].y < highestY && PathTraveled[0].y > lowestY) {
            PathTraveled.pop() // removes the point
        } else {
            PathTraveled.push(PathTraveled.pop()); //takes the first point and adds it to the end.
        }
        i += 1;
    }

    //Sort the points clockwise with a center point
    //centerpoint to focus on
    var Origin = {
        x: (highestX - lowestX ) / 2 + lowestX,
        y: (highestY - lowestY) / 2 + lowestY,
    };

    PathTraveled.sort( function(a,b) {
        var angle1 = Math.atan2(a.y - Origin.y, a.x - Origin.x);
        var angle2 = Math.atan2(b.y - Origin.y, b.x - Origin.x);

        if(angle1 < angle2) return 1;
        else if (angle2 > angle1) return -1;
        return 0;
    });

    var trapPt = {};
    var trapCurrX = trap.get("left");
    var trapCurrY = trap.get("top");
    var trapWidth = trap.get("width");
    var trapHeight = trap.get("height");

    var intersects = 0;

    while (trapCurrX <= trap.get("left") + trapWidth) {
        while (trapCurrY <= trap.get("top") + trapHeight) {
            trapPt = {x: trapCurrX, y: trapCurrY};
            if (TrapTracker.subStepTest(PathTraveled, trapPt)) { intersects += 1; }
            log(trapCurrX + ", " + trapCurrY)
            trapCurrY += 35; // 1/2 square increments, the accuracy decides how many must be crossed to set it off
        }
        trapCurrX += 35;
        trapCurrY = trap.get("top");
    }

    if (TrapTracker.accuracy <= intersects) {
        return true;
    } else {
        return false;
    }
}

TrapTracker.subStepTest = function(poly, pt) {
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);

    return c;
}
