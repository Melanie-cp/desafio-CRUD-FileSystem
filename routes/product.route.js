import { Router } from "express";
import { products } from "../data/products.data.js";

const router = Router();

// PATH: '/products'

// vista para mostrar los productos (GET)
router.get("/", (req, res) => {
  const { order, search, error, success } = req.query;

  if (order === "asc") {
    products.sort((a, b) => a.price - b.price);
  }

  if (order === "desc") {
    products.sort((a, b) => b.price - a.price);
  }

  // http://localhost:5001/products?search=h&order=asc
  if (search) {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    return res.render("products", { products: filteredProducts });
  }

  return res.render("products", { products, error, success });
});

// vista para crear un producto (POST)
router.post("/", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .redirect("/products?error=Nombre y precio no pueden ser vacíos");
  }

  if (!name.trim() || !price.trim()) {
    return res
      .status(400)
      .redirect("/products?error=Nombre y precio no pueden ser vacíos");
  }

  const newProduct = {
    id: Date.now(),
    name,
    price: Number(price),
  };

  products.push(newProduct);

  return res.status(201).redirect("/products?success=Producto creado");
});

// acción para eliminar un producto (por ahora es GET, pero debería ser DELETE)
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return res.status(404).redirect("/products?error=Producto no encontrado");
  }

  const index = products.indexOf(product);
  products.splice(index, 1);

  return res.status(200).redirect("/products?success=Producto eliminado");
});

// vista para editar un producto (GET)
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return res.status(404).redirect("/products?error=Producto no encontrado");
  }

  return res.render("product-edit", { product });
});

// acción de editar un producto (por ahora es POST, pero debería ser PUT)
router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { name, price } = req.body;

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return res.status(404).redirect("/products?error=Producto no encontrado");
  }

  if (!name || !price) {
    return res
      .status(400)
      .redirect(
        `/products/edit/${id}?error=Nombre y precio no pueden ser vacíos`
      );
  }

  if (!name.trim() || !price.trim()) {
    return res
      .status(400)
      .redirect(
        `/products/edit/${id}?error=Nombre y precio no pueden ser vacíos`
      );
  }

  product.name = name;
  product.price = Number(price);

  return res.status(200).redirect("/products?success=Producto editado");
});

export default router;
