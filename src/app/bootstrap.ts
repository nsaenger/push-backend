
import colors = require('colors');
import express = require('express');
import os = require('os');
import Socket = NodeJS.Socket;

import { Injector } from './utilities/injector';
import * as http from 'http';
import { App } from './app';
import { LoggerService } from './services/logger/logger.service';


export class Bootstrap {
  public connections: Socket[] = [];
  private readonly expressApplication: express.Application;
  private readonly maxHotRestarts;
  private hotRestarts;
  private server: http.Server;
  private port = 30000;

  constructor() {
    this.expressApplication = express();
    this.maxHotRestarts = 25;
    this.hotRestarts = 0;

    this.startServer();
  }

  startServer() {
    this.server = this.expressApplication.listen(this.port, () => {
      this.startApplication();
      this.server.on('connection', (connection) => {
        this.connections.push(connection);
      });
    });
  }

  stopServer() {
    if (this.server) {
      LoggerService.Info(`stopping server`);
      this.connections.map(connection => {
        connection.end();
      });
      this.server.close();
    }
  }

  startApplication() {
    const interfaces = os.networkInterfaces();
    let address = 'localhost';

    for (let key in interfaces) {
      interfaces[key].map(network => {
        if (network.family === 'IPv4' && !network.internal) {
          address = network.address;
        }
      })
    }

    LoggerService.Info(`listening on http://${ colors.yellow(address + ':' + this.port) }/`);
    if (process.env.NODE_ENV === 'development') {
      LoggerService.Info(`running in development mode`);
    }
    Injector.Resolve<App>(App).init(this.expressApplication, process);
  }

  stopApplication() {
    LoggerService.Info(`stopping all instances`);
    Injector.Destroy()
  }

  restart() {
    if (++this.hotRestarts > this.maxHotRestarts) {
      LoggerService.Error('Too much hot restarts, failsafe active...');
      this.stopApplication();
      this.stopServer();
      process.exit();
    }

    LoggerService.Info(`restarting ( ${ this.hotRestarts } / ${ this.maxHotRestarts } )`);
    this.stopApplication();
    Injector.Destroy();
    setTimeout(() => {
      this.stopServer();
      this.startServer();
      LoggerService.Info('restart complete');
    }, 2500);
  }
}
