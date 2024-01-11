const express = require('express');
const router = express.Router();
const ProductManager = require('./product-manager');

// Crea una instancia de ProductManager
const productManager = new ProductManager('./productos.json');

// Ruta para listar todos los productos
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  const limit = parseInt(req.query.limit);

  if (limit > 0) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails
  } = req.body;

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status: true // Por defecto
  };

  await productManager.addProduct(newProduct);
  res.json({ message: 'Producto agregado correctamente', product: newProduct });
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  await productManager.updateProduct(productId, updatedProduct);
  res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManager.deleteProduct(productId);
  res.json({ message: 'Producto eliminado correctamente', productId });
});

module.exports = router;