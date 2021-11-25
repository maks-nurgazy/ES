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

async function bulkIndex() {
  const params: RequestParams.Bulk = {
    body: [
      { index: { _index: 'vehicles-hot', _id: 'hello' } },
      {
        id: 'hello',
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
      { index: { _index: 'vehicles-cold', _id: 'second' } },
      {
        id: 'second',
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
      { index: { _index: 'vehicles-hot', _id: 'third' } },
      {
        id: 'third',
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
    ],
  };

  const data = await esClient.bulk(params);
  await esClient.indices.refresh({
    index: 'vehicles-hot',
  });

  console.log(JSON.stringify(data, null, 2));

  return data;
}

bulkIndex();
