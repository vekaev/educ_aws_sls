import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { DEFAULT_AMAZON_CLIENT_CONFIG } from '@/constants';

const sesClient = new SESClient(DEFAULT_AMAZON_CLIENT_CONFIG);

interface SendSimpleEmailParams {
    to: string[];
    from: string;
    subject: string;
    text: string;
}

export const ses = {
    sendSimpleEmail: ({ to, from, subject, text }: SendSimpleEmailParams) => {
        const params = new SendEmailCommand({
            Message: {
                Body: {
                    Text: {
                        Data: text,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
            Source: from,
            Destination: {
                ToAddresses: to,
            },
        });

        return sesClient.send(params);
    },
};
