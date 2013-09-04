/**
 * Created with IntelliJ IDEA.
 * User: Mike
 * Date: 9/2/13
 * Time: 3:35 AM
 * To change this template use File | Settings | File Templates.
 */

state.davoutFcConditions = state.davoutFcConditions || [];

state.davoutFcConditions["fatiguedI"] = {effect: [{attrib: "Str", modifier: -2}, {attrib: "Dex", modifier: -2}, {attrib: "Speed", modifier: -5}] };
state.davoutFcConditions["fatiguedII"] = {effect: [{attrib: "Str", modifier: -4}, {attrib: "Dex", modifier: -4}, {attrib: "Speed", modifier: -10}] };