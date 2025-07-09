export class ResponseError extends Error {
  constructor(
    public override message: string,
    public override name: string,
    public statusCode: number,
    public override stack?: string,
  ) {
    super(message);
  }
}

export type ErrorData = { message: string; name?: string; statusCode?: number };

export function getErrorData(error: unknown): ErrorData {
  if (error instanceof ResponseError) {
    return { message: error.message, name: error.name, statusCode: error.statusCode };
  } else if (error instanceof Error) {
    return { message: error.message };
  } else {
    return { message: 'Unknown error' };
  }
}
