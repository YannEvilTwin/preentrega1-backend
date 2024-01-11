const express = require('express');
const ProductManager = require('./product-manager');
const CartManager = require('./cart-manager'); // Asegúrate de tener un archivo 'cart-manager.js'

// Crea una instancia de Express
const app = express();

// Define el puerto en el que el servidor escuchará
const PUERTO = 8080;

// Crea una instancia de ProductManager para productos y otra para carritos
const productManager = new ProductManager('./src/productos.json');
const cartManager = new CartManager('./src/carts.json');

// Habilita el uso de JSON en las solicitudes
app.use(express.json());

// Rutas para productos
const productsRouter = require('./products.router');
app.use('/api/products', productsRouter(productManager));

// Rutas para carritos
const cartsRouter = require('./carts.router');
app.use('/api/carts', cartsRouter(cartManager, productManager));

// Inicia el servidor y escucha en el puerto especificado
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
