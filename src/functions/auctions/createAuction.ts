import {
    AuctionsService,
    CreateAuctionBodyDto,
    createAuctionSchema,
} from '@/modules/auctions';
import { middify } from '@/utils/middlewares';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify(
    (event: MiddyfiedEvent<CreateAuctionBodyDto>, context) => {
        console.log(context);
        return AuctionsService.createAuction(event.body.title);
    },
).use(validatorMiddleware(createAuctionSchema));
