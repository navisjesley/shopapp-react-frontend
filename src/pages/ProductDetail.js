import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { user, appUserId, getToken } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const load  = async () => {
      try {
        const data = await apiRequest("product", `/products/${id}`, "GET");
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };

    load();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (qty < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    try {
      setAddingToCart(true);

      const token = await getToken()

      console.log("react to cart access token", token);

      await apiRequest("cart", "/cart", "POST", {
        userId: appUserId,
        productId: id,
        quantityToAdd: qty,
      }, token);

      alert("Added to cart");
      setQty(1);
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="product-detail">
        <div className="product-detail-image-wrap">
          <img src={product.productImageUrl} alt={product.productName || "Product image"} className="product-detail-image" />
        </div>
        <div>
          <h2 className="product-detail-name">{product.productName}</h2>
          <div className="product-detail-panel">
            <p className="muted">Select quantity</p>
            <div className="quantity-row">
              <button className="qty-button" onClick={() => setQty((prev) => Math.max(1, prev - 1))}>-</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-button" onClick={() => setQty((prev) => prev + 1)}>+</button>
            </div>
            <button className="primary-button" onClick={addToCart} disabled={addingToCart}>
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}