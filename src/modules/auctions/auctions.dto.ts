import { Auction, StatusEnum } from '@/modules/auctions/auctions.types';

export type GetAuctionsQueryDto = {
    status?: StatusEnum;
};

export type CreateAuctionBodyDto = {
    title: string;
};

export type UpdateAuctionBodyDto = Partial<Auction>;

export type PlaceBidBodyDto = {
    amount: number;
};
