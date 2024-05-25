const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const dotenv = require('dotenv');
const fs = require('fs');
const PROTO_PATH = "./proto/audio.proto";

// Carga la configuración del archivo .env
dotenv.config();

// Carga la implementación del archivo proto para JS
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const audioProto = grpc.loadPackageDefinition(packageDefinition);

// Crea un servidor gRPC
const server = new grpc.Server();
server.addService(audioProto.AudioService.service, { 
    downloadAudio: downloadAudioImpl, 
    uploadAudio: uploadAudioImpl });

/*server.addService(audioProto.ImageService.service, {
    downloadJPEG: downloadJPEGImpl,
    uploadJPEG: uploadJPEGImpl,
    downloadPNG: downloadPNGImpl,
    uploadPNG: uploadPNGImpl,
});*/

// Inicia el servidor en el puerto SERVER_PORT
server.bindAsync(`localhost:${process.env.SERVER_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Servidor gRPC en ejecución en el puerto ${process.env.SERVER_PORT}`);
});

// Implementación de downloadAudio
function downloadAudioImpl(call) {
    const stream = fs.createReadStream(`./audio/${call.request.nombre}`, { highWaterMark: 1024 });

    console.log(`\n\nEnviando el archivo: ${call.request.nombre}`);
    stream.on('data', function (chunk) {
        call.write({ data: chunk });
        process.stdout.write('.');
    }).on('end', function () {
        call.end();
        stream.close();
        console.log('\nEnvío de datos terminado.');
    });
}
// Implementación de uploadAudio
function uploadAudioImpl(call, callback) {
    let nombreArchivo, chunk;
    let tempFilePath;

    // Vamos a recibir el nombre y el stream
    call.on('data', async (DataChunkResponse) => {
        if (DataChunkResponse.nombre && DataChunkResponse.data) {
            nombreArchivo = DataChunkResponse.nombre;
            tempFilePath = `./audio/${nombreArchivo}`;
            chunk = DataChunkResponse.data;
            fs.appendFileSync(tempFilePath, chunk);
            process.stdout.write('.');
            console.debug(`Recibiendo el archivo: ${tempFilePath}`);
        }
    }).on('end', function () {
        callback(null, { nombre: nombreArchivo });
        console.log('\nEnvío de datos terminado.')
    })
}


/*
// Implementación de downloadJPEG
function downloadJPEGImpl(call) {
    const stream = fs.createReadStream(`./resources/${call.request.nombre}`);
    stream.on('data', function (chunk) {
        call.write({ data: chunk });
    }).on('end', function () {
        call.end();
        console.log('Envío de datos terminado.');
    });
}
// Implementación de uploadJPEG
function uploadJPEGImpl(call, callback) {
    let fileName;
    let tempFilePath;

    call.on('data', (DataChunkResponse) => {
        if (DataChunkResponse.nombre) {
            fileName = DataChunkResponse.nombre;
            tempFilePath = `./uploads/${fileName}`;
            console.debug(`Recibiendo el archivo JPEG: ${tempFilePath}`);
        } else if (DataChunkResponse.data) {
            fs.appendFileSync(tempFilePath, DataChunkResponse.data);
        }
    }).on('end', function () {
        callback(null, { nombre: fileName });
        console.log('Envío de datos terminado.');
    });
}

// Implementación de downloadPNG
function downloadPNGImpl(call) {
    const stream = fs.createReadStream(`./resources/${call.request.nombre}`);
    stream.on('data', function (chunk) {
        call.write({ data: chunk });
    }).on('end', function () {
        call.end();
        console.log('Envío de datos terminado.');
    });
}
// Implementación de uploadPNG
function uploadPNGImpl(call, callback) {
    let fileName;
    let tempFilePath;

    call.on('data', (DataChunkResponse) => {
        if (DataChunkResponse.nombre) {
            fileName = DataChunkResponse.nombre;
            tempFilePath = `./uploads/${fileName}`;
            console.debug(`Recibiendo el archivo PNG: ${tempFilePath}`);
        } else if (DataChunkResponse.data) {
            fs.appendFileSync(tempFilePath, DataChunkResponse.data);
        }
    }).on('end', function () {
        callback(null, { nombre: fileName });
        console.log('Envío de datos terminado.');
    });
}*/