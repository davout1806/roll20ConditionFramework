var state = {};
var logCalls = [];
var sendChatCalls = [];
var mock = {};
var Davout = Davout || {};
Davout.R20Utils = Davout.R20Utils || {};

mock.logCallCount = function(){
    return logCalls.length;
};

mock.getLogCall = function(index){
    return logCalls[index];
};

mock.sendChatCount = function(){
    return sendChatCalls.length;
};

mock.getSendChat = function(index){
    return sendChatCalls[index];
};

mock.clearCalls = function (){
    logCalls = [];
    sendChatCalls = [];
};

MockMessage = function(who, content, selected) {
    this.who = who;
    this.content = content;
    this.selected = selected;
};

MockToken = function(id, name, charId){
    this._id = id;
    this.name = name;
    this.represents = charId;
    this.type = "graphic";
    this.subtype = "token";
};

MockToken.prototype.get = function (property){
    switch (property){
        case "id": return this._id;
        case "name": return this.name;
        case "represents": return this.represents;
        case "type": return this.type;
        case "subtype": return this.subtype;
        default: throw "Unknown Token Property: " + property;
    }
};

MockCharacter = function(name){
    this.name = name;
};

MockCharacter.prototype.get = function (property){
    switch (property){
        case "name": return this.name;
        default: throw "Unknown Character Property: " + property;
    }
};

/*
 * These methods are needed for mocking framework.
 */
function on(eventCondition, func){

}

function log(str){
    logCalls.push(str);
}

function sendChat(speakingAs, input){
    sendChatCalls.push(speakingAs + ":" + input);
}

/**
 * Mocking functions from Davout.R20Utils
 */
Davout.R20Utils.adjustAttributeForChar = function(characterId, attributeName, modifier){
};

Davout.R20Utils.selectedToTokenObjReturn = undefined;
Davout.R20Utils.selectedToTokenObj = function (singleSelectedObject){
    return Davout.R20Utils.selectedToTokenObjReturn;
};

Davout.R20Utils.tokenObjToCharObjReturn = undefined;
Davout.R20Utils.tokenObjToCharObj = function (tokenObject){
    return Davout.R20Utils.tokenObjToCharObjReturn;
};
