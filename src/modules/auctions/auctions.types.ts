export const StatusEnum = {
    CLOSED: 0,
    OPEN: 1,
} as const;

export type StatusEnum = (typeof StatusEnum)[keyof typeof StatusEnum];

export interface Auction {
    id: string;
    title: string;
    status: StatusEnum;
    createdAt: string;
    updatedAt: string;
    endingAt: string;
    highestBid: {
        amount: number;
    };
}
