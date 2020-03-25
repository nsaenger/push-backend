import colors = require('colors');
import { Injectable } from '../../utilities/injectable';


@Injectable()
export class LoggerService {

  public static Info(str, ...argv) {
    if (typeof (str) !== 'string') {
      str = JSON.stringify(str);
    }

    if (argv.length > 0) {
      console.log(`[${ colors.grey(LoggerService.Time()) }] ${ colors.cyan('INFO') } ${ str }`, argv);
    } else {
      console.log(`[${ colors.grey(LoggerService.Time()) }] ${ colors.cyan('INFO') } ${ str }`);
    }
  }

  public static Warn(str, ...argv) {
    if (typeof (str) !== 'string') {
      str = JSON.stringify(str);
    }

    if (argv.length > 0) {
      console.warn(`[${ colors.yellow(LoggerService.Time()) }] ${ colors.bold.yellow('WARN') } ${ str }`, argv);
    } else {
      console.warn(`[${ colors.yellow(LoggerService.Time()) }] ${ colors.bold.yellow('WARN') } ${ str }`);
    }
  }

  public static Error(str, ...argv) {
    if (typeof (str) !== 'string') {
      str = JSON.stringify(str);
    }

    if (argv.length > 0) {
      console.error(`[${ colors.red(LoggerService.Time()) }] ${ colors.bold.red('ERRO') } ${ str }`, argv);
    } else {
      console.error(`[${ colors.red(LoggerService.Time()) }] ${ colors.bold.red('ERRO') } ${ str }`);
    }
  }

  private static Pad(value: number): string {
    return (`${ value }`).padStart(2, '0');
  }

  private static Time(): string {
    const d = new Date();
    return `${ LoggerService.Pad(d.getHours()) }:${ LoggerService.Pad(d.getMinutes()) }:${ LoggerService.Pad(
        d.getSeconds()) }`;
  }
}
