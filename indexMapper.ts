import { DataMapper, ScanIterator } from '@aws/dynamodb-data-mapper';
import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { Client } from '@elastic/elasticsearch';

// of course move this dynamo mapper into a more appropriate place, and the table too
export const dynamoDb = new DynamoDB({ region: 'us-west-2' });
export const dynamoMapper = new DataMapper({ client: dynamoDb });

@table('Vehicles')
export class YourDocumentTableObject {
  @hashKey()
  id!: string;

  @attribute()
  actFormNumber?: string;

  @attribute()
  arrivalDate: any;

  @attribute()
  arrivalPurpose: any;

  @attribute()
  borderCheckpoint?: string;

  @attribute()
  departureCountry: string;

  @attribute()
  departureDate?: any;

  @attribute()
  driver?: any;

  @attribute()
  grossWeight: any;

  @attribute()
  netWeight?: any;

  @attribute()
  organization?: any;

  @attribute()
  representative?: any;

  @attribute()
  status: any;

  @attribute()
  tareWeight?: any;

  @attribute()
  trailerPlateNumber?: string;

  @attribute()
  operator: any;

  @attribute()
  vehiclePlateNumber: string;

  @attribute()
  weightType: any;
}

export interface IndexDataEvent {
  startDate?: string;
  endDate?: string;
}

const esClient = new Client({
  node: `http://localhost:9200`,
});

const dateBeforeAnyPolicies = new Date(2021, 0, 1).toISOString();

export const handler = async (event: IndexDataEvent): Promise<void> => {
  console.log('Received event to index values');

  try {
    for await (const item of scanTableFor(event)) {
      console.log(JSON.stringify(item, null, 2));

      if (item.status === 'DEPARTED') {
        await esClient.index({
          index: 'vehicles-cold',
          id: item.id,
          body: item,
        });
      } else {
        await esClient.index({
          index: 'vehicles-hot',
          id: item.id,
          body: item,
        });
      }
    }
  } catch (error) {
    console.error('Error occurred trying to index data', error);
    throw error;
  }
};

function scanTableFor(
  event: IndexDataEvent
): ScanIterator<YourDocumentTableObject> {
  if (!event.startDate && !event.endDate) {
    console.log(
      'Start date and end date not set so fetching all data from the table'
    );
    return dynamoMapper.scan(YourDocumentTableObject);
  }
  console.log(
    `Setting up filter between start date: ${getStartDate(
      event.startDate
    )} and end date: ${getEndDate(event.endDate)}`
  );
  return dynamoMapper.scan(YourDocumentTableObject, {
    filter: getFilterFor(event),
  });
}

const getFilterFor = (event: IndexDataEvent): ConditionExpression => ({
  type: 'Between',
  subject: 'updatedOn',
  lowerBound: getStartDate(event.startDate),
  upperBound: getEndDate(event.endDate),
});

const getStartDate = (startDate?: string): string =>
  startDate ?? dateBeforeAnyPolicies;

const getEndDate = (endDate?: string): string =>
  endDate ?? new Date().toISOString();

async function logger() {
  await handler({});
}

logger();
