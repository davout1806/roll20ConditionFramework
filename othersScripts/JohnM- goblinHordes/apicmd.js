//  Stripped down version Optparse.js
//  Optparse.js Copyright (c) 2009 Johan Dahlberg (MIT License)

var optparse = {};
var apicmd = {};

(function(self) {
    var LONG_SWITCH_RE = /^--\w+/;
    var SHORT_SWITCH_RE = /^-\w$/;
    var NUMBER_RE = /^(0x[A-Fa-f0-9]+)|([0-9]+\.[0-9]+)|(\d+)$/;
    var OBJECT_ID_RE = /^([-A-Za-z0-9_]+)$/;
    var EXT_RULE_RE = /(\-\-[\w_-]+)\s+([\w\[\]_-]+)|(\-\-[\w_-]+)/;
    var ARG_OPTIONAL_RE = /\[(.+)\]/;

// The default switch argument filter to use, when argument name doesnt match
// any other names.
    var DEFAULT_FILTER = '_DEFAULT';
    var PREDEFINED_FILTERS = {};

// The default switch argument filter. Parses the argument as text.
    function filter_text(value) {
        return value;
    }

// Switch argument filter that expects an integer, HEX or a decimal value. An
// exception is throwed if the criteria is not matched.
// Valid input formats are: 0xFFFFFFF, 12345 and 1234.1234
    function filter_number(value) {
        var m = NUMBER_RE.exec(value);
        if(m == null) throw OptError('Expected a number representative');
        if(m[1]) {
            // The number is in HEX format. Convert into a number, then return it
            return parseInt(m[1], 16);
        } else {
            // The number is in regular- or decimal form. Just run in through
            // the float caster.
            return parseFloat(m[2] || m[3]);
        }
    }

// Helper function for validating and finding Roll20 objects
    function validate_object(objId, objType) {
        var foundObj;
        if(typeof objType !== "undefined"){
            return getObj(objType, objId);
        } else {
            if(foundObj = findObjs({_id: objId})) {
                return foundObj[0];
            }
        }
    }

    function filter_object(value){
        var m = OBJECT_ID_RE.exec(value);
        var obj;
        if(m == null) throw OptError('Expected a Roll20 object id');
        if(obj = validate_object(m[1])){
            return obj;
        } else throw OptError('Expected a valid Roll20 object id');
    }

    function filter_character(value){
        var m = OBJECT_ID_RE.exec(value);
        var obj;
        if(m == null) throw OptError('Expected a Roll20 character id');
        if(obj = validate_object(m[1], 'character')){
            return obj;
        } else throw OptError('Expected a valid Roll20 character id');
    }

    function filter_token(value){
        var m = OBJECT_ID_RE.exec(value);
        var obj;
        if(m == null) throw OptError('Expected a Roll20 token id');
        if(obj = validate_object(m[1], 'token')){
            return obj;
        } else throw OptError('Expected a valid Roll20 token id');
    }

    function filter_api_command(value){
        var cmd;
        log('[*] ' + value);
        if(cmd = apicmd.commands(value))
            return cmd;
        else
            throw OptError('Undefined API command');
    }

// Register all predefined filters. This dict is used by each OptionParser
// instance, when parsing arguments. Custom filters can be added to the parser
// instance by calling the "add_filter" method.
    PREDEFINED_FILTERS[DEFAULT_FILTER] = filter_text;
    PREDEFINED_FILTERS['TEXT'] = filter_text;
    PREDEFINED_FILTERS['NUMBER'] = filter_number;
    PREDEFINED_FILTERS['OBJECT'] = filter_object;
    PREDEFINED_FILTERS['CHARACTER'] = filter_character;
    PREDEFINED_FILTERS['TOKEN'] = filter_token;
    PREDEFINED_FILTERS['API_COMMAND'] = filter_api_command;
//  Builds rules from a switches collection. The switches collection is defined
//  when constructing a new OptionParser object.
    function build_rules(filters, arr) {
        var rules = [];
        for(var i=0; i<arr.length; i++) {
            var r = arr[i], rule
            if(!contains_expr(r)) throw OptError('Rule MUST contain an option.');
            switch(r.length) {
                case 1:
                    rule = build_rule(filters, r[0]);
                    break;
                case 2:
                    var expr = LONG_SWITCH_RE.test(r[0]) ? 0 : 1;
                    var alias = expr == 0 ? -1 : 0;
                    var desc = alias == -1 ? 1 : -1;
                    rule = build_rule(filters, r[alias], r[expr], r[desc]);
                    break;
                case 3:
                    rule = build_rule(filters, r[0], r[1], r[2]);
                    break;
                default:
                case 0:
                    continue;
            }
            rules.push(rule)
        }
        return rules;
    }

//  Builds a rule with specified expression, short style switch and help. This
//  function expects a dict with filters to work correctly.
//
//  Return format:
//      name               The name of the switch.
//      short              The short style switch
//      long               The long style switch
//      decl               The declaration expression (the input expression)
//      desc               The optional help section for the switch
//      optional_arg       Indicates that switch argument is optional
//      filter             The filter to use when parsing the arg. An
//                         <<undefined>> value means that the switch does
//                         not take anargument.
    function build_rule(filters, short, expr, desc) {
        var optional, filter;
        var m = expr.match(EXT_RULE_RE);
        if(m == null) throw OptError('The switch is not well-formed.');
        var long = m[1] || m[3];
        if(m[2] != undefined) {
            // A switch argument is expected. Check if the argument is optional,
            // then find a filter that suites.
            var optional = ARG_OPTIONAL_RE.test(m[2]);
            var filter_name = optional ? m[1] : m[2];
            filter = filters[filter_name];
            if(filter === undefined) filter = filters[DEFAULT_FILTER];
        }
        return {
            name: long.substr(2),
            short: short,
            long: long,
            decl: expr,
            desc: desc,
            optional_arg: optional,
            filter: filter
        }
    }

// Loop's through all elements of an array and check if there is valid
// options expression within. An valid option is a token that starts
// double dashes. E.G. --my_option
    function contains_expr(arr) {
        if(!arr || !arr.length) return false;
        var l = arr.length;
        while(l-- > 0)  {
            if(LONG_SWITCH_RE.test(arr[l])) return true;

        }
        return false;
    }

// Extends destination object with members of source object
    function extend(dest, src) {
        var result = dest;
        for(var n in src) {
            result[n] = src[n];
        }
        return result;
    }

// Appends spaces to match specified number of chars
    function spaces(arg1, arg2) {
        var l, builder = [];
        if(arg1.constructor === Number) {
            l = arg1;
        } else {
            if(arg1.length == arg2) return arg1;
            l = arg2 - arg1.length;
            builder.push(arg1);
        }
        while(l-- > 0) builder.push(' ');
        return builder.join('');
    }

//  Create a new Parser object that can be used to parse command line arguments.
//
//
    function Parser(rules) {
        return new OptionParser(rules);
    }

// Creates an error object with specified error message.
    function OptError(msg) {
        return new function() {
            this.msg = msg;
            this.toString = function() {
                return this.msg;
            }
        }
    }

    function OptionParser(rules) {
        this.banner = 'Usage: [Options]';
        this.options_title = 'Available options:'
        this._rules = rules;
        this._halt = false;
        this.filters = extend({}, PREDEFINED_FILTERS);
        this.on_args = {};
        this.on_switches = {};
        this.on_halt = function() {};
        this.default_handler = function() {};
    }

    OptionParser.prototype = {

        // Adds a custom filter to the parser. It's possible to override the
        // default filter by passing the value "_DEFAULT" to the ´´name´´
        // argument. The name of the filter is automatically transformed into
        // upper case.
        filter: function(name, fn) {
            this.filters[name.toUpperCase()] = fn;
        },

        // Parses specified args. Returns object with options and remaining arguments.
        parse: function(args) {
            var result = [], callback;
            var parg = {};
            var rules = build_rules(this.filters, this._rules);
            var tokens = args.concat([]);
            var token;
            while(token = tokens.shift()) {
                if(LONG_SWITCH_RE.test(token) || SHORT_SWITCH_RE.test(token)) {
                    var arg = undefined;
                    // The token is a long or a short switch. Get the corresponding
                    // rule, filter and handle it. Pass the switch to the default
                    // handler if no rule matched.
                    for(var i = 0; i < rules.length; i++) {
                        var rule = rules[i];
                        if(rule.long == token || rule.short == token) {
                            if(rule.filter !== undefined) {
                                arg = tokens.shift();
                                if(!LONG_SWITCH_RE.test(arg) && !SHORT_SWITCH_RE.test(arg))  {
                                    try {
                                        arg = rule.filter(arg);
                                    } catch(e) {
                                        throw OptError(token + ': ' + e.toString());
                                    }
                                } else if(rule.optional_arg) {
                                    tokens.unshift(arg);
                                } else {
                                    throw OptError('Expected switch argument.');
                                }
                            }
                            parg[rule.name] = arg || true;
                            break;
                        }
                    }
                    if(i == rules.length) this.default_handler.apply(this, [token]);
                } else {
                    // Did not match long or short switch. Parse the token as a
                    // normal argument.
                    result.push(token);
                }
            }
            return {opts:parg, args:result};
        },

        // Returns an Array with all defined option rules
        options: function() {
            return build_rules(this.filters, this._rules);
        },


        // Returns an HTML table representation of this OptionParser instance.
        toString: function() {
            var builder=["<table>"], rule;
            var rules = build_rules(this.filters, this._rules);
            for(var i = 0; i < rules.length; i++) {
                rule = rules[i];
                builder.push("<tr><td style='vertical-align:top; padding-right:1em;'>");
                builder.push(_([rule.short, rule.decl]).compact().join(', '));
                builder.push("</td><td>");
                builder.push(rule.desc);
            }
            return builder.join('');
        }
    }

    self.OptionParser = OptionParser;

})(optparse);





