import _get from 'lodash/get';
import createError from 'http-errors';
import {
    ScanInput,
    QueryInput,
    ScanCommand,
    QueryCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    PutItemCommandOutput,
    DeleteItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';

const ddbConfig = process.env.IS_OFFLINE
    ? {
          region: process.env.AWS_DB_REGION,
          credentials: fromIni({
              profile: process.env.AWS_DB_PROFILE,
          }),
      }
    : {};
const ddbClient = new DynamoDBClient(ddbConfig)


export const ddb = <T = object>(TableName: string, itemName = 'Item') => ({
    getAll: async (params: Partial<ScanInput> = {}): Promise<T[]> => {
        const { Items = [] } = await ddbClient.send(
            new ScanCommand({
                TableName,
                ...params,
            }),
        );

        return Items.map((item) => unmarshall(item)) as T[];
    },

    queryAll: async (params: Omit<QueryInput, 'TableName'>): Promise<T[]> => {
        const { Items = [] } = await ddbClient.send(
            new QueryCommand({
                TableName,
                ...params,
            }),
        );

        return Items.map((item) => unmarshall(item)) as T[];
    },

    getById: async (id: string): Promise<T> => {
        const { Item } = await ddbClient.send(
            new GetItemCommand({
                TableName,
                Key: marshall({ id }),
            }),
        );

        if (Item == null) {
            throw new createError.NotFound(
                `${itemName} with id ${id} not found!`,
            );
        }

        return unmarshall(Item) as T;
    },

    create: (data: Partial<T>): Promise<PutItemCommandOutput> =>
        ddbClient.send(
            new PutItemCommand({
                TableName,
                Item: marshall(data),
            }),
        ),

    update: async (id: string, data: object): Promise<T> => {
        const objKeys = Object.keys(data);
        const { Attributes } = await ddbClient
            .send(
                new UpdateItemCommand({
                    TableName,
                    Key: marshall({ id }),
                    ReturnValues: 'ALL_NEW',
                    ConditionExpression: 'attribute_exists(id)',
                    UpdateExpression: `SET ${objKeys
                        .map((_, index) => `#field${index} = :value${index}`)
                        .join(', ')}`,
                    ExpressionAttributeNames: objKeys.reduce(
                        (accumulator, key, index) => ({
                            ...accumulator,
                            [`#field${index}`]: key,
                        }),
                        {},
                    ),
                    ExpressionAttributeValues: marshall(
                        objKeys.reduce(
                            (accumulator, key, index) => ({
                                ...accumulator,
                                [`:value${index}`]: _get(data, key),
                            }),
                            {},
                        ),
                    ),
                }),
            )
            .catch(() => {
                throw new createError.NotFound(
                    `${itemName} with id ${id} not found!`,
                );
            });

        return unmarshall(Attributes!) as T;
    },

    delete: (id: string): Promise<DeleteItemCommandOutput> =>
        ddbClient.send(
            new DeleteItemCommand({
                TableName,
                Key: marshall({ id }),
            }),
        ),
});
