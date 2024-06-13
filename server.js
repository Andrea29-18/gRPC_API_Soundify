const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
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
    uploadAudio: uploadAudioImpl 
});

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

    call.on('data', async (DataChunkResponse) => {
        if (DataChunkResponse.nombre && DataChunkResponse.data) {
            nombreArchivo = DataChunkResponse.nombre;
            if (!path.extname(nombreArchivo)) {
                nombreArchivo += '.mp3'; // Añadir la extensión .mp3 si no está presente
            }
            tempFilePath = path.join(__dirname, 'audio', nombreArchivo);
            chunk = DataChunkResponse.data;
            fs.appendFileSync(tempFilePath, chunk);
            process.stdout.write('.');
            console.debug(`Recibiendo el archivo: ${tempFilePath}`);
        }
    }).on('end', function () {
        callback(null, { nombre: nombreArchivo });
        console.log('\nEnvío de datos terminado.');
    });
}
