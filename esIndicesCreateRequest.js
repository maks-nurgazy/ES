const { Client } = require('@elastic/elasticsearch');

const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;

const esClient = new Client({
  node: `http://${ES_HOST}:${ES_PORT}`,
});

const vehicleMapping = {
  properties: {
    id: {
      type: 'keyword',
    },
    actFormNumber: {
      type: 'text',
    },
    arrivalDate: {
      type: 'long',
    },
    arrivalPurpose: {
      type: 'keyword',
    },
    borderCheckpoint: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    departureCountry: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    departureDate: {
      type: 'long',
    },
    grossWeight: {
      type: 'double',
    },
    netWeight: {
      type: 'double',
    },
    driver: {
      properties: {
        name: {
          type: 'text',
        },
        phone: {
          type: 'keyword',
        },
      },
    },
    operator: {
      properties: {
        id: {
          type: 'keyword',
        },
        organization: {
          properties: {
            id: {
              type: 'keyword',
            },
          },
        },
      },
    },
    organization: {
      properties: {
        id: {
          type: 'keyword',
        },
      },
    },
    representative: {
      properties: {
        name: {
          type: 'text',
        },
        phone: {
          type: 'keyword',
        },
        role: {
          type: 'keyword',
        },
      },
    },
    status: {
      type: 'keyword',
    },
    tareWeight: {
      type: 'double',
    },
    trailerPlateNumber: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    vehiclePlateNumber: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    weightType: {
      type: 'keyword',
    },
  },
};

async function esIndicesCreateRequest(index) {
  const params = {
    index,
    body: {
      mappings: vehicleMapping,
      settings: {
        index: {
          number_of_shards: 3,
          number_of_replicas: 1,
        },
      },
    },
  };

  return await esClient.indices.create(params);
}

esIndicesCreateRequest('vehicles-hot');
esIndicesCreateRequest('vehicles-cold');
