const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    bd_path = './bd/database.json' 

    constructor(){
        this.leerBD();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad ( lugar = "" ){

        try {
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox

            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id:lugar.id,
                nombre:lugar.place_name,
                lng:lugar.center[0],
                lat:lugar.center[1]
            }));

        } catch (error) {
            console.log(error);

            return [];
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async climaLugar ( lat, lon ){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsOpenWeather
            });
            const resp = await instance.get();
            // console.log(resp.data);
            const { weather, main } = resp.data;

            return {
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description
            };
        } catch (error) {
            console.log(error);
        }
    }

    async agregarHistorial ( lugar = "" ){
        if (this.historial.includes( lugar.toLocaleLowerCase() )) {
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift( lugar.toLocaleLowerCase() );
        this.guardarBD();
    }

    guardarBD(){
        const payload = {
            historial : this.historial
        }
        fs.writeFileSync(this.bd_path, JSON.stringify( payload ));
    }

    leerBD(){
        if (!fs.existsSync( this.bd_path) ) return;
        const info = fs.readFileSync(this.bd_path,{encoding:'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }

}

module.exports = Busquedas;