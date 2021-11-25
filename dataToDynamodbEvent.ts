import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const vehicles = [
  {
    id: '20211021_R4567GT',
    arrivalPurpose: 'CARGO_IMPORT',
    netWeight: 0,
    status: 'ARRIVED',
    borderCheckpoint: '',
    driver: {
      name: 'Anyone',
    },
    operator: {
      id: '093c7baf-896b-4fd0-bc05-253eb7fac606',
      organization: {
        name: '',
        id: '53ddbae9-0d27-420a-b692-6221e734b194',
      },
    },
    tareWeight: 0,
    departureCountry: 'China',
    organization: {
      name: '',
      id: '53ddbae9-0d27-420a-b692-6221e734b194',
    },
    weightType: 'GROSS',
    vehiclePlateNumber: 'R4567GT',
    grossWeight: 300,
    arrivalDate: 1634806747244,
  },
  {
    id: '20211003_05KG998AAO',
    arrivalPurpose: 'CARGO_IMPORT',
    netWeight: 0,
    status: 'DEPARTED',
    borderCheckpoint: 'Irkeshtam',
    driver: {
      name: 'Шакенов Э',
    },
    operator: {
      id: '093c7baf-896b-4fd0-bc05-253eb7fac606',
      organization: {
        name: '',
        id: '53ddbae9-0d27-420a-b692-6221e734b194',
      },
    },
    tareWeight: 0,
    departureCountry: 'China',
    organization: {
      name: '',
      id: '53ddbae9-0d27-420a-b692-6221e734b194',
    },
    weightType: 'GROSS',
    departureDate: 1633286561819,
    vehiclePlateNumber: '05KG998AAO',
    grossWeight: 0,
    arrivalDate: 1633282315813,
  },
];

interface RecordTemplateInput {
  eventName: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined;
  data: any;
  tableName: string;
}

async function convertToEvent() {
  const dynamodbStreamEvent: DynamoDBStreamEvent = {
    Records: vehicles.map((vehicle) => {
      if (vehicle.status === 'ARRIVED') {
        return getCreateRecordTemplate({
          eventName: 'INSERT',
          data: vehicle,
          tableName: 'Vehicles',
        });
      } else {
        return getUpdateRecordTemplate({
          eventName: 'MODIFY',
          data: vehicle,
          tableName: 'Vehicles',
        });
      }
    }),
  };

  console.log(JSON.stringify(dynamodbStreamEvent, null, 2));

  function getCreateRecordTemplate(input: RecordTemplateInput): DynamoDBRecord {
    const { eventName, data, tableName } = input;
    const marshalledData = DynamoDB.Converter.marshall(data);

    return {
      eventName,
      dynamodb: {
        Keys: {
          id: {
            S: data.id,
          },
        },
        NewImage: marshalledData as any,
        OldImage: marshalledData as any,
      },
      eventSourceARN: `arn:aws:dynamodb:region:123456789012:table/${tableName}/stream/2016-11-16T20:42:48.104`,
    };
  }

  function getUpdateRecordTemplate(input: RecordTemplateInput): DynamoDBRecord {
    const { eventName, data, tableName } = input;
    const marshalledData = DynamoDB.Converter.marshall(data);

    return {
      eventName,
      dynamodb: {
        Keys: {
          id: {
            S: data.id,
          },
        },
        NewImage: marshalledData as any,
        OldImage: {
          ...marshalledData,
          status: 'ARRIVED' as any,
        },
      },
      eventSourceARN: `arn:aws:dynamodb:region:123456789012:table/${tableName}/stream/2016-11-16T20:42:48.104`,
    };
  }
}

convertToEvent();
