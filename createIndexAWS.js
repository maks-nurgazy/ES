const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: `https://search-depo-hvq2xmgprnp2kih6xo2ff5lkja.us-east-1.es.amazonaws.com`,
});

async function createIndex() {
  const data = await client.index({
    index: 'products',
    body: {
      id: '1234321',
      genre: ['Horror'],
      title: 'One punch man',
      year: 2021,
    },
  });

  await client.indices.refresh({ index: 'products' });

  console.log(data);
}

createIndex();
