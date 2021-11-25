const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "http://localhost:9200",
});

async function putMovie() {
  const data = await client.index({
    index: "movies",
    body: {
      id: '1234321',
      genre: ["Horror"],
      title: "One punch man",
      year: 2021,
    },
  });

  await client.indices.refresh({ index: 'movies' });

  console.log(data);
}

putMovie();
