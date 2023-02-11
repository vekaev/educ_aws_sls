import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { DEFAULT_AMAZON_CLIENT_CONFIG } from '@/constants';

const s3Client = new S3Client(DEFAULT_AMAZON_CLIENT_CONFIG);

export const s3 = {
    uploadImage: (
        key: string,
        picture: string,
        bucketName = process.env.AUCTIONS_BUCKET_NAME,
    ) => {
        const body = Buffer.from(
            picture.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
        );
        const params = {
            Body: body,
            Key: key + '.jpg',
            Bucket: bucketName,
            ContentType: 'image/jpeg',
            ContentEncoding: 'base64',
        };

        return s3Client.send(new PutObjectCommand(params));
    },
};
