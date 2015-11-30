#!/usr/bin/env node

'use strict';

var fs = require('fs');
var execSync = require('child_process').execSync;

var commitMsgFile = process.argv[2] || './.git/COMMIT_EDITMSG';
var isNewCommit = (process.argv[3] === 'undefined');

var content = fs.readFileSync(commitMsgFile).toString();
var scissorsLine = '# ------------------------ >8 ------------------------';
var doc = `#---
# <type>(<scope>): <subject>
# <BLANK LINE>
# <body>
# <BLANK LINE>
# <footer>
#---
# TYPE must be one of the following:
# - feat: A new feature (will appear in CHANGELOG)
# - fix: A bug fix (will appear in CHANGELOG)
# - docs: Documentation only changes
# - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
# - refactor: A code change that neither fixes a bug nor adds a feature
# - perf: A code change that improves performance (will appear in CHANGELOG)
# - test: Adding missing tests
# - chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
#
# SCOPE could be anything specifying place of the commit change.
# For example $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView, etc...
#
# SUBJECT contains succinct description of the change:
# - use the imperative, present tense: "change" not "changed" nor "changes"
# - do not capitalize first letter
# - no dot (.) at the end
#---
# https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md
#
`;

content = (content.indexOf(scissorsLine) !== -1) ?
    content.replace(scissorsLine, doc + scissorsLine) :
    content + doc;

if (isNewCommit) {
  var currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().split('\n').join('');
  content = '(' + currentBranch + '): ' + content;
}

fs.writeFileSync(commitMsgFile, content);
process.exit(0);
