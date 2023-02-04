import { validate } from 'uuid';
import createError from 'http-errors';
import httpCors from '@middy/http-cors';
import validator from '@middy/validator';
import middy, { MiddyfiedHandler } from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { transpileSchema } from '@middy/validator/transpile';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseSerializer from '@middy/http-response-serializer';
import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from 'aws-lambda';

type ValidatorOptions = Parameters<typeof validator>[0];
type MiddlewareObj = middy.MiddlewareObj<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
>;
type MiddlewareFn = middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
>;

export const verifyParamIdMiddleware = (): MiddlewareObj => {
    const before: MiddlewareFn = (request): void => {
        const { id } = request?.event?.pathParameters || {};

        if (!id || !validate(id))
            throw new createError.BadRequest(
                'Please pass a valid id (uuid(v4))'
            );
    };

    return { before };
};

export const validatorMiddleware = (
    eventSchema: object,
    options: ValidatorOptions = {}
) => validator({ eventSchema: transpileSchema(eventSchema), ...options });

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
                        serializer: (res) => {
                            return JSON.stringify(res.body || res);
                        },
                    },
                ],
            })
        )
        .use(httpCors())
        .use(httpErrorHandler());
