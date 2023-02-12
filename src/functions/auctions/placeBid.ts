import {
    placeBidSchema,
    AuctionsService,
    PlaceBidBodyDto,
} from '@/modules/auctions';

import { getUserFrom } from '@/utils/auth.utils';
import { middify, verifyParamIdMiddleware } from '@/utils/middlewares';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify((event: MiddyfiedEvent<PlaceBidBodyDto>) => {
    const user = getUserFrom(event);

    return AuctionsService.placeBid(
        event.pathParameters.id!,
        event.body.amount,
        user.email,
    );
})
    .use(verifyParamIdMiddleware())
    .use(validatorMiddleware(placeBidSchema));
