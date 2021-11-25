import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB = require('aws-sdk/clients/dynamodb');
export declare const dynamoDb: DynamoDB;
export declare const dynamoMapper: DataMapper;
export declare class YourDocumentTableObject {
    id: string;
    actFormNumber?: string;
    arrivalDate: number;
    arrivalPurpose: any;
    borderCheckpoint?: string;
    departureCountry: string;
    departureDate?: number;
    driver?: any;
    grossWeight: number;
    netWeight?: number;
    organization?: any;
    representative?: any;
    status: any;
    tareWeight?: number;
    trailerPlateNumber?: string;
    operator: any;
    vehiclePlateNumber: string;
    weightType: any;
}
export interface IndexDataEvent {
    startDate?: string;
    endDate?: string;
}
export declare const handler: (event: IndexDataEvent) => Promise<void>;
