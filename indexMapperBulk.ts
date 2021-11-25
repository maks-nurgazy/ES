/* External dependencies */
import { DynamoDBRecord, DynamoDBStreamEvent, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import {
  Client,
  Connection,
  RequestParams,
} from '@opensearch-project/opensearch';

const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;

const esClient = new Client({
  node: `http://${ES_HOST}:${ES_PORT}`,
});

export enum VehicleArrivalPurpose {
  ARREST = 'ARREST',
  CARGO_EXTRACTION = 'CARGO_EXTRACTION',
  CARGO_IMPORT = 'CARGO_IMPORT',
  PARKING = 'PARKING',
  PARKING_WITH_CARGO = 'PARKING_WITH_CARGO',
  WEIGHIN = 'WEIGHIN',
}

export enum VehicleStatus {
  ARRIVED = 'ARRIVED',
  DEPARTED = 'DEPARTED',
}

export enum WeightType {
  GROSS = 'GROSS',
  TARE = 'TARE',
}
export type ExternalUser = {
  name: string;
  phone?: string;
  role?: string;
};

export interface Organization {
  id: string;
  name: string;
}

export type User = {
  id: ID;
  firstName: string;
  lastName: string;
  organization: Organization;
  phone: string;
  role: string;
  joinDate: number;
};

type ID = string;

export type Vehicle = {
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

export async function handler(event: DynamoDBStreamEvent) {
  for (let record of event.Records) {
    const { eventSourceARN, eventName, dynamodb } = record;
    if (!eventSourceARN || !eventName || !dynamodb) continue;

    const match = eventSourceARN.match(/.+:table\/([^"]+)\/stream/);
    const { NewImage, OldImage, Keys } = dynamodb;

    if (!match) continue;

    const [, tableName] = match;
    console.log(`Event from ${tableName}`);

    // INSERT event
    if (eventName === 'INSERT') {
      if (!NewImage) continue;

      const newVehicle = DynamoDB.Converter.unmarshall(NewImage) as Vehicle;

      const insertResponse = await esClient.index({
        index: getVehicleIndex(newVehicle, tableName),
        id: newVehicle.id,
        body: newVehicle,
      });

      printResponse(insertResponse);
    }

    // Update event
    if (eventName === 'MODIFY') {
      if (!NewImage || !OldImage) continue;

      const newVehicle = DynamoDB.Converter.unmarshall(NewImage) as Vehicle;
      const oldVehicle = DynamoDB.Converter.unmarshall(OldImage) as Vehicle;

      if (
        newVehicle.status === VehicleStatus.DEPARTED &&
        oldVehicle.status === VehicleStatus.ARRIVED
      ) {
        await Promise.all([
          esClient.delete({
            index: getHotIndex(tableName),
            id: newVehicle.id,
          }),
          esClient.index({
            index: getColdIndex(tableName),
            id: newVehicle.id,
            body: newVehicle,
          }),
        ]);
      } else {
        const updateResponse = await esClient.update({
          index: getVehicleIndex(newVehicle, tableName),
          id: newVehicle.id,
          body: {
            doc: newVehicle,
          },
        });

        printResponse(updateResponse);
      }
    }
  }

  function getVehicleIndex(vehicle: Vehicle, tableName: string) {
    if (vehicle.status === VehicleStatus.DEPARTED) {
      return getColdIndex(tableName);
    }

    return getHotIndex(tableName);
  }

  function getColdIndex(tableName: string) {
    return `${tableName.toLowerCase()}-cold`;
  }

  function getHotIndex(tableName: string) {
    return `${tableName.toLowerCase()}-hot`;
  }
}

function printResponse(response: any) {
  console.log(JSON.stringify(response, null, 2));
}

const hotArrivedCargoImport: StreamRecord = {
  ApproximateCreationDateTime: 1479499740,
  Keys: {
    id: {
      S: '20211028_05KG711ABJ',
    },
  },
  NewImage: {
    id: {
      S: '20211028_05KG711ABJ',
    },
    arrivalPurpose: {
      S: 'CARGO_IMPORT',
    },
    netWeight: {
      N: '0',
    },
    trailerPlateNumber: {
      S: '05KG997PA',
    },
    status: {
      S: 'ARRIVED',
    },
    borderCheckpoint: {
      S: 'Torugart',
    },
    operator: {
      M: {
        id: {
          S: 'fab1a253-4b7e-4269-adbf-b3c141d99dac',
        },
        organization: {
          M: {
            id: {
              S: '61ba7c84-1ad5-4a37-88a9-15892b58be22',
            },
          },
        },
      },
    },
    driver: {
      M: {
        name: {
          S: 'Токтобаев М',
        },
      },
    },
    tareWeight: {
      N: '0',
    },
    departureCountry: {
      S: 'China',
    },
    organization: {
      M: {
        id: {
          S: '61ba7c84-1ad5-4a37-88a9-15892b58be22',
        },
      },
    },
    weightType: {
      S: 'GROSS',
    },
    vehiclePlateNumber: {
      S: '05KG711ABJ',
    },
    grossWeight: {
      N: '0',
    },
    arrivalDate: {
      N: '1635413689730',
    },
  },
  SequenceNumber: '13021600000000001596893679',
  SizeBytes: 112,
  StreamViewType: 'NEW_AND_OLD_IMAGES',
};

const coldCargoImport: StreamRecord = {
  Keys: {
    id: {
      S: '20211028_05KG711ABJ',
    },
  },
  NewImage: {
    id: {
      S: '20211028_05KG711ABJ',
    },
    arrivalPurpose: {
      S: 'CARGO_IMPORT',
    },
    netWeight: {
      N: '0',
    },
    trailerPlateNumber: {
      S: '05KG997PA',
    },
    status: {
      S: 'DEPARTED',
    },
    borderCheckpoint: {
      S: 'Torugart',
    },
    operator: {
      M: {
        id: {
          S: 'fab1a253-4b7e-4269-adbf-b3c141d99dac',
        },
        organization: {
          M: {
            id: {
              S: '61ba7c84-1ad5-4a37-88a9-15892b58be22',
            },
          },
        },
      },
    },
    driver: {
      M: {
        name: {
          S: 'Токтобаев М',
        },
      },
    },
    tareWeight: {
      N: '0',
    },
    departureCountry: {
      S: 'China',
    },
    organization: {
      M: {
        id: {
          S: '61ba7c84-1ad5-4a37-88a9-15892b58be22',
        },
      },
    },
    weightType: {
      S: 'GROSS',
    },
    vehiclePlateNumber: {
      S: '05KG711ABJ',
    },
    grossWeight: {
      N: '0',
    },
    arrivalDate: {
      N: '1635413689730',
    },
  },
  SequenceNumber: '13021600000000001596893679',
  SizeBytes: 112,
  StreamViewType: 'NEW_AND_OLD_IMAGES',
};

const createRecord: DynamoDBRecord = {
  eventID: '7de3041dd709b024af6f29e4fa13d34c',
  eventName: 'INSERT',
  eventVersion: '1.1',
  eventSource: 'aws:dynamodb',
  awsRegion: 'us-west-2',
  dynamodb: hotArrivedCargoImport,
  eventSourceARN: `arn:aws:dynamodb:region:123456789012:table/Vehicles/stream/2016-11-16T20:42:48.104`,
};

const updateRecord: DynamoDBRecord = {
  eventID: '7de3041dd709b024af6f29e4fa13d3js',
  eventName: 'MODIFY',
  eventVersion: '1.1',
  eventSource: 'aws:dynamodb',
  awsRegion: 'us-west-2',
  dynamodb: coldCargoImport,
  eventSourceARN: `arn:aws:dynamodb:region:123456789012:table/Vehicles/stream/2016-11-16T20:42:48.104`,
};

async function doJob() {
  const data: DynamoDBStreamEvent = {
    Records: [createRecord, updateRecord],
  };

  await handler(data);
}

doJob();
