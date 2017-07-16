//字体加颜色的工具
var chalk = require('chalk');
//比较版本（x.x.x）的工具
var semver = require('semver');
//加载package.json
var packageConfig = require('../package.json');
//跨Unix脚本兼容处理工具
var shell = require('shelljs');

function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [
  {
    name: 'node',
    //  node版本
    currentVersion: semver.clean(process.version),
    //  用户指定的node版本
    versionRequirement: packageConfig.engines.node
  },
];

//shell.which('npm')去当前系统path里找是否存在这个运行环境
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  var warnings = [];
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i];
    //当前版本跟要求版本符合要求吗
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' + chalk.red(mod.currentVersion) + ' should be ' + chalk.green(mod.versionRequirement))
    }
  }

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('To use this template, you must update following to modules:'));
    console.log();
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i];
      console.log('  ' + warning)
    }
    console.log();
    process.exit(1)
  }
};
