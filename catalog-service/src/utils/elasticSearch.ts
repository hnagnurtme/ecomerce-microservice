import { Client } from '@elastic/elasticsearch';

export const elasticClient = new Client({
    node: 'http://elasticsearch:9200',
});
