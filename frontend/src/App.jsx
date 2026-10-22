
import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "./features/cart/cartSlice";
import { selectCartTotal } from "./features/cart/cartSelectors";
import { fetchProducts } from "./features/products/productsSlice";

function App() {
   const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );
  // Product data fetched from the backend
  const products = useSelector(
  (state) => state.products.items
);

const loading = useSelector(
  (state) => state.products.loading
);

const error = useSelector(
  (state) => state.products.error
);

useEffect(() => {
  dispatch(fetchProducts());
}, [dispatch]);

  const categories = [
  "All",
  ...new Set(products.map((product) => product.category)),
];

  // Search, category, and cart state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  //const [cart, setCart] = useState([]);
  const cartTotal = useSelector(selectCartTotal);

const cartCount = cartItems.reduce(
  (total, item) => total + item.quantity,
  0
);

  // Filter products based on search text and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low") {
      return a.price - b.price;
    }

    if (sortOrder === "price-high") {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <div className="app">
      <header className="header">
  <h1>🛍️ ShopSmart</h1>

  <div>
    <span>🛒 Cart: {cartCount}</span>
    <p>
      Total:{" "}
      {cartTotal.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })}
    </p>
  </div>
</header>

      <section className="hero">
        <h2>Find your next favourite</h2>
        <p>Discover great products at great prices.</p>
      </section>

      <section className="toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All categories" : item}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="default">Default order</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </section>

      <section className="cart-summary">
        <h2>Shopping Cart</h2>

        <p>
          Items: {" "}
          {cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          )}
        </p>

        <p>Total: ₹{cartTotal.toFixed(2)}</p>

        {cartItems.map((item) => (
          <div className="cart-item" key={item._id}>
            <span>{item.name}</span>

            <button
              onClick={() =>
                dispatch(
                  updateQuantity({
                    id: item._id,
                    quantity: item.quantity - 1,
                  })
                )
              }
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                dispatch(
                  updateQuantity({
                    id: item._id,
                    quantity: item.quantity + 1,
                  })
                )
              }
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>

            <button onClick={() => dispatch(removeFromCart(item._id))}>
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => dispatch(clearCart())}
          disabled={cartItems.length === 0}
        >
          Clear Cart
        </button>
      </section>

      {loading && <p className="empty">Loading products...</p>}

      {error && <p className="empty">{error}</p>}

      {!loading && !error && (
        <>
          <main className="products">
            {sortedProducts.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-image">
                  {product.emoji || "🛍️"}
                </div>

                <p className="category">{product.category}</p>
                <h3>{product.name}</h3>

                <p className="price">
                  {Number(product.price).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </p>

                <button onClick={() => dispatch(addToCart(product))}>
  Add to cart
</button>
              </article>
            ))}
          </main>

          {filteredProducts.length === 0 && (
            <p className="empty">
              No products found. Try another search.
            </p>
          )}
        </>
      )}

      <footer>ShopSmart · Built with React and JavaScript</footer>
    </div>
  );
}

export default App;
