import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function Category() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("product", `/products?categoryId=${id}`, "GET");
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    load();
  }, [id]);

  return (
    <div className="page-container">
      <h2 className="section-title">Products</h2>

      <div className="grid product-grid">
        {products.map((p) => (
          <Link key={p.productId} to={`/product/${p.productId}`} className="card product-card">
            {p.productName}
          </Link>
        ))}
      </div>
    </div>
  );
}