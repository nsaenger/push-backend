export class StatusCode {
  code: number;
  text: string;
}


interface IStatusCode {
  // Success
  OK: StatusCode,
  CREATED: StatusCode,

  // Redirect
  MOVED: StatusCode,

  // Client Error
  BAD_REQUEST: StatusCode,
  UNAUTHORIZED: StatusCode,
  FORBIDDEN: StatusCode,
  NOT_FOUND: StatusCode,
  GONE: StatusCode,

  // Server Error
  INTERNAL: StatusCode,
}


export const STATUS_CODE: IStatusCode = {
  // Success
  OK: {
    code: 200,
    text: 'OK',
  },
  CREATED: {
    code: 200,
    text: 'CREATED',
  },

  // Redirect
  MOVED: {
    code: 301,
    text: 'MOVED',
  },

  // Client Error
  BAD_REQUEST: {
    code: 400,
    text: 'BAD_REQUEST',
  },
  UNAUTHORIZED: {
    code: 401,
    text: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    code: 403,
    text: 'FORBIDDEN',
  },
  NOT_FOUND: {
    code: 404,
    text: 'NOT_FOUND',
  },
  GONE: {
    code: 410,
    text: 'GONE',
  },

  // Server Error
  INTERNAL: {
    code: 500,
    text: 'INTERNAL',
  },

  // Logical Error
};
