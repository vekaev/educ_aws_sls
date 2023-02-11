import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: process.env.AWS_DB_REGION });

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

        await sesClient.send(params);
    },
};
