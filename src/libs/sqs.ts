import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

import { DEFAULT_AMAZON_CLIENT_CONFIG } from '@/constants';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
const sqsClient = new SQSClient(DEFAULT_AMAZON_CLIENT_CONFIG);

export const sqs = {
    sendMessage: async (
        message: string,
        queueUrl = process.env.MAIL_QUEUE_URL,
    ) => {
        const params = {
            QueueUrl: queueUrl,
            MessageBody: message,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        await sqsClient.send(new SendMessageCommand(params)).catch((error) => {
            throw (error as { Error: Error }).Error;
        });
    },
};
