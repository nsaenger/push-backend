import { Router } from 'express';
import { STATUS_CODE } from '../../constants/status-codes';
import { LoggerService } from '../../services/logger/logger.service';
import { SubscriptionService, UserSubscription } from '../../services/subscription/subscription.service';
import { Controller } from '../../utilities/controller';
import { Injectable } from '../../utilities/injectable';

const webpush = require('web-push');


@Injectable()
export class IndexController {

  private readonly vapidKeys = {
    publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
  };

  constructor(
    private subscriptionService: SubscriptionService,
  ) {
  }

  public router(): Router {
    const router = Router();

    router.post('/add', this.addSubscription.bind(this));
    router.post('/send', this.sendToAll.bind(this));
    router.get('**', this.index.bind(this));

    return router;
  }

  public addSubscription(req, response) {
    const subscription: UserSubscription = req.body.subscription;

    this.subscriptionService.add(subscription).subscribe(
      () => Controller.Respond({ response, status: STATUS_CODE.OK }),
      (error) => Controller.Respond({ response, status: STATUS_CODE.BAD_REQUEST, data: error }),
    );
  }

  public sendToAll(req, response) {
    this.subscriptionService.get().subscribe(
      (data) => {
        data.map(subscription => {
          this.send(subscription, req.body);
        });
        Controller.Respond({ response, status: STATUS_CODE.OK, data: data.length});
      },
      (error) => Controller.Respond({ response, status: STATUS_CODE.BAD_REQUEST, data: error }),
    );
  }

  public index(req, res) {
    const uptime = process.uptime();
    const totalSec = Math.floor(uptime);
    const millis = Math.floor(1000 * (uptime - totalSec));
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec - (hours * 3600)) / 60);
    const seconds = totalSec - (hours * 3600) - (minutes * 60);

    Controller.Respond({
      response: res, status: STATUS_CODE.OK, data: {
        version: require('../../../../package.json').version,
        uptime: {
          hours,
          minutes,
          seconds,
          millis,
        },
      },
    });
  }

  public send(subscription, data = null) {
    const payload = data ? JSON.stringify(data) : JSON.stringify({
      notification: {
        title: 'Your Gate Changed',
        body: 'Your Gate is now G62',
        icon: './assets/img/angular.png',
        data: 'additional data'
      }
    });

    webpush.setVapidDetails(
      'http://localhost:3000/',
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey
    );

    webpush.sendNotification(subscription, payload).catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        LoggerService.Info('Subscription expired, deleting');
        this.subscriptionService.delete(subscription).subscribe();
      } else {
        LoggerService.Info('Sending push notification');
      }
    });
  }
}
