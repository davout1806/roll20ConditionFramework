/*
 *  roll20 User: https://app.roll20.net/users/6419/joshuha-o
 *  git User:    https://gist.github.com/joshuha
 */
/*
 * KD Tree Javascript Implementation
 * Credit to https://github.com/jacobmarble/Lechosa/blob/master/kdtree/kdtree.js
 */
function KdTree(nodes, northSouth) {
    if (nodes == null || nodes.length == 0) {
        // This is an empty tree.
        this.northSouth = false;
        this.position = null;
        this.search = function(positionToFind) {
            return null;
        }

        return;
    }

    this.northSouth = northSouth !== true;

    if (this.northSouth === true) {
        nodes.sort(function(a,b) { return a[1] - b[1]; });
    } else {
        nodes.sort(function(a,b) { return a[0] - b[0]; });
    }

    var middleIndex = Math.floor(nodes.length / 2);
    this.position = nodes[middleIndex].slice(0, 2);
    if (nodes[middleIndex].length > 2)
        this.payload = nodes[middleIndex][2];

    if (middleIndex > 0)
        this.childA = new KdTree(nodes.slice(0, middleIndex), this.northSouth);
    else
        this.childA = null;

    if (middleIndex < nodes.length - 1)
        this.childB = new KdTree(nodes.slice(middleIndex + 1), this.northSouth);
    else
        this.childB = null;

    // Meat, potatoes.
    this.search = function(positionToFind) {
        if (!(positionToFind instanceof Array) || positionToFind.length != 2) {
            throw 'This method takes a single parameter: an Array with two elements';
        }

        if (this.northSouth) {
            var firstChild = (positionToFind[1] < this.position[1]) ? this.childA : this.childB;
            var distanceToAxis = this.position[1] - positionToFind[1];
        } else {
            var firstChild = (positionToFind[0] < this.position[0]) ? this.childA : this.childB;
            var distanceToAxis = this.position[0] - positionToFind[0];
        }
        var otherChild = (firstChild === this.childA) ? this.childB : this.childA;

        if (firstChild === null) {
            var closest = this;
            var closestDistance = closest.squaredDistance(positionToFind);
        } else {
            var closest = firstChild.search(positionToFind);
            var closestDistance = closest.squaredDistance(positionToFind, this.position);
            var thisDistance = this.squaredDistance(positionToFind);
            if (closestDistance > thisDistance) {
                var closest = this;
                var closestDistance = thisDistance;
            }
        }

        if (distanceToAxis * distanceToAxis < closestDistance &&
            otherChild !== null) {
            var altClosest = otherChild.search(positionToFind);
            var altClosestDistance = altClosest.squaredDistance(positionToFind);
            if (altClosestDistance < closestDistance)
                return altClosest;
        }

        return closest;
    }

    // Squared distance is cheaper to calculate. Used for comparing distances.
    this.squaredDistance = function(aPosition) {
        if (!(aPosition instanceof Array) || aPosition.length != 2) {
            throw 'This method takes a single parameter: an Array with two elements';
        }

        var dx = this.position[0] - aPosition[0];
        var dy = this.position[1] - aPosition[1];
        return dx * dx + dy * dy;
    }

    this.distance = function(aPosition) {
        if (!(aPosition instanceof Array) || aPosition.length != 2) {
            throw 'This method takes a single parameter: an Array with two elements';
        }

        return Math.sqrt(this.squaredDistance(aPosition));
    }

    this.size = function() {
        return (this.childA == null ? 0 : this.childA.size()) +
            (this.childB == null ? 0 : this.childB.size()) + 1;
    }
}

/*
 * Loop through each token, build list, and forms it into KD tree
 *
 */
function buildTokenKdTree(excludedToken) {
    //reset KD tree
    myState.tokenKdTree = null;
    var tokenList = [];
    //find all the tokens
    var currentPageGraphics = findObjs({
        _pageid: Campaign().get("playerpageid"),
        _type: "graphic",
    });
    _.each(currentPageGraphics, function(obj) {
        if (obj.get("_id") != excludedToken) {
            //add token to tokenList
            var gridUnits = findObjs({_id: Campaign().get("playerpageid")})[0].get("snapping_increment");
            var xSquare = obj.get("left") / (70* gridUnits);
            var ySquare = obj.get("top") / (70 * gridUnits);
            var tokenName = obj.get("name");
            tokenList.push([xSquare,ySquare,obj.get("_id")]);
        }
    });
    log(tokenList);
    //build new KD tree
    myState.tokenKdTree = new KdTree(tokenList);
}

/*
 * Find nearest token
 *
 */
function findNearestToken(x,y) {
    //search nearest token
    var tokenID = myState.tokenKdTree.search([x,y]).payload;
    //get token object
    var token = findObjs({_id: tokenID,_type: "graphic"})[0];
    log("Nearest token is: "+token.get("name"));
}



var myState = {};
myState.tokenKdTree = new KdTree();

on("ready", function() {
    on("add:graphic", function(obj) {
        buildTokenKdTree();
    });

    on("change:graphic:left", function(obj) {
        var gridUnits = findObjs({_id: Campaign().get("playerpageid")})[0].get("snapping_increment");
        buildTokenKdTree(obj.get("_id"));
        var xSquare = obj.get("left") / (70 * gridUnits);
        var ySquare = obj.get("top") / (70 * gridUnits);
        findNearestToken(xSquare, ySquare);
    });

    on("change:graphic:top", function(obj) {
        var gridUnits = findObjs({_id: Campaign().get("playerpageid")})[0].get("snapping_increment");
        buildTokenKdTree(obj.get("_id"));
        var xSquare = obj.get("left") / (70 * gridUnits);
        var ySquare = obj.get("top") / (70 * gridUnits);
        findNearestToken(xSquare, ySquare);
    });
});