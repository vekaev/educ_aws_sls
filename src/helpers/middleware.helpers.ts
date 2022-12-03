import { validate } from 'uuid';
import createError from 'http-errors';
import validator from '@middy/validator';
import middy, { MiddyfiedHandler } from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseSerializer from '@middy/http-response-serializer';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

type MiddlewareObj = middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddlewareFn = middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult>
type ValidatorMiddlewareOptions =  { eventSchema: object, contextSchema: object, responseSchema: object }

export const verifyParamIdMiddleware = (): MiddlewareObj  => {
        const before: MiddlewareFn = (request): void => {
            const { id } = request?.event?.pathParameters || {};

            if (!id || !validate(id)) {
                throw new createError.BadRequest('Please pass a valid id (uuid(v4))');
            }
        }

        return { before };
};

export const validatorMiddleware = (eventSchema: ValidatorMiddlewareOptions['eventSchema'], options: Partial<ValidatorMiddlewareOptions> = {}) => validator({ eventSchema, ...options });

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
