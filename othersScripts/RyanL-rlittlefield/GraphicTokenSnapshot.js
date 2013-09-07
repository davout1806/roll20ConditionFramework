/*
*  roll20 User: https://app.roll20.net/users/75060/ryan-l
   git User:    https://gist.github.com/rlittlefield
*/

/*
 It is based off my original !reveal command, but with the addition of the !alter command and the !save_snapshot functionality I thought it was worth a new post. Hopefully that isn't too against the forum rules, but the functionality is expanded quite a bit and no longer matches the old topic.

 How to use:

 1. Name some tokens with ".foo" somewhere in the name. This tells the script that this object can be modified by talking about "foo".

 2. Arrange and otherwise modify your tokens.

 3. Enter the command: !save_snapshot snap1 foo

 4. This will create a new snapshot named "snap1" for each "foo" object.

 5. Make some more changes, then: !save_snapshot snap2 foo

 6. !load_snapshot snap1 foo

 7. !load_snapshot snap2 foo

 There is also a command for modifying objects in bulk by class: !alter foo > {layer:"gmlayer"}

 Copyright (c) 2013 J. Ryan Littlefield

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

var getByClasses = function(classes, criteria) {
    var graphics = findObjs({
        _pageid: Campaign().get("playerpageid"),
        _type: "graphic",
    });
    var cclasses = {};
    for (var i = 0, il = classes.length; i < il; i++) {
        cclasses['.'+classes[i]] = true;
    }
    var output = [];
    _.each(graphics, function(item) {
        var item_name = item.get('name');
        if (criteria) {
            var matches_criteria = true;
            for (var clabel in criteria) {
                var cvalue = criteria[clabel];
                if (item.get(clabel) != cvalue) {
                    return;
                }
            }
        }
        var item_classes = item_name.match(/\.\w+/);
        _.each(item_classes, function(cclass) {
            if (cclasses[cclass]) {
                output[output.length] = item;
            }
        });
    });
    return output;
}

var getRandomByClasses = function(classes, criteria) {
    var items = getByClasses(classes, criteria);
    if (!items.length) {
        return;
    }
    var item = items[_.random(0, items.length-1)];
    return item;
}

var getRandomByClass = function(klass, criteria) {
    return getRandomByClasses([klass], criteria)
}

var getByClass = function(klass, criteria) {
    return getByClasses([klass], criteria);
}

if (!state.jrl_snapshots) {
    state.jrl_snapshots = {};
}


var generateSnapShot = function(item, index) {
    var new_props = {};
    for (var i in item.attributes) {
        if (i.indexOf('_') !== 0 && item.attributes.hasOwnProperty(i)) {
            new_props[i] = item.attributes[i];
            //log('setting ' + i + '=' + last_snapshot[i] + ' on ' + item.get('_id'));
        }
    }
    state.jrl_snapshots[index+'|'+item.get('_id')] = new_props;
};

var loadSnapShot = function(item, index) {
    var last_snapshot = state.jrl_snapshots[index+'|'+item.get('_id')];
    log('loading snapshot into '+ item.get('_id'));
    log(last_snapshot);
    item.set(last_snapshot);
};

var processCommand = function(command, argv) {
    switch(command) {
        case '!save_snapshot':
            var i = argv.shift();
            _.each(getByClasses(argv), function(item) {
                generateSnapShot(item, i);
            });
            log(state.jrl_snapshots);
            break;
        case '!load_snapshot':
            var i = argv.shift();
            _.each(getByClasses(argv), function(item) {
                loadSnapShot(item, i);
            });
            break;
        case '!reveal':
        case '!show':
            /*
             Usage: !reveal foo bar
             Result:
             will find all graphics with a name that contains .foo or .bar and
             then move them to the objects layer. This may be useful for ambushes,
             cutscenes, etc.
             */
            _.each(getByClasses(argv), function(item) {
                item.set({
                    'layer': 'objects'
                });
            });
            break;
        case '!conceal':
        case '!hide':
            /*
             Usage: !conceal foo bar
             Result:
             will find all graphics with a name that contains .foo or .bar and
             then move them to the gm layer. This may be useful for ambushes,
             cutscenes, etc.
             */
            _.each(getByClasses(argv), function(item) {
                item.set({
                    'layer': 'gmlayer'
                });
            });
            break;
        case '!revealrandom':
        case '!showrandom':
            // Usage: !revealrandom foo bar
            // Result: picks a random item with .foo or .bar in the name and shows
            var item = getRandomByClasses(argv, {'layer':'gmlayer'});
            item.set({
                'layer': 'objects'
            });
            break;
        case '!concealrandom':
        case '!hiderandom':
            // Usage: !revealrandom foo bar
            // Result: picks a random item with .foo or .bar in the name and hides
            var item = getRandomByClasses(argv, {'layer':'objects'});
            item.set({
                'layer': 'gmlayer'
            });
            break;
        case '!alter':
        case '!change':
            // Usage: !alter foo bar > rotation=24.1 aura1_radius=5 aura1_color="#44FF00"
            // Result: changes properties of all graphics with .foo or .bar
            // Note that this is not a proper parser, so you need to keep it to
            // a single space, don't forget the '>' character to separate the
            // classes from the properties, and put quotes around strings.
            // Additionally, don't put spaces in values, as it will not work.

            var classes = [];
            var alterations = [];
            var found = false;

            for (var i = 0, il = argv.length; i < il; i++) {
                var klass = argv[i];
                if (klass == '>') {
                    found = true;
                    continue;
                }
                if (!found) {
                    classes[classes.length] = klass;
                } else {
                    alterations[alterations.length] = klass;
                }
            }
            alterations = alterations.join(' ');
            log(alterations);
            try {
                eval('var changes = ' + alterations);
                log(changes);
                _.each(getByClasses(classes), function(item) {
                    item.set(changes);
                });
            } catch (e) {
                log(e);
            }
            break;
    }
}

on("chat:message", function(msg) {
    var argv = msg.content.split(' ');
    var command = argv.shift();
    if (msg.type != 'api') {
        return;
    }
    log(msg.content);
    return processCommand(command, argv);
});