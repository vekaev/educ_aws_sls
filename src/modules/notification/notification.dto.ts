export type SendSimpleEmailDto = {
    subject: string;
    body: string;
    recipient: string;
    from?: string;
};
