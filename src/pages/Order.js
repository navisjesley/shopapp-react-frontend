import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Order() {
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const cart = useMemo(() => location.state?.cart || [], [location.state]);
  const [address, setAddress] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cart, navigate]);

  const placeOrder = async () => {
    if (!address.trim()) {
      alert("Please enter address");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = await getToken();

      const payload = {
        cartId: cart[0].cartId,
        deliveryAddress: address,
        items: cart.map((item) => ({
          cartItemId: item.cartItemId,
          productId: item.productId,
          quantityInCart: item.quantityInCart,
        })),
      };

      const data = await apiRequest("order", "/orders", "POST", payload, token);

      setOrderId(data.orderId);
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null;
    // return (
    //   <div>
    //     <h2>Order</h2>
    //     <p>No items to order.</p>
    //     <button onClick={() => navigate("/cart")}>Back to Cart</button>
    //   </div>
    // );
  }

  return (
    <div className="page-container">
      <div className="checkout-layout">
        <div className="checkout-main">
          <h2 className="section-title">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.cartItemId} className="order-item">
              <div>
                <h3 className="item-title">{item.productName}</h3>
                <p className="item-subtext">Quantity: {item.quantityInCart}</p>
              </div>
            </div>
          ))}
        </div>
        <aside className="checkout-sidebar">
          <h3 className="sidebar-title">Delivery Address</h3>
          <textarea
            className="address-box"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            rows={5}
          />
          <div className="sidebar-block">
            {!orderId ? (
              <button className="primary-button" disabled={isSubmitting} onClick={placeOrder}>
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            ) : (
              <p className="success-text">
                Order placed successfully. Your order id is {orderId}.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}