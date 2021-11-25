const { Client } = require('@elastic/elasticsearch');

const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;

const client = new Client({
  node: `http://${ES_HOST}:${ES_PORT}`,
});

async function getMovies() {
  client.search(
    {
      index: 'movies',
      body: {
        query: {
          match_all: {},
        },
      },
    },
    (err, result) => {
      console.log(
        '-------------------------------------------------------------------\n'
      );
      console.log(result);
      // result.body.hits.hits.forEach((res) => {
      //   console.log(result);
      // });

      console.log(
        '\n-------------------------------------------------------------------'
      );

      if (err) console.log(err);
    }
  );
}

getMovies();
