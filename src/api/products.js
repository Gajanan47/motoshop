import {userAPI, adminAPI} from "./axios"

// get all products from backend
export const fetchProducts = () => userAPI.get("/products")

// add product (admin)
export const addProduct = (data) => adminAPI.post("/products", data)

// update product (admin)
export const updateProduct = (id, data) => adminAPI.put(`/products/${id}`, data)

// delete product (admin)
export const deleteProduct = (id) => adminAPI.delete(`/products/${id}`)

export const getSimilarProducts = (id) => userAPI.get(`/products/similar/${id}`)