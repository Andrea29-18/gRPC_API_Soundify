const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const dotenv = require('dotenv');
const fs = require('fs');
const readline = require('readline');
const PROTO_PATH = "./proto/audio.proto";

//Carga la configuración del archivo .env
dotenv.config();

//Carga la implementación del archivo proto para JS
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const audioProto = grpc.loadPackageDefinition(packageDefinition);

//Crea un cliente gRPC para el servicio de Audio
const audioClient = new audioProto.AudioService(`localhost:${process.env.SERVER_PORT}`, grpc.credentials.createInsecure());

//Crea un cliente gRPC para el servicio de Imágenes
const imageClient = new audioProto.ImageService(`localhost:${process.env.SERVER_PORT}`, grpc.credentials.createInsecure());

//Crear interfaz de línea de comandos para interactuar con el cliente
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Función que sube un archivo por stream
function uploadAudio(fileName) {
    console.log(`\Enviando el archivo: ${fileName}`);

    const serviceCall = audioClient.uploadAudio((err, response) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("\nEl servidor indica que recibió correctamente el archivo: " + response.nombre);
        console.log("Subida de audio completada.");
    });

    serviceCall.write({
        nombre: fileName
    });

    // Se crea un stream en chunk de 1024
    const stream = fs.createReadStream(`./resources/${fileName}`, { highWaterMark: 1024 });
    stream.on('data', (chunk) => {
        serviceCall.write({ data: chunk });
        process.stdout.write('.');
    }).on('end', function () {
        serviceCall.end();
        console.log('\nEnvío de datos de audio terminado.');
    });
}

//Función para descargar un archivo de audio del servidor
function downloadAudio(fileName) {
    const call = audioClient.downloadAudio({ nombre: fileName });

    call.on('data', function (chunk) {
        fs.appendFileSync(`./downloads/${fileName}`, chunk.data);
    });

    call.on('end', function () {
        console.log('Descarga de audio completa.');
    });
}

//Función para subir una imagen JPEG al servidor
function uploadJPEG(fileName) {
    const serviceCall = imageClient.uploadJPEG(function (err, response) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Imagen JPEG subida:', response.nombre);
    });

    serviceCall.write({
        nombre: fileName
    });

    const stream = fs.createReadStream(`./resources/${fileName}`, { highWaterMark: 1024 });
    stream.on('data', (chunk) => {
        serviceCall.write({ data: chunk });
        process.stdout.write('.');
    }).on('end', function () {
        serviceCall.end();
        console.log('\nEnvío de datos de imagen JPEG terminado.');
    });
}

//Función para descargar una imagen JPEG del servidor
function downloadJPEG(fileName) {
    const call = imageClient.downloadJPEG({ nombre: fileName });

    call.on('data', function (chunk) {
        fs.appendFileSync(`./downloads/${fileName}`, chunk.data);
    });

    call.on('end', function () {
        console.log('Descarga de imagen JPEG completa.');
    });
}

//Función para subir una imagen PNG al servidor
function uploadPNG(fileName) {
    const serviceCall = imageClient.uploadPNG(function (err, response) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Imagen PNG subida:', response.nombre);
    });

    serviceCall.write({
        nombre: fileName
    });

    const stream = fs.createReadStream(`./resources/${fileName}`, { highWaterMark: 1024 });
    stream.on('data', (chunk) => {
        serviceCall.write({ data: chunk });
        process.stdout.write('.');
    }).on('end', function () {
        serviceCall.end();
        console.log('\nEnvío de datos de imagen PNG terminado.');
    });
}

//Función para descargar una imagen PNG del servidor
function downloadPNG(fileName) {
    const call = imageClient.downloadPNG({ nombre: fileName });

    call.on('data', function (chunk) {
        fs.appendFileSync(`./downloads/${fileName}`, chunk.data);
    });

    call.on('end', function () {
        console.log('Descarga de imagen PNG completa.');
    });
}

//Interfaz de línea de comandos para interactuar con el cliente
rl.question('¿Qué acción deseas realizar? (upload_audio, download_audio, upload_jpeg, download_jpeg, upload_png, download_png): ', (answer) => {
    switch (answer) {
        case 'upload_audio':
            rl.question('Ingresa el nombre del archivo de audio a subir: ', (fileName) => {
                uploadAudio(fileName);
                rl.close();
            });
            break;
        case 'download_audio':
            rl.question('Ingresa el nombre del archivo de audio a descargar: ', (fileName) => {
                downloadAudio(fileName);
                rl.close();
            });
            break;
        case 'upload_jpeg':
            rl.question('Ingresa el nombre del archivo de imagen JPEG a subir: ', (fileName) => {
                uploadJPEG(fileName);
                rl.close();
            });
            break;
        case 'download_jpeg':
            rl.question('Ingresa el nombre del archivo de imagen JPEG a descargar: ', (fileName) => {
                downloadJPEG(fileName);
                rl.close();
            });
            break;
        case 'upload_png':
            rl.question('Ingresa el nombre del archivo de imagen PNG a subir: ', (fileName) => {
                uploadPNG(fileName);
                rl.close();
            });
            break;
        case 'download_png':
            rl.question('Ingresa el nombre del archivo de imagen PNG a descargar: ', (fileName) => {
                downloadPNG(fileName);
                rl.close();
            });
            break;
        default:
            console.log('Acción no válida.');
            rl.close();
            break;
    }
});
