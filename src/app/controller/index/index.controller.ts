import { Router } from 'express';
import { STATUS_CODE } from '../../constants/status-codes';
import { LoggerService } from '../../services/logger/logger.service';
import { Controller } from '../../utilities/controller';
import { Injectable } from '../../utilities/injectable';


@Injectable()
export class IndexController extends Controller {

  constructor() {
    super();
    LoggerService.Info('loading component: index');
  }

  public router(): Router {
    const router = Router();

    router.get('**', this.index.bind(this));

    return router;
  }

  public index(req, res) {
    const uptime = process.uptime();
    const totalSec = Math.floor(uptime);
    const millis = Math.floor(1000 * (uptime - totalSec));
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec - (hours * 3600)) / 60);
    const seconds = totalSec - (hours * 3600) - (minutes * 60);

    Controller.Respond({response: res, status:  STATUS_CODE.OK, data: {
      version: require('../../../../package.json').version,
      uptime: {
        hours,
        minutes,
        seconds,
        millis,
      },
    }});
  }
}
