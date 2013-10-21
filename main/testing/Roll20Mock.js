/*
 * These are needed for mocking framework.
 */

var state = {};

function on(eventCondition, func) {
}

function log(str) {
}

function sendChat(speakingAs, input) {
}

function findObjs(criteriaObj) {
}

function randomInteger(max){
}

//var useExpectGetObj;
//var getObjExpects = [];
//var getObjExpectIdx = 0;
//function resetExpectGetObj(_useExpectGetObj) {
//    useExpectGetObj = _useExpectGetObj;
//    getObjExpectIdx = 0;
//    getObjExpects = [];
//}
//
//function expectGetObj(type, id, returnValue, times) {
//    if (useExpectGetObj) {
//        if (times === undefined) {
//            times = 1;
//        }
//
//        for (var i = 0; i < times; i++) {
//            getObjExpects.push({type: type, id: id, returnValue: returnValue});
//        }
//    } else {
//        throw "Called expectGetObj while useExpectGetObj is set to false.";
//    }
//}

function getObj(type, id) {
//    if (useExpectGetObj) {
//        if (getObjExpects[getObjExpectIdx] === undefined){
//            throw "Invalid call getObj( " + type + ", " + id +" ): getObjExpectIdx = " + getObjExpectIdx + "; getObjExpects= " + JSON.stringify( getObjExpects);
//        }
//        if (getObjExpects[getObjExpectIdx].type === type && getObjExpects[getObjExpectIdx].id === id) {
//            return getObjExpects[getObjExpectIdx++].returnValue;
//        } else {
//            throw ("Unexpected call: getObj( " + type + ", " + id + ")");
//        }
//    }
}
