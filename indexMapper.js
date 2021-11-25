"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.YourDocumentTableObject = exports.dynamoMapper = exports.dynamoDb = void 0;
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const elasticsearch_1 = require("@elastic/elasticsearch");
// of course move this dynamo mapper into a more appropriate place, and the table too
exports.dynamoDb = new DynamoDB({ region: 'us-west-2' });
exports.dynamoMapper = new dynamodb_data_mapper_1.DataMapper({ client: exports.dynamoDb });
let YourDocumentTableObject = class YourDocumentTableObject {
};
__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    __metadata("design:type", String)
], YourDocumentTableObject.prototype, "id", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", String)
], YourDocumentTableObject.prototype, "actFormNumber", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Number)
], YourDocumentTableObject.prototype, "arrivalDate", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "arrivalPurpose", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", String)
], YourDocumentTableObject.prototype, "borderCheckpoint", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", String)
], YourDocumentTableObject.prototype, "departureCountry", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Number)
], YourDocumentTableObject.prototype, "departureDate", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "driver", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Number)
], YourDocumentTableObject.prototype, "grossWeight", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Number)
], YourDocumentTableObject.prototype, "netWeight", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "organization", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "representative", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "status", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Number)
], YourDocumentTableObject.prototype, "tareWeight", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", String)
], YourDocumentTableObject.prototype, "trailerPlateNumber", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "operator", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", String)
], YourDocumentTableObject.prototype, "vehiclePlateNumber", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Object)
], YourDocumentTableObject.prototype, "weightType", void 0);
YourDocumentTableObject = __decorate([
    (0, dynamodb_data_mapper_annotations_1.table)('Vehicles')
], YourDocumentTableObject);
exports.YourDocumentTableObject = YourDocumentTableObject;
const esClient = new elasticsearch_1.Client({
    node: `http://localhost:9200`,
});
const dateBeforeAnyPolicies = new Date(2021, 0, 1).toISOString();
const handler = async (event) => {
    console.log('Received event to index values');
    try {
        for await (const item of scanTableFor(event)) {
            console.log(JSON.stringify(item, null, 2));
            if (item.status === 'DEPARTED') {
                await esClient.index({
                    index: 'vehicles-cold',
                    id: item.id,
                    body: item,
                });
            }
            else {
                await esClient.index({
                    index: 'vehicles-hot',
                    id: item.id,
                    body: item,
                });
            }
        }
    }
    catch (error) {
        console.error('Error occurred trying to index data', error);
        throw error;
    }
};
exports.handler = handler;
function scanTableFor(event) {
    if (!event.startDate && !event.endDate) {
        console.log('Start date and end date not set so fetching all data from the table');
        return exports.dynamoMapper.scan(YourDocumentTableObject);
    }
    console.log(`Setting up filter between start date: ${getStartDate(event.startDate)} and end date: ${getEndDate(event.endDate)}`);
    return exports.dynamoMapper.scan(YourDocumentTableObject, {
        filter: getFilterFor(event),
    });
}
const getFilterFor = (event) => ({
    type: 'Between',
    subject: 'updatedOn',
    lowerBound: getStartDate(event.startDate),
    upperBound: getEndDate(event.endDate),
});
const getStartDate = (startDate) => startDate !== null && startDate !== void 0 ? startDate : dateBeforeAnyPolicies;
const getEndDate = (endDate) => endDate !== null && endDate !== void 0 ? endDate : new Date().toISOString();
async function logger() {
    await (0, exports.handler)({});
}
logger();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhNYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleE1hcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvRUFBcUU7QUFDckUsNEZBSStDO0FBRS9DLHFEQUFzRDtBQUN0RCwwREFBZ0Q7QUFFaEQscUZBQXFGO0FBQ3hFLFFBQUEsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDakQsUUFBQSxZQUFZLEdBQUcsSUFBSSxpQ0FBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLGdCQUFRLEVBQUUsQ0FBQyxDQUFDO0FBR2pFLElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXVCO0NBc0RuQyxDQUFBO0FBcERDO0lBREMsSUFBQSwwQ0FBTyxHQUFFOzttREFDRTtBQUdaO0lBREMsSUFBQSw0Q0FBUyxHQUFFOzs4REFDVztBQUd2QjtJQURDLElBQUEsNENBQVMsR0FBRTs7NERBQ1E7QUFHcEI7SUFEQyxJQUFBLDRDQUFTLEdBQUU7OytEQUNRO0FBR3BCO0lBREMsSUFBQSw0Q0FBUyxHQUFFOztpRUFDYztBQUcxQjtJQURDLElBQUEsNENBQVMsR0FBRTs7aUVBQ2E7QUFHekI7SUFEQyxJQUFBLDRDQUFTLEdBQUU7OzhEQUNXO0FBR3ZCO0lBREMsSUFBQSw0Q0FBUyxHQUFFOzt1REFDQztBQUdiO0lBREMsSUFBQSw0Q0FBUyxHQUFFOzs0REFDUTtBQUdwQjtJQURDLElBQUEsNENBQVMsR0FBRTs7MERBQ087QUFHbkI7SUFEQyxJQUFBLDRDQUFTLEdBQUU7OzZEQUNPO0FBR25CO0lBREMsSUFBQSw0Q0FBUyxHQUFFOzsrREFDUztBQUdyQjtJQURDLElBQUEsNENBQVMsR0FBRTs7dURBQ0E7QUFHWjtJQURDLElBQUEsNENBQVMsR0FBRTs7MkRBQ1E7QUFHcEI7SUFEQyxJQUFBLDRDQUFTLEdBQUU7O21FQUNnQjtBQUc1QjtJQURDLElBQUEsNENBQVMsR0FBRTs7eURBQ0U7QUFHZDtJQURDLElBQUEsNENBQVMsR0FBRTs7bUVBQ2U7QUFHM0I7SUFEQyxJQUFBLDRDQUFTLEdBQUU7OzJEQUNJO0FBckRMLHVCQUF1QjtJQURuQyxJQUFBLHdDQUFLLEVBQUMsVUFBVSxDQUFDO0dBQ0wsdUJBQXVCLENBc0RuQztBQXREWSwwREFBdUI7QUE2RHBDLE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQU0sQ0FBQztJQUMxQixJQUFJLEVBQUUsdUJBQXVCO0NBQzlCLENBQUMsQ0FBQztBQUVILE1BQU0scUJBQXFCLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUUxRCxNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBcUIsRUFBaUIsRUFBRTtJQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFFOUMsSUFBSTtRQUNGLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7Z0JBQzlCLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFDbkIsS0FBSyxFQUFFLGVBQWU7b0JBQ3RCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDWCxJQUFJLEVBQUUsSUFBSTtpQkFDWCxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQ25CLEtBQUssRUFBRSxjQUFjO29CQUNyQixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLElBQUk7aUJBQ1gsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtLQUNGO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVELE1BQU0sS0FBSyxDQUFDO0tBQ2I7QUFDSCxDQUFDLENBQUM7QUF6QlcsUUFBQSxPQUFPLFdBeUJsQjtBQUVGLFNBQVMsWUFBWSxDQUNuQixLQUFxQjtJQUVyQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxxRUFBcUUsQ0FDdEUsQ0FBQztRQUNGLE9BQU8sb0JBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNuRDtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQ1QseUNBQXlDLFlBQVksQ0FDbkQsS0FBSyxDQUFDLFNBQVMsQ0FDaEIsa0JBQWtCLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FDL0MsQ0FBQztJQUNGLE9BQU8sb0JBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUU7UUFDaEQsTUFBTSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUM7S0FDNUIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBcUIsRUFBdUIsRUFBRSxDQUFDLENBQUM7SUFDcEUsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsV0FBVztJQUNwQixVQUFVLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDekMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0NBQ3RDLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBa0IsRUFBVSxFQUFFLENBQ2xELFNBQVMsYUFBVCxTQUFTLGNBQVQsU0FBUyxHQUFJLHFCQUFxQixDQUFDO0FBRXJDLE1BQU0sVUFBVSxHQUFHLENBQUMsT0FBZ0IsRUFBVSxFQUFFLENBQzlDLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7QUFFdEMsS0FBSyxVQUFVLE1BQU07SUFDbkIsTUFBTSxJQUFBLGVBQU8sRUFBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBRUQsTUFBTSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhTWFwcGVyLCBTY2FuSXRlcmF0b3IgfSBmcm9tICdAYXdzL2R5bmFtb2RiLWRhdGEtbWFwcGVyJztcbmltcG9ydCB7XG4gIGF0dHJpYnV0ZSxcbiAgaGFzaEtleSxcbiAgdGFibGUsXG59IGZyb20gJ0Bhd3MvZHluYW1vZGItZGF0YS1tYXBwZXItYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgQ29uZGl0aW9uRXhwcmVzc2lvbiB9IGZyb20gJ0Bhd3MvZHluYW1vZGItZXhwcmVzc2lvbnMnO1xuaW1wb3J0IER5bmFtb0RCID0gcmVxdWlyZSgnYXdzLXNkay9jbGllbnRzL2R5bmFtb2RiJyk7XG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICdAZWxhc3RpYy9lbGFzdGljc2VhcmNoJztcblxuLy8gb2YgY291cnNlIG1vdmUgdGhpcyBkeW5hbW8gbWFwcGVyIGludG8gYSBtb3JlIGFwcHJvcHJpYXRlIHBsYWNlLCBhbmQgdGhlIHRhYmxlIHRvb1xuZXhwb3J0IGNvbnN0IGR5bmFtb0RiID0gbmV3IER5bmFtb0RCKHsgcmVnaW9uOiAndXMtd2VzdC0yJyB9KTtcbmV4cG9ydCBjb25zdCBkeW5hbW9NYXBwZXIgPSBuZXcgRGF0YU1hcHBlcih7IGNsaWVudDogZHluYW1vRGIgfSk7XG5cbkB0YWJsZSgnVmVoaWNsZXMnKVxuZXhwb3J0IGNsYXNzIFlvdXJEb2N1bWVudFRhYmxlT2JqZWN0IHtcbiAgQGhhc2hLZXkoKVxuICBpZCE6IHN0cmluZztcblxuICBAYXR0cmlidXRlKClcbiAgYWN0Rm9ybU51bWJlcj86IHN0cmluZztcblxuICBAYXR0cmlidXRlKClcbiAgYXJyaXZhbERhdGU6IG51bWJlcjtcblxuICBAYXR0cmlidXRlKClcbiAgYXJyaXZhbFB1cnBvc2U6IGFueTtcblxuICBAYXR0cmlidXRlKClcbiAgYm9yZGVyQ2hlY2twb2ludD86IHN0cmluZztcblxuICBAYXR0cmlidXRlKClcbiAgZGVwYXJ0dXJlQ291bnRyeTogc3RyaW5nO1xuXG4gIEBhdHRyaWJ1dGUoKVxuICBkZXBhcnR1cmVEYXRlPzogbnVtYmVyO1xuXG4gIEBhdHRyaWJ1dGUoKVxuICBkcml2ZXI/OiBhbnk7XG5cbiAgQGF0dHJpYnV0ZSgpXG4gIGdyb3NzV2VpZ2h0OiBudW1iZXI7XG5cbiAgQGF0dHJpYnV0ZSgpXG4gIG5ldFdlaWdodD86IG51bWJlcjtcblxuICBAYXR0cmlidXRlKClcbiAgb3JnYW5pemF0aW9uPzogYW55O1xuXG4gIEBhdHRyaWJ1dGUoKVxuICByZXByZXNlbnRhdGl2ZT86IGFueTtcblxuICBAYXR0cmlidXRlKClcbiAgc3RhdHVzOiBhbnk7XG5cbiAgQGF0dHJpYnV0ZSgpXG4gIHRhcmVXZWlnaHQ/OiBudW1iZXI7XG5cbiAgQGF0dHJpYnV0ZSgpXG4gIHRyYWlsZXJQbGF0ZU51bWJlcj86IHN0cmluZztcblxuICBAYXR0cmlidXRlKClcbiAgb3BlcmF0b3I6IGFueTtcblxuICBAYXR0cmlidXRlKClcbiAgdmVoaWNsZVBsYXRlTnVtYmVyOiBzdHJpbmc7XG5cbiAgQGF0dHJpYnV0ZSgpXG4gIHdlaWdodFR5cGU6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRleERhdGFFdmVudCB7XG4gIHN0YXJ0RGF0ZT86IHN0cmluZztcbiAgZW5kRGF0ZT86IHN0cmluZztcbn1cblxuY29uc3QgZXNDbGllbnQgPSBuZXcgQ2xpZW50KHtcbiAgbm9kZTogYGh0dHA6Ly9sb2NhbGhvc3Q6OTIwMGAsXG59KTtcblxuY29uc3QgZGF0ZUJlZm9yZUFueVBvbGljaWVzID0gbmV3IERhdGUoMjAyMSwgMCwgMSkudG9JU09TdHJpbmcoKTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEluZGV4RGF0YUV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBldmVudCB0byBpbmRleCB2YWx1ZXMnKTtcblxuICB0cnkge1xuICAgIGZvciBhd2FpdCAoY29uc3QgaXRlbSBvZiBzY2FuVGFibGVGb3IoZXZlbnQpKSB7XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShpdGVtLCBudWxsLCAyKSk7XG5cbiAgICAgIGlmIChpdGVtLnN0YXR1cyA9PT0gJ0RFUEFSVEVEJykge1xuICAgICAgICBhd2FpdCBlc0NsaWVudC5pbmRleCh7XG4gICAgICAgICAgaW5kZXg6ICd2ZWhpY2xlcy1jb2xkJyxcbiAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICBib2R5OiBpdGVtLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGVzQ2xpZW50LmluZGV4KHtcbiAgICAgICAgICBpbmRleDogJ3ZlaGljbGVzLWhvdCcsXG4gICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgYm9keTogaXRlbSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9jY3VycmVkIHRyeWluZyB0byBpbmRleCBkYXRhJywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzY2FuVGFibGVGb3IoXG4gIGV2ZW50OiBJbmRleERhdGFFdmVudFxuKTogU2Nhbkl0ZXJhdG9yPFlvdXJEb2N1bWVudFRhYmxlT2JqZWN0PiB7XG4gIGlmICghZXZlbnQuc3RhcnREYXRlICYmICFldmVudC5lbmREYXRlKSB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICAnU3RhcnQgZGF0ZSBhbmQgZW5kIGRhdGUgbm90IHNldCBzbyBmZXRjaGluZyBhbGwgZGF0YSBmcm9tIHRoZSB0YWJsZSdcbiAgICApO1xuICAgIHJldHVybiBkeW5hbW9NYXBwZXIuc2NhbihZb3VyRG9jdW1lbnRUYWJsZU9iamVjdCk7XG4gIH1cbiAgY29uc29sZS5sb2coXG4gICAgYFNldHRpbmcgdXAgZmlsdGVyIGJldHdlZW4gc3RhcnQgZGF0ZTogJHtnZXRTdGFydERhdGUoXG4gICAgICBldmVudC5zdGFydERhdGVcbiAgICApfSBhbmQgZW5kIGRhdGU6ICR7Z2V0RW5kRGF0ZShldmVudC5lbmREYXRlKX1gXG4gICk7XG4gIHJldHVybiBkeW5hbW9NYXBwZXIuc2NhbihZb3VyRG9jdW1lbnRUYWJsZU9iamVjdCwge1xuICAgIGZpbHRlcjogZ2V0RmlsdGVyRm9yKGV2ZW50KSxcbiAgfSk7XG59XG5cbmNvbnN0IGdldEZpbHRlckZvciA9IChldmVudDogSW5kZXhEYXRhRXZlbnQpOiBDb25kaXRpb25FeHByZXNzaW9uID0+ICh7XG4gIHR5cGU6ICdCZXR3ZWVuJyxcbiAgc3ViamVjdDogJ3VwZGF0ZWRPbicsXG4gIGxvd2VyQm91bmQ6IGdldFN0YXJ0RGF0ZShldmVudC5zdGFydERhdGUpLFxuICB1cHBlckJvdW5kOiBnZXRFbmREYXRlKGV2ZW50LmVuZERhdGUpLFxufSk7XG5cbmNvbnN0IGdldFN0YXJ0RGF0ZSA9IChzdGFydERhdGU/OiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgc3RhcnREYXRlID8/IGRhdGVCZWZvcmVBbnlQb2xpY2llcztcblxuY29uc3QgZ2V0RW5kRGF0ZSA9IChlbmREYXRlPzogc3RyaW5nKTogc3RyaW5nID0+XG4gIGVuZERhdGUgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuXG5hc3luYyBmdW5jdGlvbiBsb2dnZXIoKSB7XG4gIGF3YWl0IGhhbmRsZXIoe30pO1xufVxuXG5sb2dnZXIoKTtcbiJdfQ==