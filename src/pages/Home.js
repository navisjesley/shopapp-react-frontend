import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("product", "/products/categories", "GET");
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    load();
  }, []);

  return (
    <div className="page-container">
      <h2 className="section-title">Shop by Category</h2>

      <div className="grid category-grid">
        {categories.map((c) => (
          <Link key={c.productCategoryId} to={`/category/${c.productCategoryId}`} className="card category-card">
            {c.productCategory}
          </Link>
        ))}
      </div>
    </div>
  );
}