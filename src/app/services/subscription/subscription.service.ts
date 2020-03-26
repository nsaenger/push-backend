import * as fs from 'fs';
import * as path from 'path';
import { Observable } from 'rxjs';
import { Injectable } from '../../utilities/injectable';
import { SameStructure } from '../../utilities/same-structure';
import { LoggerService } from '../logger/logger.service';

export interface UserSubscription {
  endpoint: string;
  expirationTime: number;
  keys: {
    p256dh: string;
    auth: string;
  }
}

export const UserSubscriptionRecord: UserSubscription = {
  endpoint: '', expirationTime: 0, keys: { auth: '', p256dh: '' },
};

@Injectable()
export class SubscriptionService {
  private root = path.join(process.cwd(), '/..');
  private dataPath = path.join(this.root, '/data');
  private filePath = path.join(this.dataPath, '/subscriptions.json');

  constructor() {
    // Create DB-File
    fs.readdir(this.dataPath, (err, dir) => {
      if (err) {
        fs.mkdir(this.dataPath, (err) => {
          if (!err) {
            fs.writeFileSync(this.filePath, '[]');
            LoggerService.Info('new db created at ' + this.filePath);
          }
        })
      } else {
        if (!fs.existsSync(this.filePath)) {
          fs.writeFileSync(this.filePath, '[]');
          LoggerService.Info('new db created at ' + this.filePath);
        } else {
          LoggerService.Info('db found at ' + this.filePath);
        }
      }
    })
  }

  public add(subscription: UserSubscription): Observable<UserSubscription[]> {
    LoggerService.Info('tying to add new sub');
    return new Observable(obs => {
      if (!subscription) {
        obs.error('Broken subscription object');
        obs.complete();
        return;
      }

      this.get().subscribe(
        data => {
          if (!data.find(x => x.endpoint === subscription.endpoint)) {
            data.push(subscription);
          }
          this.set(data).subscribe(obs.next, obs.error, obs.complete);
        },
        obs.error,
        obs.complete
      )
    });
  }

  public delete(subscription: UserSubscription): Observable<UserSubscription[]> {
    return new Observable(obs => {
      this.get().subscribe(
        data => {
          data = data.filter(x => x.endpoint !== subscription.endpoint);
          this.set(data).subscribe(obs.next, obs.error, obs.complete);
        }
      )
    });
  }

  public set(subscriptions: UserSubscription[]): Observable<UserSubscription[]> {
    return new Observable(obs => {
      if (!subscriptions) {
        obs.error('Broken subscription object');
        obs.complete();
        return;
      }

      fs.writeFile(this.filePath, JSON.stringify(subscriptions, null, 2), (err) => {
        if (err) {
          obs.error(err);
        } else {
          try {
            const subs = JSON.parse(subscriptions.toString());
            obs.next(subs);
          } catch(e) {
            obs.error('subscriber db is broken');
          }
        }
        obs.complete();
      });
    });
  }

  public get(): Observable<UserSubscription[]> {
    return new Observable<UserSubscription[]>(obs => {
      fs.readFile(this.filePath, (err, data) => {
        if (err) {
          obs.error(err);
        } else {
          try {
            const subs = JSON.parse(data.toString());
            obs.next(subs);
          } catch(e) {
            obs.error('subscriber db is broken');
          }
        }
        obs.complete();
      })
    });
  }
}
