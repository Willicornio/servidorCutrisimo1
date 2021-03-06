const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const rsa = require('../rsa2/rsa-cybersecurity');
const bigconv = require('bigint-conversion');

const ___dirname = path.resolve();

global.puKey;
global.prKey;

async function claves() {
  const { publicKey, privateKey } = await rsa.generateRandomKeys(3072);

  puKey = publicKey;
  prKey = privateKey;

};


// settings
app.set('port', process.env.PORT || 8000);
app.set('json spaces', 2);

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes

// starting the server
app.listen(app.get('port'), () => {
  claves();
  console.log(`Server on port ${app.get('port')}`);
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(___dirname + '/test.json'));
});

app.get('/key', (req, res) => {

  class PublicKey {
    constructor(e, n) {
      this.e = bigconv.bigintToHex(e);
      this.n = bigconv.bigintToHex(n);
    }
  }

  publicKey = new PublicKey(
    puKey.e,
    puKey.n
  )

  res.status(200).send(publicKey);

});

app.post("/hola", (req, res) => {

  clientePublicKey = new rsa.PublicKey(bigconv.hexToBigint(req.body.mensaje.e),bigconv.hexToBigint(req.body.mensaje.n));
  console.log("Mensaje encriptado :     "+req.body.mensaje.c);
  mensajeRecibido = bigconv.bigintToText(prKey.decrypt(bigconv.hexToBigint(req.body.mensaje.c)));
  respuesta = "Hola CLIENTE --> " + mensajeRecibido
  console.log("Mensaje desencripado :  "+ mensajeRecibido);
  respuestaEncriptada = bigconv.bigintToHex(clientePublicKey.encrypt(bigconv.textToBigint(respuesta)));

  const cosas = {
    respuestaServidor: respuestaEncriptada
  }
  res.status(200).send(cosas);
});

app.post("/blindSign", (req, res) => {

  clientePublicKey = new rsa.PublicKey(bigconv.hexToBigint(req.body.mensaje.e),bigconv.hexToBigint(req.body.mensaje.n));

  mensajeRecibido = bigconv.bigintToText(prKey.decrypt(bigconv.hexToBigint(req.body.mensaje.c)));
  console.log(mensajeRecibido)
  respuestaFirmada = bigconv.bigintToHex(prKey.sign(bigconv.hexToBigint(req.body.mensaje.c)));

  const cosas = {
    respuestaServidor: respuestaFirmada
  }
  res.status(200).send(cosas);
});
