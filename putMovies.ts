const { Client } = require("@elastic/elasticsearch");
import type { Client as NewTypes } from "@elastic/elasticsearch/api/new";

const client: NewTypes = new Client({
  node: "http://localhost:9200",
});

async function putMovie() {
  const data = await client.index({
    index: "movies",
    body: {
      id: "hello-max",
      genre: ["Horror"],
      title: "One punch man",
      year: 2021,
    },
  });

  console.log(data);
}

putMovie();
