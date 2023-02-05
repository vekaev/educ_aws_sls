import { validate } from 'uuid';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';
import httpCors from '@middy/http-cors';
import middy, { MiddyfiedHandler } from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseSerializer from '@middy/http-response-serializer';

import { MiddlewareFn, MiddlewareObj } from '@/types';

export const middify = (handler: Handler): MiddyfiedHandler =>
    middy(handler)
        .use(httpJsonBodyParser())
        .use(httpHeaderNormalizer())
        .use(httpEventNormalizer())
        .use(
            httpResponseSerializer({
                defaultContentType: 'application/json',
                serializers: [
                    {
                        regex: /^application\/json$/,
                        serializer: (res: Response) => {
                            return JSON.stringify(res.body || res);
                        },
                    },
                ],
            }),
        )
        .use(httpCors())
        .use(httpErrorHandler());

export const verifyParamIdMiddleware = (): MiddlewareObj => {
    const before: MiddlewareFn = (request): void => {
        const { id } = request?.event?.pathParameters || {};

        if (!id || !validate(id))
            throw new createError.BadRequest(
                'Please pass a valid id (uuid(v4))',
            );
    };

    return { before };
};
