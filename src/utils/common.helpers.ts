import { StatusCodes } from 'http-status-codes';

export const now = (): string => new Date().toISOString();

export const responseFactory = (body: object, statusCode = StatusCodes.OK) => ({
    body,
    statusCode,
});
