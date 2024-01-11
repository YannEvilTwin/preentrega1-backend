const fs = require('fs').promises;

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.initialize();
  }

  async initialize() {
    await this.loadCartsFromDisk();
  }

  async loadCartsFromDisk() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      // Si hay un error al leer el archivo, se ignora y se continúa con un array vacío
      this.carts = [];
    }
  }

  async saveCartsToDisk() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error al guardar carritos en el archivo', error);
    }
  }

  async createCart() {
    const newCart = {
      id: this.generateUniqueId(),
      products: []
    };

    this.carts.push(newCart);
    await this.saveCartsToDisk();

    return newCart;
  }

  async getCartById(cartId) {
    return this.carts.find(cart => cart.id === cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);

    if (cart) {
      const existingProduct = cart.products.find(item => item.product === productId);

      if (existingProduct) {
        // Si el producto ya existe en el carrito, incrementa la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si el producto no existe, se agrega al carrito
        cart.products.push({ product: productId, quantity });
      }

      await this.saveCartsToDisk();

      return cart;
    }

    return null;
  }

  generateUniqueId() {
    // Genera un ID único
    return Date.now().toString();
  }
}

module.exports = CartManager;