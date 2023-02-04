import { middify, verifyParamIdMiddleware, validatorMiddleware } from '@/utils';

import { AuctionsService } from './auctions.service';
import { createAuctionSchema, updateAuctionSchema } from './auctions.dto';

export const AuctionsController = {
    getAuctions: middify(() => AuctionsService.getAuctions()),

    getAuction: middify((event) =>
        AuctionsService.getAuction(event.pathParameters.id)
    ).use(verifyParamIdMiddleware()),

    createAuction: middify((event) =>
        AuctionsService.createAuction(event.body.title)
    ).use(validatorMiddleware(createAuctionSchema)),

    updateAuction: middify((event) =>
        AuctionsService.updateAuction(event.pathParameters.id, event.body)
    )
        .use(verifyParamIdMiddleware())
        .use(validatorMiddleware(updateAuctionSchema)),

    deleteAuction: middify((event) =>
        AuctionsService.deleteAuction(event.pathParameters.id)
    ).use(verifyParamIdMiddleware()),
};
