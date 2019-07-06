#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const moment = require('moment');

const configs = {
  from: '',
  to: '',
  renamePattern: {
    type: null,
    pattern: '',
  },
};

program
  .option(
    '-f, --from <from>',
    'Specify target path.',
    (from) => { configs.from = from; },
  )
  .option(
    '-t, --to <to>',
    'Specify destination path',
    (to) => { configs.to = to; },
  )
  .option(
    '-m, --moment-rename <pattern>',
    'Rename file with moment patterns',
    (pattern) => {
      configs.renamePattern = {
        type: 'moment',
        pattern,
      };
    },
  )
  .parse(process.argv);

function useMomentPattern(pattern) {
  const newName = moment().format(pattern);

  const pathArr = configs.to.split('/').reverse();
  pathArr[0] = `${newName}.${pathArr[0].split('.').reverse()[0]}`;
  const newPath = pathArr.reverse().join('/').replace(/ /g, '_');

  return newPath;
}

switch (configs.renamePattern.type) {
  case 'moment':
    configs.to = useMomentPattern(configs.renamePattern.pattern);
    break;
  default:
}

fs.copyFile(configs.from, configs.to, () => {});
