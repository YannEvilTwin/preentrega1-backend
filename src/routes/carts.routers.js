const express = require('express');
const router = express.Router();
const CartManager = require('./cart-manager');
const ProductManager = require('./product-manager');

// Instancias de CartManager y ProductManager
const cartManager = new CartManager('./carritos.json');
const productManager = new ProductManager('./productos.json');

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = {
    id: Date.now().toString(), // Genera un id único basado en la marca de tiempo
    products: []
  };

  await cartManager.addCart(newCart);
  res.json({ message: 'Carrito creado correctamente', cart: newCart });
});

// Ruta para listar los productos en un carrito por su ID
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ruta para agregar un producto al carrito por su ID
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity) || 1; // Si no se proporciona la cantidad, se asume 1

  // Obtiene el producto desde el ProductManager
  const product = await productManager.getProductById(productId);

  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  // Obtiene el carrito desde el CartManager
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  // Busca si el producto ya existe en el carrito
  const existingProduct = cart.products.find(item => item.product === productId);

  if (existingProduct) {
    // Si el producto ya existe, incrementa la cantidad
    existingProduct.quantity += quantity;
  } else {
    // Si el producto no existe, lo agrega al carrito
    cart.products.push({
      product: productId,
      quantity: quantity
    });
  }

  // Actualiza el carrito con los cambios
  await cartManager.updateCart(cartId, cart);

  res.json({ message: 'Producto agregado al carrito correctamente', cart: cart });
});

module.exports = router;