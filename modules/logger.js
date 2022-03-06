// Console colors
var colors = require('colors');

// [INFO] console out
var info = function (message) {
    console.log(colors.cyan('[INFO]'), message);
}

var cmds = function (message) {
    console.log(colors.yellow('[CMDS]'), message);
}

// [SUCCESS] console out
var success = function (message) {
    console.log(colors.green('[SUCCESS]'), message);
}

// [SUCCESS] console out
var radio = function (message) {
    console.log(colors.yellow('[RADIO]'), message);
}


// Module exports
module.exports.success = success;
module.exports.cmds = cmds;
module.exports.info = info;
module.exports.radio = radio;

