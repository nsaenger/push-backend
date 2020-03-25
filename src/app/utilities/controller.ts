import { Router, Response } from 'express';
import { StatusCode, STATUS_CODE } from '../constants/status-codes';

export interface ResponseObject {
  response: Response,
  status?: StatusCode,
  data?: any,
  html?: boolean
}

export abstract class Controller {
  public static Respond(responseObject: ResponseObject) {
    const response: ResponseObject = {
      response: responseObject.response ? responseObject.response : null,
      status: responseObject.status ? responseObject.status : STATUS_CODE.OK,
      data: responseObject.data ? responseObject.data : '',
      html: responseObject.html ? responseObject.html : false,
    };

    if (!response.response) {
      return;
    }

    if (response.html) {
      response.response
        .header({ 'Content-Type': 'text/html; charset=utf-8' })
        .status(response.status.code)
        .send(response.data);
    } else {
      response.response
        .header({ 'Content-Type': 'application/json; charset=utf-8' })
        .status(response.status.code)
        .send(JSON.stringify({
          status: response.status,
          data: response.data,
        }));
    }
  }

  public abstract router(): Router;
}
