var util = require('util');
var chalk = require('chalk');

module.exports = function(arg) {
  if (typeof arg === typeof Function) {
    console.log('\n' + chalk.bold.red('DEBUG: ') + chalk.bgWhite.black(arg.toString()) + '\n');
  } else {
    console.log('\n' + chalk.bold.red('DEBUG: ') + chalk.bgWhite.black('%j') + '\n', arg);
  }
};
