import http from "k6/http";
import { group, check, sleep } from "k6";

const BASE_URL = "http://weather-api.sre-cource.lapenok";
// Sleep duration between successive requests.
// You might want to edit the value of this variable or remove calls to the sleep function on the script.
const SLEEP_DURATION = 0.1;
// Global variables should be initialized.

export let options = {
  max_vus: 100,
  vus: 100,
  stages: [
    { duration: "30s", target: 10 },
    { duration: "4m", target: 100 },
    { duration: "30s", target: 0 }
  ]
}



export default function() {
    group("/Forecast/{cityId}", () => {
        let cityId = Math.floor(Math.random() * (10 - 1 + 1)) + 1; 

        // Request No. 1: 
        {
            let url = BASE_URL + `/Forecast/${cityId}`;
            // TODO: edit the parameters of the request body.
            let body = {"id": "long", "cityId": "long", "dateTime": "long", "temperature": "integer", "summary": "string"};
            let params = {headers: {"Content-Type": "application/json", "Accept": "application/json"}};
            let request = http.post(url, JSON.stringify(body), params);

            check(request, {
                "Success": (r) => r.status === 200
            });
        }
    });

    group("/WeatherForecast", () => {

        // Request No. 1: GetWeatherForecast
        {
            let url = BASE_URL + `/WeatherForecast`;
            let request = http.get(url);

            check(request, {
                "Success": (r) => r.status === 200
            });
        }
    });

    group("/Forecast", () => {

        // Request No. 1: 
        {
            let url = BASE_URL + `/Forecast`;
            let request = http.get(url);

            check(request, {
                "Success": (r) => r.status === 200
            });
        }
    });

    group("/Forecast/{id}", () => {
        let id = Math.floor(Math.random() * (50 - 1 + 1)) + 1; 

        // Request No. 1: 
        {
            let url = BASE_URL + `/Forecast/${id}`;
            let request = http.get(url);

            check(request, {
                "Success": (r) => r.status === 200
            });

            sleep(SLEEP_DURATION);
        }

        // Request No. 2: 
        {
            let url = BASE_URL + `/Forecast/${id}`;
            // TODO: edit the parameters of the request body.
            let body = {"id": "long", "cityId": "long", "dateTime": "long", "temperature": "integer", "summary": "string"};
            let params = {headers: {"Content-Type": "application/json", "Accept": "application/json"}};
            let request = http.put(url, JSON.stringify(body), params);

            check(request, {
                "Success": (r) => r.status === 200
            });
        }
    });

    group("/Cities/{id}", () => {
        let id = 'TODO_EDIT_THE_ID'; // specify value as there is no example value for this parameter in OpenAPI spec

        // Request No. 1: 
        {
            let url = BASE_URL + `/Cities/${id}`;
            let request = http.get(url);

            check(request, {
                "Success": (r) => r.status === 200
            });

            sleep(SLEEP_DURATION);
        }

        // Request No. 2: 
        {
            let url = BASE_URL + `/Cities/${id}`;
            // TODO: edit the parameters of the request body.
            let body = {"id": "long", "name": "string"};
            let params = {headers: {"Content-Type": "application/json", "Accept": "application/json"}};
            let request = http.put(url, JSON.stringify(body), params);

            check(request, {
                "Success": (r) => r.status === 200
            });
        }
    });

    group("/Cities", () => {

        // Request No. 1: 
        {
            let url = BASE_URL + `/Cities`;
            let request = http.get(url);

            check(request, {
                "Success": (r) => r.status === 200
            });

            sleep(SLEEP_DURATION);
        }

        // Request No. 2: 
        {
            let url = BASE_URL + `/Cities`;
            // TODO: edit the parameters of the request body.
            let body = {"id": "long", "name": "string"};
            let params = {headers: {"Content-Type": "application/json", "Accept": "application/json"}};
            let request = http.post(url, JSON.stringify(body), params);

            check(request, {
                "Success": (r) => r.status === 200
            });
        }
    });

}
