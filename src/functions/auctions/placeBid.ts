import {
    placeBidSchema,
    AuctionsService,
    PlaceBidBodyDto,
} from '@/modules/auctions';
import { middify, verifyParamIdMiddleware } from '@/utils/middlewares';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify((event: MiddyfiedEvent<PlaceBidBodyDto>) =>
    AuctionsService.placeBid(event.pathParameters.id!, event.body.amount),
)
    .use(verifyParamIdMiddleware())
    .use(validatorMiddleware(placeBidSchema));
