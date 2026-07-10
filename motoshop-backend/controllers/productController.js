const db = require("../config/db")

const getAllProducts = async(req,res)=>{
    try{
        // instead of SELECT * FROM products
const [rows] = await db.query(`
  SELECT p.*, 
    JSON_ARRAYAGG(pi.url) as images
  FROM products p
  LEFT JOIN product_images pi ON p.id = pi.product_id
  GROUP BY p.id
`)
        res.json({success:true,data:rows})
    }catch(err){
        res.status(500).json({success:false,message:err.message})
    }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query(`
  SELECT p.*, 
    JSON_ARRAYAGG(pi.url) as images
  FROM products p
  LEFT JOIN product_images pi ON p.id = pi.product_id
  WHERE p.id = ?
  GROUP BY p.id
`, [id])

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

function buildImages(req) {
  const uploadBase = `${req.protocol}://${req.get("host")}/uploads`
  const uploaded = (req.files || []).map((file) => `${uploadBase}/${file.filename}`)

  let bodyImages = []
  if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      bodyImages = req.body.images.filter(Boolean)
    } else if (typeof req.body.images === "string") {
      bodyImages = req.body.images ? [req.body.images] : []
    }
  }

  return [...bodyImages, ...uploaded]
}

const addProduct = async (req, res) => {
  try {
    const { name, company, type, cc, fuel, use_case,
            price, rating, reviews, badge } = req.body
    const images = buildImages(req)
    // images = array of URLs from frontend e.g. ["url1", "url2"]

    if (!name || !company || !type || !price)
      return res.status(400).json({
        success: false,
        message: "name, company, type and price are required"
      })
    const image = images?.[0] || null
    const [result] = await db.query(
      `INSERT INTO products
        (name, company, type, cc, fuel, use_case, price, rating, reviews, badge,image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [name, company, type, cc || 0, fuel, use_case,
       price, rating || 0, reviews || 0, badge || "", image]
    )

    const productId = result.insertId

    // insert images into product_images table
    if (images && images.length > 0) {
      const imageRows = images.map((url, i) => [productId, url, i])
      await db.query(
        "INSERT INTO product_images (product_id, url, sort_order) VALUES ?",
        [imageRows]
      )
    }

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, company, type, cc, fuel,
            use_case, price, rating, reviews, badge } = req.body

    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id])
    if (existing.length === 0)
      return res.status(404).json({ success: false, message: "Product not found" })

    const images = buildImages(req)

    await db.query(
      `UPDATE products SET
        name=?, company=?, type=?, cc=?, fuel=?,
        use_case=?, price=?, rating=?, reviews=?, badge=?, image=?
       WHERE id=?`,
      [name, company, type, cc, fuel, use_case, price, rating, reviews, badge, images?.[0] || existing[0].image, id]
    )

    // replace old images with new ones
    if (images && images.length > 0) {
      await db.query("DELETE FROM product_images WHERE product_id = ?", [id])
      const imageRows = images.map((url, i) => [id, url, i])
      await db.query(
        "INSERT INTO product_images (product_id, url, sort_order) VALUES ?",
        [imageRows]
      )
    }

    res.json({ success: true, message: "Product updated successfully" })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE product (admin only)
// Route: DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // check product exists first
    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id])
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    await db.query("DELETE FROM products WHERE id = ?", [id])
    res.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getSimilarProducts = async (req, res) => {
  try{
    const {id} = req.params
    const [product] = await db.query("SELECT * FROM products WHERE id=?", [id])
    if(product.length == 0){
      return res.status(404).json({
        success:false, message:"Product not found"
      })  
    } 
    const current = product[0]
    const [rows] = await db.query(`SELECT p.*, JSON_ARRAYAGG(pi.url) AS images 
      FROM products p
      LEFT JOIN product_images pi 
      ON p.id = pi.product_id
      WHERE p.id != ?
      AND 
     ( p.company = ? OR p.type = ? OR p.fuel = ?) 
      GROUP BY p.id 
      ORDER BY (p.company = ?) DESC, 
      (p.type=?) DESC,
      ABS(p.price - ?) ASC LIMIT 8 `, [id, current.company, current.type, current.fuel, current.company, current.type, current.price])

      res.json({success: true, data:rows})
  }
  catch(err){
    res.status(500).json({success: false, message:err.message})
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts
}