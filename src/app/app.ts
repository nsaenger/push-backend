import { Application as ExpressApplication } from 'express';
import { STATUS_CODE } from './constants/status-codes';
import { IndexController } from './controller/index/index.controller';
import { LoggerService } from './services/logger/logger.service';
import { Controller } from './utilities/controller';
import { Injectable } from './utilities/injectable';
import { Injector } from './utilities/injector';
import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import Process = NodeJS.Process;


@Injectable()
export class App {

  private exiting = false;
  private process: Process = null;
  private express: ExpressApplication = null;

  public constructor(
    private indexController: IndexController,
  ) { }

  public init(express: ExpressApplication, process: Process) {
    LoggerService.Info('initializing application');

    this.process = process;
    this.express = express;

    this.bindProcessEvents();
    this.middleware();
    this.routes();
  }

  public shutdown() {
    LoggerService.Info('shutting down');
    this.unbindProcessEvents();

    if (!this.exiting) {
      this.exiting = true;
      Injector.Destroy();
      LoggerService.Info('instances gracefully stopped');
    }

    this.process.exit();
    LoggerService.Info('shutdown complete');
  }

  private middleware() {
    LoggerService.Info('loading middleware');
    this.express.use(cors());

    this.express.use(bodyParser.urlencoded({
      extended: false,
      limit: '4gb',
    }));
    this.express.use(bodyParser.json({ limit: '4gb' }));
    this.express.use(bodyParser.text({ limit: '4gb' }));
  }

  private routes() {
    LoggerService.Info('loading routes');

    this.express.use('/ping', this.indexController.router());
    this.express.use('/static', express.static('public'));


    this.express.all('**', (req, res) =>
      Controller.Respond({
        response: res,
        status: STATUS_CODE.NOT_FOUND,
        data: `Path not found: ${ req.method }:${ req.path }`,
      }),
    );

    LoggerService.Info('application started');
  }

  private bindProcessEvents() {
    this.unbindProcessEvents();
    this.process.on('exit', this.shutdown.bind(this));
    this.process.on('SIGINT', this.shutdown.bind(this));
    this.process.on('SIGTERM', this.shutdown.bind(this));
    this.process.on('SIGUSR1', this.shutdown.bind(this));
    this.process.on('SIGUSR2', this.shutdown.bind(this));
  }

  private unbindProcessEvents() {
    this.process.off('exit', this.shutdown.bind(this));
    this.process.off('SIGINT', this.shutdown.bind(this));
    this.process.off('SIGTERM', this.shutdown.bind(this));
    this.process.off('SIGUSR1', this.shutdown.bind(this));
    this.process.off('SIGUSR2', this.shutdown.bind(this));
  }
}
