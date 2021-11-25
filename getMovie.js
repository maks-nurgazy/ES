const { Client } = require('@elastic/elasticsearch');

const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;

const client = new Client({
  node: `http://${ES_HOST}:${ES_PORT}`,
});


async function getMovie(){


  client.search({
    index: 'movies',
    body: {
      query: {
        match: { title: 'One punch man' }
      },
    },
  }, (err, result) => {
    console.log("-------------------------------------------------------------------\n");

    result.body.hits.hits.forEach(res => {
      console.log(res);
    });

    console.log("\n-------------------------------------------------------------------");

    if (err) console.log(err);

  })
}

getMovie();
