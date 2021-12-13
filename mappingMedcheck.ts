import { RequestParams } from '@opensearch-project/opensearch';

const csv = require('csvtojson');
import { Converter } from 'aws-sdk/clients/dynamodb';
import { Client, Connection } from '@opensearch-project/opensearch';

const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;

const esClient = new Client({
  node: `http://${ES_HOST}:${ES_PORT}`,
});

async function csvRead(path: string) {
  const jsonArray = await csv().fromFile(path);

  jsonArray.forEach((obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (!obj[key]) {
        delete obj[key];
      } else {
        if (obj[key].startsWith('{') && obj[key].endsWith('}')) {
          const d = JSON.parse(obj[key]);
          const unmarshalled = Converter.unmarshall(d);
          obj[key] = unmarshalled;
        } else if (obj[key].startsWith('[') && obj[key].endsWith(']')) {
          const d = Converter.unmarshall(JSON.parse(obj[key]));
          const data = Object.values(d);
          obj[key] = data;
        }
      }
    });
  });

  return jsonArray;
}

async function createIndexMapping(index: string, mappings: any) {
  const params:RequestParams.IndicesCreate = {
    index,
    body: {
      mappings: mappings,
      settings: {
        index: {
          number_of_shards: 3,
          number_of_replicas: 1,
        },
        analysis: {
          
        }
      },
    },
  };

  return await esClient.indices.create(params);
}

async function getUserMapping() {
  return {
    properties: {
      id: {
        type: 'keyword',
      },
    },
  };
}

async function mapData(index: string, data: any) {
  try {
    for await (const item of data) {
      await esClient.index({
        index,
        id: item.id,
        body: item,
      });
    }

    await esClient.indices.refresh({
      index,
    });
  } catch (error) {
    console.error('Error occurred trying to index data', error);
    throw error;
  }
}

async function manageIndex() {
  const csvFilePath = 'csvs/medcheck-users.csv';
  const index = 'users';

  const data = await csvRead(csvFilePath);

  console.log(data);
  await createIndexMapping(index, getUserMapping);
  await mapData(index, data);
}

async function main() {
  await manageIndex();
}

main();
