const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL;

const SERVICE_PREFIXES = {
  user: "/user",
  product: "/product",
  cart: "/cart",
  order: "/order",
};

export const apiRequest = async (service, url, method = "GET", body, token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const servicePrefix = SERVICE_PREFIXES[service];

  if (!servicePrefix) {
    throw new Error(`Unknown service: ${service}`);
  }

  const res = await fetch(`${API_GATEWAY_URL}${servicePrefix}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`API Error: ${res.status} ${errorText}`);
  }

  if (res.status === 204) return null;

  return res.json();
};


// Testing in Local Environment

// const API_BASE_URLS = {
//   user: process.env.REACT_APP_USER_API_URL,
//   product: process.env.REACT_APP_PRODUCT_API_URL,
//   cart: process.env.REACT_APP_CART_API_URL,
//   order: process.env.REACT_APP_ORDER_API_URL,
// };

// export const apiRequest = async (service, url, method = "GET", body, token) => {
//   const headers = {
//     "Content-Type": "application/json",
//   };

//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(`${API_BASE_URLS[service]}${url}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) throw new Error("API Error");

//   if (res.status === 204) return null;

//   return res.json();
// };