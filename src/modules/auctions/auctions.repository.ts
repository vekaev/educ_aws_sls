import { ddb } from '~libs/ddb';

import { Auction } from './auctions.types';

const AUCTION_ITEM_NAME = 'Auction';
const auctionsDDb = ddb<Auction>(process.env.AUCTIONS_TABLE_NAME!, AUCTION_ITEM_NAME);

export const AuctionsRepository = auctionsDDb;
