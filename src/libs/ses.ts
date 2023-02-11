import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { DEFAULT_AMAZON_CLIENT_CONFIG } from '@/constants';

const sesClient = new SESClient(DEFAULT_AMAZON_CLIENT_CONFIG);

interface SendEmailParams {
    to: string[];
    from: string;
    subject: string;
    text: string;
}

export const ses = {
    sendEmail: async ({ to, from, subject, text }: SendEmailParams) => {
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
