import { Client } from '@elastic/elasticsearch';
import * as AWS4 from 'aws4';
import { Connection } from '@elastic/elasticsearch';
import { ConnectionOptions } from '@elastic/elasticsearch/lib/Connection';
import * as http from 'http';
import { Readable } from 'stream';

interface RequestOptions extends http.ClientRequestArgs {
  asStream?: boolean;
  body?: string | Buffer | Readable | null;
  querystring?: string;
}

class AwsEsConnection extends Connection {
  constructor(opts?: ConnectionOptions) {
    super(opts);
  }

  getBodyString(body?: string | Buffer | Readable | null): string | null {
    if (!body) {
      return body as null;
    }

    if (typeof body === 'string' || body instanceof String) {
      return body as string;
    }

    if (body instanceof Buffer) {
      return body.toString();
    }

    if (body instanceof Readable) {
      throw new Error("Haven't implemented stream handling!!");
    }

    return body;
  }

  public request(
    params: RequestOptions,
    callback: (err: Error | null, response: http.IncomingMessage | null) => void
  ): http.ClientRequest {
    const body = this.getBodyString(params.body);
    const opts: AWS4.Request = {
      method: params.method,
      host: 'search-depo-hvq2xmgprnp2kih6xo2ff5lkja.us-east-1.es.amazonaws.com',
      path: `${params.path}?${params.querystring}`,
      service: 'es',
      region: 'us-east-1',
      body: body!,
      headers: params.headers,
    };

    AWS4.sign(opts, {
      secretAccessKey: 'vz0t2xMPx8jXmIKoJ67/UPj5cXAjXgfWIlioD2uC',
      accessKeyId: 'AKIAZ45BMMR4CBEA25RW',
    });

    params.headers = opts.headers;
    params.body = opts.body;

    return super.request(params, callback);
  }
}

export class ElasticClientFactory {
  constructor(private esClusterBaseUrl: string) {}

  create(): Client {
    return new Client({
      node: this.esClusterBaseUrl,
      Connection: AwsEsConnection,
    });
  }
}

var domain =
  'https://search-depo-hvq2xmgprnp2kih6xo2ff5lkja.us-east-1.es.amazonaws.com';
const esClient = new ElasticClientFactory(domain).create();

async function getMovie() {
  esClient.search(
    {
      index: 'node-test',
      body: {
        query: {
          match: { title: 'Moneyball' },
        },
      },
    },
    (err, result) => {
      console.log(
        '-------------------------------------------------------------------\n'
      );

      console.log(JSON.stringify(result.body.hits.hits));

      console.log(
        '\n-------------------------------------------------------------------'
      );

      if (err) console.log(err);
    }
  );
}

getMovie();
