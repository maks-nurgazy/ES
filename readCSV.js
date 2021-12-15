const csv = require('csvtojson');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const { Client } = require('@elastic/elasticsearch');

const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;

const esClient = new Client({
  node: `http://${ES_HOST}:${ES_PORT}`,
});

async function csvRead(path) {
  const jsonArray = await csv().fromFile(path);

  jsonArray.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!obj[key]) {
        delete obj[key];
      } else {
        if (obj[key].startsWith('{') && obj[key].endsWith('}')) {
          const d = JSON.parse(obj[key]);
          const unmarshalled = DynamoDB.Converter.unmarshall(d);
          obj[key] = unmarshalled;
        } else if (obj[key].startsWith('[') && obj[key].endsWith(']')) {
          const d = DynamoDB.Converter.unmarshall(JSON.parse(obj[key]));
          const data = Object.values(d);
          obj[key] = data;
        }
      }
    });
  });

  return jsonArray;
}

async function createIndexMapping(index, mappings) {
  const params = {
    index,
    body: {
      mappings: mappings,
      settings: {
        index: {
          number_of_shards: 3,
          number_of_replicas: 1,
        },
        analysis: {
          filter: {
            autocomplete_filter: {
              type: 'edge_ngram',
              min_gram: 1,
              max_gram: 30,
            },
          },
          analyzer: {
            autocomplete: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'autocomplete_filter'],
            },
          },
        },
      },
    },
  };

  return await esClient.indices.create(params);
}

function getUserMapping() {
  return {
    properties: {
      id: {
        type: 'keyword',
      },
      clinicName: { type: 'text', analyzer: 'autocomplete' },
      experience: {
        type: 'text',
      },
      experienceSince: {
        type: 'long',
      },
      email: {
        type: 'keyword',
      },
      education: {
        type: 'text',
      },
      firstName: {
        type: 'text',
        analyzer: 'autocomplete',
        fields: {
          raw: {
            type: 'keyword',
          },
        },
      },
      joinDate: {
        type: 'long',
      },
      lastName: {
        type: 'text',
        analyzer: 'autocomplete',
        fields: {
          raw: {
            type: 'keyword',
          },
        },
      },
      patronymic: {
        type: 'text',
        analyzer: 'autocomplete',
      },
      specialities: {
        type: 'text',
        analyzer: 'autocomplete',
      },
      phone: {
        type: 'keyword',
      },
      __typename: {
        type: 'keyword',
      },
      servicesDescription: {
        type: 'text',
      },
    },
  };
}

async function mapData(index, data) {
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

  // console.log(JSON.stringify(data, null, 2));
  await createIndexMapping(index, getUserMapping());
  await mapData(index, data);
}

async function main() {
  await manageIndex();
}

main();
