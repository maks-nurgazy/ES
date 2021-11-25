import { Client } from '@elastic/elasticsearch';
export declare class ElasticClientFactory {
    private esClusterBaseUrl;
    constructor(esClusterBaseUrl: string);
    create(): Client;
}
