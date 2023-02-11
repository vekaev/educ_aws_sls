import { APIGatewayEvent } from 'aws-lambda';

import { IUser } from '@/types';

export const getUserFrom = (event: APIGatewayEvent): IUser => {
    if (!event.requestContext.authorizer?.claims)
        throw new Error('Missing user claims');

    return event.requestContext.authorizer.claims as IUser;
};
