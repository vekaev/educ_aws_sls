export const StatusEnum = {
    OPEN: 1,
} as const;

export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];
