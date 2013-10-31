#!/usr/bin/env node

/*

after running your package.json will look something like this

  "scripts": {
    "test": "./node_modules/.bin/mocha",
    "posttest": "mocha --require blanket -R html-cov > coverage.html && open coverage.html",
    "blanket": {
      "path": "lib"
    }
  }
*/

var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec

var argv = require('optimist')
    .usage('Usage: $0 --code your/source/code [--package your/npm/module]')
    .default({
      'code': path.join(process.cwd(), 'lib'),
      'package': process.cwd()
    })
    .describe({
      'code': 'the location of your source files; do not include your tests! e.g. "lib" or "src"',
      'package': 'a path to the npm package to which you want to add `blanket`. defaults to the current directory, "."',
      'force': 'overwrite the scripts.posttest and scripts.blanket fields in package.json',
      'preview': 'see what changes will be made to your package.json without making them'
    })
    .alias({
      'code': 'c',
      'package': 'p',
      'force': 'f'
    })
    .wrap(80)
    .argv

argv.code = path.resolve(argv.package, argv.code)

var cwd = process.env.PWD
var PKG_PATH = path.join(argv.package, 'package.json')

var pkg = require(PKG_PATH);

// put blanket in dev deps
var install = 'npm install --save-dev blanket';
if (!pkg.devDependencies.blanket && !argv.preview) {
  console.log(install)
  return exec(install, function (error, stdout, stderr) {
      if (stdout) console.log(stdout)
      if (stderr) console.log(stderr)
      if (error !== null) return console.log('exec error: ' + error)
      return keepGoing();
  })
}
console.log('preview: ' + install)
return keepGoing()


function keepGoing() {
  // npm install might have changed it
  pkg = JSON.parse(fs.readFileSync(PKG_PATH))
  pkg.scripts = pkg.scripts || {}

  if (!argv.force) {
    if (pkg.scripts.posttest) {
      throw new Error(PKG_PATH + ' already contains a `posttest` property')
    }
    if (pkg.scripts.blanket) {
      throw new Error(PKG_PATH + ' already contains a `banket` property')
    }
  }

  var posttest = 'mocha --require blanket -R html-cov > coverage.html'
      + ' && open coverage.html'
  pkg.scripts.posttest = posttest

  pkg.scripts.blanket = pkg.scripts.blanket || {}

  // TODO get blanket to support a "path" option.
  pkg.scripts.blanket.pattern = path.relative(path.dirname(argv.package), argv.code)

  var str = JSON.stringify(pkg, null, 2)
  console.log(str)
  if (argv.preview) return
  fs.writeFileSync(PKG_PATH, str)
}
