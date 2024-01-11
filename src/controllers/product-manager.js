const fs = require("fs").promises;

class ProductManager {
  // Variable para llevar un seguimiento del último id asignado
  static ultId = 0;

  constructor(path) {
    // Inicializa el array de productos y la ruta del archivo
    this.products = [];
    this.path = path;
    // Inicializa la instancia, cargando productos desde el archivo
    this.initialize();
  }

  // Método para inicializar la instancia, cargando productos desde el archivo
  async initialize() {
    await this.loadProductsFromDisk();
  }

  // Método para cargar productos desde el archivo
  async loadProductsFromDisk() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      // Actualiza el último id asignado basándose en los productos cargados
      ProductManager.ultId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
    } catch (error) {
      // Si hay un error al leer o analizar el archivo, se ignora y se continúa con un array vacío
      this.products = [];
    }
  }
  // Método para agregar un nuevo producto al array y guardar en el archivo
  async addProduct(nuevoObjeto) {
    let { title, description, price, img, code, stock } = nuevoObjeto;

    // Validaciones
    if (![title, description, price, img, code, stock].every(Boolean)) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some(item => item.code === code)) {
      console.error("El código debe ser único");
      return;
    }

    // Crear nuevo producto con id autoincrementable
    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock
    };

    // Agregar producto al array
    this.products.push(newProduct);

    // Guardar el array actualizado en el archivo
    await this.guardarArchivo();
    console.log("Producto agregado:", newProduct);
  }

// Método para obtener todos los productos
getProducts() {
  console.log("getProducts:", this.products);
  return this.products;
}

  // Método para obtener un producto por su id
  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find(item => item.id === id);

      if (!buscado) {
        console.log("Producto no encontrado");
      } else {
        console.log("Producto encontrado:", buscado);
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // Método para actualizar un producto por su id
  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        // Utilizo el método de array splice para reemplazar el objeto en la posición del index
        arrayProductos.splice(index, 1, productoActualizado);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado:", productoActualizado);
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  // Método para eliminar un producto por su id
  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        // Utilizo el método de array splice para eliminar el objeto en la posición del index
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado satisfactoriamente");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }

  // Método para leer el archivo
  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
    }
  }

  // Método para guardar el array actualizado en el archivo
  async guardarArchivo(arrayProductos = this.products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }
}

// Uso
/* const manager = new ProductManager("./productos.json");

// Verifica que getProducts devuelva un arreglo vacío al inicio
console.log("Productos al inicio:", manager.getProducts());

// Agrega un producto de ejemplo
const nuevoProducto = {
  title: "Ejemplo",
  description: "Producto de ejemplo",
  price: 100,
  img: "ruta_de_la_imagen.jpg" 
}
 */

// Exporta la clase ProductManager
module.exports = ProductManager;