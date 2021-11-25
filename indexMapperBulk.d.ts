import { DynamoDBStreamEvent } from 'aws-lambda';
export declare enum VehicleArrivalPurpose {
    ARREST = "ARREST",
    CARGO_EXTRACTION = "CARGO_EXTRACTION",
    CARGO_IMPORT = "CARGO_IMPORT",
    PARKING = "PARKING",
    PARKING_WITH_CARGO = "PARKING_WITH_CARGO",
    WEIGHIN = "WEIGHIN"
}
export declare enum VehicleStatus {
    ARRIVED = "ARRIVED",
    DEPARTED = "DEPARTED"
}
export declare enum WeightType {
    GROSS = "GROSS",
    TARE = "TARE"
}
export declare type ExternalUser = {
    name: string;
    phone?: string;
    role?: string;
};
export interface Organization {
    id: string;
    name: string;
}
export declare type User = {
    id: ID;
    firstName: string;
    lastName: string;
    organization: Organization;
    phone: string;
    role: string;
    joinDate: number;
};
declare type ID = string;
export declare type Vehicle = {
    id: ID;
    actFormNumber?: string;
    arrivalDate: number;
    arrivalPurpose: VehicleArrivalPurpose;
    borderCheckpoint?: string;
    departureCountry: string;
    departureDate?: number;
    driver?: ExternalUser;
    grossWeight: number;
    netWeight?: number;
    organization?: Organization;
    representative?: ExternalUser;
    status: VehicleStatus;
    tareWeight?: number;
    trailerPlateNumber?: string;
    operator: User;
    vehiclePlateNumber: string;
    weightType: WeightType;
};
export declare function handler(event: DynamoDBStreamEvent): Promise<void>;
export {};
