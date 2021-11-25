"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Client } = require("@elastic/elasticsearch");
const client = new Client({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHV0TW92aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHV0TW92aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBR3JELE1BQU0sTUFBTSxHQUFhLElBQUksTUFBTSxDQUFDO0lBQ2xDLElBQUksRUFBRSx1QkFBdUI7Q0FDOUIsQ0FBQyxDQUFDO0FBRUgsS0FBSyxVQUFVLFFBQVE7SUFDckIsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzlCLEtBQUssRUFBRSxRQUFRO1FBQ2YsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLFdBQVc7WUFDZixLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDakIsS0FBSyxFQUFFLGVBQWU7WUFDdEIsSUFBSSxFQUFFLElBQUk7U0FDWDtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUVELFFBQVEsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBDbGllbnQgfSA9IHJlcXVpcmUoXCJAZWxhc3RpYy9lbGFzdGljc2VhcmNoXCIpO1xuaW1wb3J0IHR5cGUgeyBDbGllbnQgYXMgTmV3VHlwZXMgfSBmcm9tIFwiQGVsYXN0aWMvZWxhc3RpY3NlYXJjaC9hcGkvbmV3XCI7XG5cbmNvbnN0IGNsaWVudDogTmV3VHlwZXMgPSBuZXcgQ2xpZW50KHtcbiAgbm9kZTogXCJodHRwOi8vbG9jYWxob3N0OjkyMDBcIixcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBwdXRNb3ZpZSgpIHtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGNsaWVudC5pbmRleCh7XG4gICAgaW5kZXg6IFwibW92aWVzXCIsXG4gICAgYm9keToge1xuICAgICAgaWQ6IFwiaGVsbG8tbWF4XCIsXG4gICAgICBnZW5yZTogW1wiSG9ycm9yXCJdLFxuICAgICAgdGl0bGU6IFwiT25lIHB1bmNoIG1hblwiLFxuICAgICAgeWVhcjogMjAyMSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zb2xlLmxvZyhkYXRhKTtcbn1cblxucHV0TW92aWUoKTtcbiJdfQ==