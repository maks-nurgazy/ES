"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticClientFactory = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const AWS4 = __importStar(require("aws4"));
const elasticsearch_2 = require("@elastic/elasticsearch");
const stream_1 = require("stream");
class AwsEsConnection extends elasticsearch_2.Connection {
    constructor(opts) {
        super(opts);
    }
    getBodyString(body) {
        if (!body) {
            return body;
        }
        if (typeof body === 'string' || body instanceof String) {
            return body;
        }
        if (body instanceof Buffer) {
            return body.toString();
        }
        if (body instanceof stream_1.Readable) {
            throw new Error("Haven't implemented stream handling!!");
        }
        return body;
    }
    request(params, callback) {
        const body = this.getBodyString(params.body);
        const opts = {
            method: params.method,
            host: 'search-depo-hvq2xmgprnp2kih6xo2ff5lkja.us-east-1.es.amazonaws.com',
            path: `${params.path}?${params.querystring}`,
            service: 'es',
            region: 'us-east-1',
            body: body,
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
class ElasticClientFactory {
    constructor(esClusterBaseUrl) {
        this.esClusterBaseUrl = esClusterBaseUrl;
    }
    create() {
        return new elasticsearch_1.Client({
            node: this.esClusterBaseUrl,
            Connection: AwsEsConnection,
        });
    }
}
exports.ElasticClientFactory = ElasticClientFactory;
var domain = 'https://search-depo-hvq2xmgprnp2kih6xo2ff5lkja.us-east-1.es.amazonaws.com';
const esClient = new ElasticClientFactory(domain).create();
async function getMovie() {
    esClient.search({
        index: 'node-test',
        body: {
            query: {
                match: { title: 'Moneyball' },
            },
        },
    }, (err, result) => {
        console.log('-------------------------------------------------------------------\n');
        console.log(JSON.stringify(result.body.hits.hits));
        console.log('\n-------------------------------------------------------------------');
        if (err)
            console.log(err);
    });
}
getMovie();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluZ1NlYXJjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpZ25pbmdTZWFyY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBEQUFnRDtBQUNoRCwyQ0FBNkI7QUFDN0IsMERBQW9EO0FBR3BELG1DQUFrQztBQVFsQyxNQUFNLGVBQWdCLFNBQVEsMEJBQVU7SUFDdEMsWUFBWSxJQUF3QjtRQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQXdDO1FBQ3BELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPLElBQVksQ0FBQztTQUNyQjtRQUVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksWUFBWSxNQUFNLEVBQUU7WUFDdEQsT0FBTyxJQUFjLENBQUM7U0FDdkI7UUFFRCxJQUFJLElBQUksWUFBWSxNQUFNLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLElBQUksWUFBWSxpQkFBUSxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLE9BQU8sQ0FDWixNQUFzQixFQUN0QixRQUE0RTtRQUU1RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBaUI7WUFDekIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLElBQUksRUFBRSxtRUFBbUU7WUFDekUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQzVDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsTUFBTSxFQUFFLFdBQVc7WUFDbkIsSUFBSSxFQUFFLElBQUs7WUFDWCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87U0FDeEIsQ0FBQztRQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsZUFBZSxFQUFFLDBDQUEwQztZQUMzRCxXQUFXLEVBQUUsc0JBQXNCO1NBQ3BDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM5QixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFeEIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUFFRCxNQUFhLG9CQUFvQjtJQUMvQixZQUFvQixnQkFBd0I7UUFBeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO0lBQUcsQ0FBQztJQUVoRCxNQUFNO1FBQ0osT0FBTyxJQUFJLHNCQUFNLENBQUM7WUFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGVBQWU7U0FDNUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBVEQsb0RBU0M7QUFFRCxJQUFJLE1BQU0sR0FDUiwyRUFBMkUsQ0FBQztBQUM5RSxNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTNELEtBQUssVUFBVSxRQUFRO0lBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQ2I7UUFDRSxLQUFLLEVBQUUsV0FBVztRQUNsQixJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTthQUM5QjtTQUNGO0tBQ0YsRUFDRCxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQ1QsdUVBQXVFLENBQ3hFLENBQUM7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVuRCxPQUFPLENBQUMsR0FBRyxDQUNULHVFQUF1RSxDQUN4RSxDQUFDO1FBRUYsSUFBSSxHQUFHO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxRQUFRLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsaWVudCB9IGZyb20gJ0BlbGFzdGljL2VsYXN0aWNzZWFyY2gnO1xuaW1wb3J0ICogYXMgQVdTNCBmcm9tICdhd3M0JztcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICdAZWxhc3RpYy9lbGFzdGljc2VhcmNoJztcbmltcG9ydCB7IENvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAnQGVsYXN0aWMvZWxhc3RpY3NlYXJjaC9saWIvQ29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tICdzdHJlYW0nO1xuXG5pbnRlcmZhY2UgUmVxdWVzdE9wdGlvbnMgZXh0ZW5kcyBodHRwLkNsaWVudFJlcXVlc3RBcmdzIHtcbiAgYXNTdHJlYW0/OiBib29sZWFuO1xuICBib2R5Pzogc3RyaW5nIHwgQnVmZmVyIHwgUmVhZGFibGUgfCBudWxsO1xuICBxdWVyeXN0cmluZz86IHN0cmluZztcbn1cblxuY2xhc3MgQXdzRXNDb25uZWN0aW9uIGV4dGVuZHMgQ29ubmVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG9wdHM/OiBDb25uZWN0aW9uT3B0aW9ucykge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgZ2V0Qm9keVN0cmluZyhib2R5Pzogc3RyaW5nIHwgQnVmZmVyIHwgUmVhZGFibGUgfCBudWxsKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICByZXR1cm4gYm9keSBhcyBudWxsO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycgfHwgYm9keSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgcmV0dXJuIGJvZHkgYXMgc3RyaW5nO1xuICAgIH1cblxuICAgIGlmIChib2R5IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICByZXR1cm4gYm9keS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmIChib2R5IGluc3RhbmNlb2YgUmVhZGFibGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkhhdmVuJ3QgaW1wbGVtZW50ZWQgc3RyZWFtIGhhbmRsaW5nISFcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICBwdWJsaWMgcmVxdWVzdChcbiAgICBwYXJhbXM6IFJlcXVlc3RPcHRpb25zLFxuICAgIGNhbGxiYWNrOiAoZXJyOiBFcnJvciB8IG51bGwsIHJlc3BvbnNlOiBodHRwLkluY29taW5nTWVzc2FnZSB8IG51bGwpID0+IHZvaWRcbiAgKTogaHR0cC5DbGllbnRSZXF1ZXN0IHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5nZXRCb2R5U3RyaW5nKHBhcmFtcy5ib2R5KTtcbiAgICBjb25zdCBvcHRzOiBBV1M0LlJlcXVlc3QgPSB7XG4gICAgICBtZXRob2Q6IHBhcmFtcy5tZXRob2QsXG4gICAgICBob3N0OiAnc2VhcmNoLWRlcG8taHZxMnhtZ3BybnAya2loNnhvMmZmNWxramEudXMtZWFzdC0xLmVzLmFtYXpvbmF3cy5jb20nLFxuICAgICAgcGF0aDogYCR7cGFyYW1zLnBhdGh9PyR7cGFyYW1zLnF1ZXJ5c3RyaW5nfWAsXG4gICAgICBzZXJ2aWNlOiAnZXMnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIGJvZHk6IGJvZHkhLFxuICAgICAgaGVhZGVyczogcGFyYW1zLmhlYWRlcnMsXG4gICAgfTtcblxuICAgIEFXUzQuc2lnbihvcHRzLCB7XG4gICAgICBzZWNyZXRBY2Nlc3NLZXk6ICd2ejB0MnhNUHg4alhtSUtvSjY3L1VQajVjWEFqWGdmV0lsaW9EMnVDJyxcbiAgICAgIGFjY2Vzc0tleUlkOiAnQUtJQVo0NUJNTVI0Q0JFQTI1UlcnLFxuICAgIH0pO1xuXG4gICAgcGFyYW1zLmhlYWRlcnMgPSBvcHRzLmhlYWRlcnM7XG4gICAgcGFyYW1zLmJvZHkgPSBvcHRzLmJvZHk7XG5cbiAgICByZXR1cm4gc3VwZXIucmVxdWVzdChwYXJhbXMsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWxhc3RpY0NsaWVudEZhY3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVzQ2x1c3RlckJhc2VVcmw6IHN0cmluZykge31cblxuICBjcmVhdGUoKTogQ2xpZW50IHtcbiAgICByZXR1cm4gbmV3IENsaWVudCh7XG4gICAgICBub2RlOiB0aGlzLmVzQ2x1c3RlckJhc2VVcmwsXG4gICAgICBDb25uZWN0aW9uOiBBd3NFc0Nvbm5lY3Rpb24sXG4gICAgfSk7XG4gIH1cbn1cblxudmFyIGRvbWFpbiA9XG4gICdodHRwczovL3NlYXJjaC1kZXBvLWh2cTJ4bWdwcm5wMmtpaDZ4bzJmZjVsa2phLnVzLWVhc3QtMS5lcy5hbWF6b25hd3MuY29tJztcbmNvbnN0IGVzQ2xpZW50ID0gbmV3IEVsYXN0aWNDbGllbnRGYWN0b3J5KGRvbWFpbikuY3JlYXRlKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE1vdmllKCkge1xuICBlc0NsaWVudC5zZWFyY2goXG4gICAge1xuICAgICAgaW5kZXg6ICdub2RlLXRlc3QnLFxuICAgICAgYm9keToge1xuICAgICAgICBxdWVyeToge1xuICAgICAgICAgIG1hdGNoOiB7IHRpdGxlOiAnTW9uZXliYWxsJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuJ1xuICAgICAgKTtcblxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0LmJvZHkuaGl0cy5oaXRzKSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnXFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSdcbiAgICAgICk7XG5cbiAgICAgIGlmIChlcnIpIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuICApO1xufVxuXG5nZXRNb3ZpZSgpO1xuIl19