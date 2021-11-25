"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opensearch_1 = require("@opensearch-project/opensearch");
const ES_HOST = '127.0.0.1';
const ES_PORT = 9200;
const esClient = new opensearch_1.Client({
    node: `http://${ES_HOST}:${ES_PORT}`,
});
async function bulkIndex() {
    const params = {
        body: [
            { index: { _index: 'vehicles-hot', _id: 'hello' } },
            {
                id: 'hello',
                arrivalPurpose: 'CARGO_IMPORT',
                netWeight: 0,
                status: 'ARRIVED',
                borderCheckpoint: '',
                driver: {
                    name: 'Anyone',
                },
                operator: {
                    id: '093c7baf-896b-4fd0-bc05-253eb7fac606',
                    organization: {
                        name: '',
                        id: '53ddbae9-0d27-420a-b692-6221e734b194',
                    },
                },
                tareWeight: 0,
                departureCountry: 'China',
                organization: {
                    name: '',
                    id: '53ddbae9-0d27-420a-b692-6221e734b194',
                },
                weightType: 'GROSS',
                vehiclePlateNumber: 'R4567GT',
                grossWeight: 300,
                arrivalDate: 1634806747244,
            },
            { index: { _index: 'vehicles-cold', _id: 'second' } },
            {
                id: 'second',
                arrivalPurpose: 'CARGO_IMPORT',
                netWeight: 0,
                status: 'ARRIVED',
                borderCheckpoint: '',
                driver: {
                    name: 'Anyone',
                },
                operator: {
                    id: '093c7baf-896b-4fd0-bc05-253eb7fac606',
                    organization: {
                        name: '',
                        id: '53ddbae9-0d27-420a-b692-6221e734b194',
                    },
                },
                tareWeight: 0,
                departureCountry: 'China',
                organization: {
                    name: '',
                    id: '53ddbae9-0d27-420a-b692-6221e734b194',
                },
                weightType: 'GROSS',
                vehiclePlateNumber: 'R4567GT',
                grossWeight: 300,
                arrivalDate: 1634806747244,
            },
            { index: { _index: 'vehicles-hot', _id: 'third' } },
            {
                id: 'third',
                arrivalPurpose: 'CARGO_IMPORT',
                netWeight: 0,
                status: 'ARRIVED',
                borderCheckpoint: '',
                driver: {
                    name: 'Anyone',
                },
                operator: {
                    id: '093c7baf-896b-4fd0-bc05-253eb7fac606',
                    organization: {
                        name: '',
                        id: '53ddbae9-0d27-420a-b692-6221e734b194',
                    },
                },
                tareWeight: 0,
                departureCountry: 'China',
                organization: {
                    name: '',
                    id: '53ddbae9-0d27-420a-b692-6221e734b194',
                },
                weightType: 'GROSS',
                vehiclePlateNumber: 'R4567GT',
                grossWeight: 300,
                arrivalDate: 1634806747244,
            },
        ],
    };
    const data = await esClient.bulk(params);
    await esClient.indices.refresh({
        index: 'vehicles-hot',
    });
    console.log(JSON.stringify(data, null, 2));
    return data;
}
bulkIndex();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa0luZGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVsa0luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBSXdDO0FBRXhDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUM1QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFFckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBTSxDQUFDO0lBQzFCLElBQUksRUFBRSxVQUFVLE9BQU8sSUFBSSxPQUFPLEVBQUU7Q0FDckMsQ0FBQyxDQUFDO0FBRUgsS0FBSyxVQUFVLFNBQVM7SUFDdEIsTUFBTSxNQUFNLEdBQXVCO1FBQ2pDLElBQUksRUFBRTtZQUNKLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDbkQ7Z0JBQ0UsRUFBRSxFQUFFLE9BQU87Z0JBQ1gsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixnQkFBZ0IsRUFBRSxFQUFFO2dCQUNwQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLEVBQUUsRUFBRSxzQ0FBc0M7b0JBQzFDLFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsRUFBRTt3QkFDUixFQUFFLEVBQUUsc0NBQXNDO3FCQUMzQztpQkFDRjtnQkFDRCxVQUFVLEVBQUUsQ0FBQztnQkFDYixnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLEVBQUU7b0JBQ1IsRUFBRSxFQUFFLHNDQUFzQztpQkFDM0M7Z0JBQ0QsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLGtCQUFrQixFQUFFLFNBQVM7Z0JBQzdCLFdBQVcsRUFBRSxHQUFHO2dCQUNoQixXQUFXLEVBQUUsYUFBYTthQUMzQjtZQUNELEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDckQ7Z0JBQ0UsRUFBRSxFQUFFLFFBQVE7Z0JBQ1osY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixnQkFBZ0IsRUFBRSxFQUFFO2dCQUNwQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLEVBQUUsRUFBRSxzQ0FBc0M7b0JBQzFDLFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsRUFBRTt3QkFDUixFQUFFLEVBQUUsc0NBQXNDO3FCQUMzQztpQkFDRjtnQkFDRCxVQUFVLEVBQUUsQ0FBQztnQkFDYixnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLEVBQUU7b0JBQ1IsRUFBRSxFQUFFLHNDQUFzQztpQkFDM0M7Z0JBQ0QsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLGtCQUFrQixFQUFFLFNBQVM7Z0JBQzdCLFdBQVcsRUFBRSxHQUFHO2dCQUNoQixXQUFXLEVBQUUsYUFBYTthQUMzQjtZQUNELEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDbkQ7Z0JBQ0UsRUFBRSxFQUFFLE9BQU87Z0JBQ1gsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixnQkFBZ0IsRUFBRSxFQUFFO2dCQUNwQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLEVBQUUsRUFBRSxzQ0FBc0M7b0JBQzFDLFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsRUFBRTt3QkFDUixFQUFFLEVBQUUsc0NBQXNDO3FCQUMzQztpQkFDRjtnQkFDRCxVQUFVLEVBQUUsQ0FBQztnQkFDYixnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLEVBQUU7b0JBQ1IsRUFBRSxFQUFFLHNDQUFzQztpQkFDM0M7Z0JBQ0QsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLGtCQUFrQixFQUFFLFNBQVM7Z0JBQzdCLFdBQVcsRUFBRSxHQUFHO2dCQUNoQixXQUFXLEVBQUUsYUFBYTthQUMzQjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzdCLEtBQUssRUFBRSxjQUFjO0tBQ3RCLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0MsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDbGllbnQsXG4gIENvbm5lY3Rpb24sXG4gIFJlcXVlc3RQYXJhbXMsXG59IGZyb20gJ0BvcGVuc2VhcmNoLXByb2plY3Qvb3BlbnNlYXJjaCc7XG5cbmNvbnN0IEVTX0hPU1QgPSAnMTI3LjAuMC4xJztcbmNvbnN0IEVTX1BPUlQgPSA5MjAwO1xuXG5jb25zdCBlc0NsaWVudCA9IG5ldyBDbGllbnQoe1xuICBub2RlOiBgaHR0cDovLyR7RVNfSE9TVH06JHtFU19QT1JUfWAsXG59KTtcblxuYXN5bmMgZnVuY3Rpb24gYnVsa0luZGV4KCkge1xuICBjb25zdCBwYXJhbXM6IFJlcXVlc3RQYXJhbXMuQnVsayA9IHtcbiAgICBib2R5OiBbXG4gICAgICB7IGluZGV4OiB7IF9pbmRleDogJ3ZlaGljbGVzLWhvdCcsIF9pZDogJ2hlbGxvJyB9IH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnaGVsbG8nLFxuICAgICAgICBhcnJpdmFsUHVycG9zZTogJ0NBUkdPX0lNUE9SVCcsXG4gICAgICAgIG5ldFdlaWdodDogMCxcbiAgICAgICAgc3RhdHVzOiAnQVJSSVZFRCcsXG4gICAgICAgIGJvcmRlckNoZWNrcG9pbnQ6ICcnLFxuICAgICAgICBkcml2ZXI6IHtcbiAgICAgICAgICBuYW1lOiAnQW55b25lJyxcbiAgICAgICAgfSxcbiAgICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgICBpZDogJzA5M2M3YmFmLTg5NmItNGZkMC1iYzA1LTI1M2ViN2ZhYzYwNicsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB7XG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGlkOiAnNTNkZGJhZTktMGQyNy00MjBhLWI2OTItNjIyMWU3MzRiMTk0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB0YXJlV2VpZ2h0OiAwLFxuICAgICAgICBkZXBhcnR1cmVDb3VudHJ5OiAnQ2hpbmEnLFxuICAgICAgICBvcmdhbml6YXRpb246IHtcbiAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICBpZDogJzUzZGRiYWU5LTBkMjctNDIwYS1iNjkyLTYyMjFlNzM0YjE5NCcsXG4gICAgICAgIH0sXG4gICAgICAgIHdlaWdodFR5cGU6ICdHUk9TUycsXG4gICAgICAgIHZlaGljbGVQbGF0ZU51bWJlcjogJ1I0NTY3R1QnLFxuICAgICAgICBncm9zc1dlaWdodDogMzAwLFxuICAgICAgICBhcnJpdmFsRGF0ZTogMTYzNDgwNjc0NzI0NCxcbiAgICAgIH0sXG4gICAgICB7IGluZGV4OiB7IF9pbmRleDogJ3ZlaGljbGVzLWNvbGQnLCBfaWQ6ICdzZWNvbmQnIH0gfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdzZWNvbmQnLFxuICAgICAgICBhcnJpdmFsUHVycG9zZTogJ0NBUkdPX0lNUE9SVCcsXG4gICAgICAgIG5ldFdlaWdodDogMCxcbiAgICAgICAgc3RhdHVzOiAnQVJSSVZFRCcsXG4gICAgICAgIGJvcmRlckNoZWNrcG9pbnQ6ICcnLFxuICAgICAgICBkcml2ZXI6IHtcbiAgICAgICAgICBuYW1lOiAnQW55b25lJyxcbiAgICAgICAgfSxcbiAgICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgICBpZDogJzA5M2M3YmFmLTg5NmItNGZkMC1iYzA1LTI1M2ViN2ZhYzYwNicsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB7XG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGlkOiAnNTNkZGJhZTktMGQyNy00MjBhLWI2OTItNjIyMWU3MzRiMTk0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB0YXJlV2VpZ2h0OiAwLFxuICAgICAgICBkZXBhcnR1cmVDb3VudHJ5OiAnQ2hpbmEnLFxuICAgICAgICBvcmdhbml6YXRpb246IHtcbiAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICBpZDogJzUzZGRiYWU5LTBkMjctNDIwYS1iNjkyLTYyMjFlNzM0YjE5NCcsXG4gICAgICAgIH0sXG4gICAgICAgIHdlaWdodFR5cGU6ICdHUk9TUycsXG4gICAgICAgIHZlaGljbGVQbGF0ZU51bWJlcjogJ1I0NTY3R1QnLFxuICAgICAgICBncm9zc1dlaWdodDogMzAwLFxuICAgICAgICBhcnJpdmFsRGF0ZTogMTYzNDgwNjc0NzI0NCxcbiAgICAgIH0sXG4gICAgICB7IGluZGV4OiB7IF9pbmRleDogJ3ZlaGljbGVzLWhvdCcsIF9pZDogJ3RoaXJkJyB9IH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAndGhpcmQnLFxuICAgICAgICBhcnJpdmFsUHVycG9zZTogJ0NBUkdPX0lNUE9SVCcsXG4gICAgICAgIG5ldFdlaWdodDogMCxcbiAgICAgICAgc3RhdHVzOiAnQVJSSVZFRCcsXG4gICAgICAgIGJvcmRlckNoZWNrcG9pbnQ6ICcnLFxuICAgICAgICBkcml2ZXI6IHtcbiAgICAgICAgICBuYW1lOiAnQW55b25lJyxcbiAgICAgICAgfSxcbiAgICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgICBpZDogJzA5M2M3YmFmLTg5NmItNGZkMC1iYzA1LTI1M2ViN2ZhYzYwNicsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB7XG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGlkOiAnNTNkZGJhZTktMGQyNy00MjBhLWI2OTItNjIyMWU3MzRiMTk0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB0YXJlV2VpZ2h0OiAwLFxuICAgICAgICBkZXBhcnR1cmVDb3VudHJ5OiAnQ2hpbmEnLFxuICAgICAgICBvcmdhbml6YXRpb246IHtcbiAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICBpZDogJzUzZGRiYWU5LTBkMjctNDIwYS1iNjkyLTYyMjFlNzM0YjE5NCcsXG4gICAgICAgIH0sXG4gICAgICAgIHdlaWdodFR5cGU6ICdHUk9TUycsXG4gICAgICAgIHZlaGljbGVQbGF0ZU51bWJlcjogJ1I0NTY3R1QnLFxuICAgICAgICBncm9zc1dlaWdodDogMzAwLFxuICAgICAgICBhcnJpdmFsRGF0ZTogMTYzNDgwNjc0NzI0NCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcblxuICBjb25zdCBkYXRhID0gYXdhaXQgZXNDbGllbnQuYnVsayhwYXJhbXMpO1xuICBhd2FpdCBlc0NsaWVudC5pbmRpY2VzLnJlZnJlc2goe1xuICAgIGluZGV4OiAndmVoaWNsZXMtaG90JyxcbiAgfSk7XG5cbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5idWxrSW5kZXgoKTtcbiJdfQ==