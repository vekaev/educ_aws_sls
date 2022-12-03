import { StatusCodes } from 'http-status-codes';

export const now = (): string => new Date().toISOString();

export const responseFactory = (body: Record<string, any>, statusCode = StatusCodes.OK) => ({
    body,
    statusCode,
});
