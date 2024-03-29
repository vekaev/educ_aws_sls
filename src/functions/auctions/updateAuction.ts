import {
    AuctionsService,
    updateAuctionSchema,
    UpdateAuctionBodyDto,
} from '@/modules/auctions';
import isEmpty from 'lodash/isEmpty';
import createError from 'http-errors';

import { getUserFrom } from '@/utils/auth.utils';
import { middify, verifyParamIdMiddleware } from '@/utils/middlewares';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify(
    (event: MiddyfiedEvent<UpdateAuctionBodyDto>) => {
        const user = getUserFrom(event);
        // TODO: this check should be done in the validator middleware
        // but it's still not available in ajv
        if (isEmpty(event.body))
            throw new createError.BadRequest('Missing data to update!');

        return AuctionsService.updateAuction(
            event.pathParameters.id!,
            event.body,
            user,
        );
    },
)
    .use(verifyParamIdMiddleware())
    .use(validatorMiddleware(updateAuctionSchema));
