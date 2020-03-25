import 'module-alias/register';
import './app/bootstrap';
import { Bootstrap } from './app/bootstrap';
import { LoggerService } from './app/services/logger/logger.service';
import colors = require('colors');


let packageJSON = require('../package.json');


console.log(colors.blue('\n' +
  '     ____             __          ____  ______\n' +
  '    / __ \\__  _______/ /_        / __ )/ ____/\n' +
  '   / /_/ / / / / ___/ __ \\______/ __  / __/\n' +
  '  / ____/ /_/ (__  ) / / /_____/ /_/ / /___\n' +
  ' /_/    \\__,_/____/_/ /_/     /_____/_____/\n' +
  '                                     ') +
  colors.grey('v' + packageJSON.version) + '\n',
);

const b = new Bootstrap();

process.on('uncaughtException', (e) => {
  LoggerService.Error('Unhandled Exception', e);
  b.restart();
});
process.on('unhandledRejection', (e, p) => {
  LoggerService.Error('Unhandled Rejection', e, p);
  b.restart();
});
