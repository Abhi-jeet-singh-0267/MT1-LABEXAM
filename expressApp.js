import express from "express";

const app = express();

app.use(express.json());

// Initial shopping cart data
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 999,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Notebook",
    price: 100,
    quantity: 5,
    category: "Stationery",
  },
];

// Validate product details
function isValidProduct(product) {
  return (
    product &&
    typeof product.productName === "string" &&
    product.productName.trim() !== "" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    Number.isInteger(product.quantity) &&
    product.quantity > 0 &&
    typeof product.category === "string" &&
    product.category.trim() !== ""
  );
}

// GET: Retrieve all cart items
app.get("/cart", (req, res) => {
  res.status(200).json(cart);
});

// GET: Retrieve one cart item by ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity,
  });
});

// POST: Add a new product
app.post("/cart", (req, res) => {
  const product = req.body;

  if (
    !Number.isInteger(product?.id) ||
    product.id <= 0 ||
    !isValidProduct(product)
  ) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  if (cart.some((item) => item.id === product.id)) {
    return res.status(409).json({
      message: "Product ID already exists",
    });
  }

  cart.push({
    id: product.id,
    productName: product.productName,
    price: product.price,
    quantity: product.quantity,
    category: product.category,
  });

  res.status(201).json({
    message: "Product added successfully",
    product: cart[cart.length - 1],
  });
});

// PUT: Update an existing product
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const updatedProduct = req.body;

  if (!isValidProduct(updatedProduct)) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  cart[index] = {
    id: cart[index].id,
    productName: updatedProduct.productName,
    price: updatedProduct.price,
    quantity: updatedProduct.quantity,
    category: updatedProduct.category,
  };

  res.status(200).json({
    message: "Product updated successfully",
    product: cart[index],
  });
});

// DELETE: Remove a product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = cart[index];

  cart.splice(index, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request",
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
});

// Start Express server
app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
