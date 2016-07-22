'use strict';

var fs = require('fs');
var path = require('path');
var rework = require('css');

// Usage control
if (process.argv.length != 3) {
    console.log('Usage: node index.js ./path/to/my/stylesheet.css');
    process.exit();
}

// Read a file (relative path) with node
function readFile(fileName, cb) {
    var filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, {encoding: 'utf-8'}, function (error, data) {
        if (error) {
            console.log(error);
            process.exit();
        }

        cb(data);
    });
}

// A nice way to walk through every rule
function walkRules(rules, linters) {
    rules.forEach(function(rule) {
        if (rule.rules) {
            walkRules(rule.rules);
        }
        linters.forEach(function(linter){
            linter(rule);
        });
    });
}

// A custom linter
function checkRule(rule) {
    if (rule.selectors) {
        rule.selectors.forEach(function(selector) {
            if (selector.length > 20) {
                console.log('Line ' + rule.position.start.line + ': too long selector "' + selector + '"');
            }
        });
    }
}

// Main part
var fileName = process.argv[2];
readFile(fileName, function(css) {
    var ast = rework.parse(css);
    walkRules(ast.stylesheet.rules, [checkRule]);
});
