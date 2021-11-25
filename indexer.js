import { DataMapper, ScanIterator } from '@aws/dynamodb-data-mapper';
import {
  attribute,
  hashKey,
  table,

} from '@aws/dynamodb-data-mapper-annotations';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import DynamoDB from 'aws-sdk/clients/dynamodb';

// of course move this dynamo mapper into a more appropriate place, and the table too
export const dynamoDb = new DynamoDB({ region: 'us-west-2' });
export const dynamoMapper = new DataMapper({ client: dynamoDb });

@table('Vehicles')
export class YourDocumentTableObject {
  @hashKey()
  id;

  @attribute()
  vehiclePlateNumber;
}

const dateBeforeAnyPolicies = new Date(2021, 0, 1).toISOString();

export const handler = async (event) => {
  console.log('Received event to index values');

  try {
    for await (const row of scanTableFor(event)) {
      console.log(JSON.stringify(row, null, 2));
    }
  } catch (error) {
    console.error('Error occurred trying to index data', error);
    throw error;
  }
};

function scanTableFor(event) {
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

const getFilterFor = (event) => ({
  type: 'Between',
  subject: 'updatedOn',
  lowerBound: getStartDate(event.startDate),
  upperBound: getEndDate(event.endDate),
});

const getStartDate = (startDate) => startDate ?? dateBeforeAnyPolicies;

const getEndDate = (endDate) => endDate ?? new Date().toISOString();

async function logger() {
  await handler({});
}

logger();
