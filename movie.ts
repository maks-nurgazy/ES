const { Client } = require("@elastic/elasticsearch");
import type { Client as NewTypes } from "@elastic/elasticsearch/api/new";

const client: NewTypes = new Client({
  node: "http://localhost:9200",
});

const print = (err: any, result: any) => {
  console.log(
    "-------------------------------------------------------------------\n"
  );

  result.body.hits.hits.forEach((res: any) => {
    console.log(res);
  });

  console.log(
    "\n-------------------------------------------------------------------"
  );

  if (err) console.log(err);
};

async function getMovie() {
  client.search(
    {
      index: "movies",
      body: {
        query: {
          match: { title: "Interstellar" },
        },
      },
    },
    print
  );
}

getMovie();