(function(self){

    var _commands = {};

    self.on = function (cmd, banner, usage, switches, funct){
        _commands[cmd] = new Command(cmd, banner, usage, switches, funct);
    }

    self.call = function (msg){
        cmdstr = msg.content.substring(1)
        argv = cmdstr.match(/"([^\\"]*(?:\\.[^\\"]*)*)"|'([^\\']*(?:\\.[^\\']*)*)'|(\S+)/g);
        argv = _(argv).map(function (arg){
            return arg.replace(/^"(.*)"$/, "$1");
        })
        cmd = argv.shift();

        if(_commands[cmd]) {
            args = _commands[cmd].parser.parse(argv);
            _commands[cmd].exec(args, msg);
        }
    }

    self.commands = function (cmdName){
        if(cmdName)
            return _commands[cmdName];
        return _commands;
    }

    self.commandList = function (){
        var builder = "<br><b>apicmd commands:</b><table>";
        var cmdNames = _(this.commands()).keys();
        _.each(cmdNames, function (cmd){
            builder += "<tr><td style='vertical-align:top; padding-right:1em;'><b>"+cmd+"</b></td><td><i>"+ _commands[cmd].banner +"</i></td></tr>";
        }, this);
        builder += "</table>";
        return builder;
    }

    function Command(name, banner, usage, switches, funct) {
        this.name = name;
        this.banner = banner;
        this.usage = usage;
        this.parser = new optparse.OptionParser(switches);
        this.funct = funct
    }

    Command.prototype = {
        exec: function (args, msg){
            this.funct(args, msg);
        },

        toString: function (){
            return ["<br><b>", this.name, "</b>&nbsp;&nbsp;&nbsp;", "<i>", this.banner , "</i><br>",
                ["Usage:", "!"+this.name, this.usage].join(' '), "<br>",
                this.parser.toString()].join('');
        }
    }

})(apicmd);

on('chat:message', function(msg) {
    if(msg.type == 'api'){
        try {
            apicmd.call(msg)
        } catch(e) {
            sendChat('api', 'error in apicmd');
            log(e);
        }
    }
});

apicmd.on('apicmd', 'manage the apicmd framework', '[OPTIONS]',
    [['-l', '--list', 'lists registered API commands'],
        ['-h', '--help [API_COMMAND]', 'displays the list of options']],
    function (argv, msg){
        if(argv.opts.help)
            if(argv.opts.help == true)
                return sendChat('', '/direct ' + apicmd.commands('apicmd').toString());
            else
                return sendChat('', '/direct ' + apicmd.commands(argv.opts.help).toString());

        if(argv.opts.list)
            return sendChat('', '/direct ' +  apicmd.commandList());
    });

apicmd.on('objtool', 'helpers for managing objects', '[OPTIONS]',
    [['-i', '--id', 'return the object\'s id'],
        ['-c', '--center OBJECT', 'center the object on another object']],
    function (argv, msg){
        var targetObj;

        if(!(argv.args[0] && (targetObj = findObjs({_id: argv.args[0]})[0]))){
            sendChat('api', 'invalid object id');
            return
        }

        if(argv.opts.id){
            sendChat('api', targetObj.id)
            return;
        }

        if(argv.opts.center){

            var centerY = argv.opts.center.get('top') + (argv.opts.center.get('height')/2);
            var centerX = argv.opts.center.get('left') + (argv.opts.center.get('width')/2);
            var targetX = centerX - (targetObj.get('height')/2);
            var targetY = centerY - (targetObj.get('width')/2);
            //*/

            targetObj.set({left: targetX, top: targetY})
            return;
        }
    })


