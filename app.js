require('dotenv').config();
const { inquirerMenu, pausa, leerMensaje, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

require ("colors");


const main = async() =>{

    let opt = '';
    busqueda = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const lugar = await leerMensaje("Cuidad:");
                const lugares = await busqueda.ciudad(lugar);
                const id = await listarLugares(lugares);
                if(id === '0')continue;
                const lugarSel = lugares.find(l => l.id === id);
                busqueda.agregarHistorial(lugarSel.nombre);
                const buscarClima = await busqueda.climaLugar(lugarSel.lat,lugarSel.lng);

                console.clear();
                console.log("\nInformacion de la Cuidad");
                console.log("Cuidad",lugarSel.nombre.green);
                console.log("Lat",lugarSel.lat);
                console.log("Lng",lugarSel.lng);
                console.log("Temperatura", buscarClima.temp);
                console.log("Minima", buscarClima.min);
                console.log("Maxima", buscarClima.max);
                console.log("El clima está: ",buscarClima.desc.green);
                
                break;
            case 2:
                busqueda.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i +1}.`.green
                    console.log(`${idx} ${lugar}`);
                });
                break;
        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();