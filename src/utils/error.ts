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

export interface ErrorData {
  message: string;
  name?: string;
  statusCode?: number;
}

export interface ErrorTMDB {
  success: boolean;
  status_code: number;
  status_message: string;
}

export function getErrorData(error: unknown): ErrorData {
  if (typeof error === 'object' && error !== null) {
    const message =
      'message' in error && typeof error.message === 'string' ? error.message : 'Unknown error';
    if ('statusCode' in error && typeof error.statusCode === 'number') {
      return {
        message,
        name: 'name' in error && typeof error.name === 'string' ? error.name : undefined,
        statusCode: error.statusCode,
      };
    }
    return { message };
  }
  return { message: 'Unknown error' };
}

export function errorLog(...msg: unknown[]) {
  console.error('[ERROR]', ...msg);
}

export function formatErrorData(errorData: ErrorData): string {
  return [
    errorData.name,
    errorData.statusCode ? `code ${errorData.statusCode}` : null,
    errorData.message,
  ]
    .filter(Boolean)
    .join(', ');
}

export const getErrorResponceObject = async (response: Response): Promise<ErrorTMDB> => {
  try {
    return await response.json();
  } catch {
    return {
      success: false,
      status_code: response.status,
      status_message: response.statusText,
    };
  }
};
