import API from "./axios"

// get all products from backend
export const fetchProducts = () => API.get("/products")

// add product (admin)
export const addProduct = (data) => API.post("/products", data)

// update product (admin)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)

// delete product (admin)
export const deleteProduct = (id) => API.delete(`/products/${id}`)