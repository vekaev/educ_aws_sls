import {
    APIGatewayEvent,
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';

export enum PolicyEffect {
    ALLOW = 'Allow',
    DENY = 'Deny',
}

export type MiddlewareObj = middy.MiddlewareObj<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
>;
export type MiddlewareFn = middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
>;
export type MiddyfiedEvent<
    B = Record<string, unknown>,
    Q = Record<string, unknown>,
> = APIGatewayEvent & {
    body: B;
    queryStringParameters: Q;
    pathParameters: Record<string, unknown>;
};
