import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

import { SendSimpleEmailDto } from '@/modules/notification';

import { DEFAULT_AMAZON_CLIENT_CONFIG } from '@/constants';

const sqsClient = new SQSClient(DEFAULT_AMAZON_CLIENT_CONFIG);

export const sqs = {
    sendMessage: (message: string, queueUrl: string) => {
        const params = {
            QueueUrl: queueUrl,
            MessageBody: message,
        };

        return sqsClient.send(new SendMessageCommand(params));
    },

    sendSesMessage: (message: SendSimpleEmailDto) =>
        sqs.sendMessage(JSON.stringify(message), process.env.MAIL_QUEUE_URL!),
};
