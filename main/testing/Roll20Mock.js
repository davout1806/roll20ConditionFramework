var state = {};
var logCalls = [];
var sendChatCalls = [];
var mock = {};

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
