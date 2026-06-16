import API from "./axios"

// admin login
export const adminLogin = (data) => API.post("/admin/login", data)