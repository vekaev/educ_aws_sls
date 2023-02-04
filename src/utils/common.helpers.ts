import { StatusCodes } from 'http-status-codes';

export const responseFactory = (body: object, statusCode = StatusCodes.OK) => ({
    body,
    statusCode,
});
