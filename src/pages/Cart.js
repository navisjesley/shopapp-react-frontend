import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { user, getToken } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    try {
      setIsCartLoaded(false);

      const token = await getToken();
      const data = await apiRequest("cart", "/cart", "GET", null, token);
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart", err);
      alert("Failed to load cart");
    } finally {
      setIsCartLoaded(true);
    }
  }, [getToken]);

  useEffect(() => {
    if (!user) return;
    loadCart();
  }, [user, loadCart]);

  const deleteItem = async (item) => {
    try {
      const token = await getToken();

      const payload = {
        cartItemId: item.cartItemId,
        cartId: item.cartId,
        productId: item.productId,
      };

      await apiRequest("cart", "/cart/delete-item", "POST", payload, token);

      setCart((prevCart) =>
        prevCart.filter((cartItem) => cartItem.cartItemId !== item.cartItemId)
      );
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Failed to delete item");
    }
  };

  // const updateCart = async () => {
  //   try {
  //     const token = await getToken();
  //     await apiRequest("cart", "/cart", "PUT", cart, token);
  //     alert("Updated");
  //     await loadCart();
  //   } catch (err) {
  //     console.error("Failed to update cart", err);
  //     alert("Failed to update cart");
  //   }
  // };

  const goToOrderPage = () => {
    navigate("/order", { state: { cart }});
  }

  if (!isCartLoaded) {
    return <div className="page-container"><p>Loading cart...</p></div>;
  }

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2 className="section-title">Your Cart</h2>
          <p>Your cart is empty.</p>
        </div>
      </div>
    );
  }

  // const placeOrder = async () => {
  //   try {
  //     const token = await getToken();
  //     await apiRequest("cart", "/orders", "POST", {}, token);
  //     alert("Order placed");
  //     setCart([]);
  //   } catch (err) {
  //     console.error("Failed to place order", err);
  //     alert("Failed to place order");
  //   }
  // };

  return (
    <div className="page-container">
      <div className="checkout-layout">
        <div className="checkout-main">
          <h2 className="section-title">Shopping Cart</h2>
          {cart.map((item, i) => (
            <div key={item.cartItemId} className="cart-item">
              <div>
                <h3 className="item-title">{item.productName}</h3>
                <p className="item-subtext">Quantity: {item.quantityInCart}</p>
              </div>
              <div className="item-actions">
                <button className="delete-button" onClick={() => deleteItem(item)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <aside className="checkout-sidebar">
          <h3 className="sidebar-title">Proceed to checkout</h3>
          <p className="muted">{cart.length} item(s) in your cart</p>
          <div className="sidebar-block">
            <button className="primary-button" onClick={goToOrderPage}>
              Order
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}