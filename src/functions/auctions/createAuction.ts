import {
    AuctionsService,
    CreateAuctionBodyDto,
    createAuctionSchema,
} from '@/modules/auctions';
import { middify } from '@/utils/middlewares';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify(
    (event: MiddyfiedEvent<CreateAuctionBodyDto>) => {
        console.info(event.requestContext.authorizer);
        return AuctionsService.createAuction(event.body.title);
    },
).use(validatorMiddleware(createAuctionSchema));
