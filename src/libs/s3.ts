import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { DEFAULT_AMAZON_CLIENT_CONFIG } from '@/constants';

const s3Client = new S3Client(DEFAULT_AMAZON_CLIENT_CONFIG);

export const s3 = {
    uploadImage: async (
        key: string,
        picture: string,
        bucketName = process.env.AUCTIONS_BUCKET_NAME!,
    ) => {
        const body = Buffer.from(
            picture.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
        );
        const contentType = picture.split(';')[0].split(':')[1];
        const imageType = contentType.split('/')[1];
        const params = {
            Body: body,
            Bucket: bucketName,
            ContentType: contentType,
            ContentEncoding: 'base64',
            Key: `${key}.${imageType}`,
        };

        await s3Client.send(new PutObjectCommand(params));

        return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    },

    deleteImage: async (url: string) => {
        const params = {
            Bucket: process.env.AUCTIONS_BUCKET_NAME!,
            Key: url.split('.com/')[1],
        };

        await s3Client.send(new DeleteObjectCommand(params));
    },
};
