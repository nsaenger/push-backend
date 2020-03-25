import { Router } from 'express';
import { Injectable } from '../../utilities/injectable';


@Injectable()
export class RouterService {
  public readonly router: Router = Router();
}
