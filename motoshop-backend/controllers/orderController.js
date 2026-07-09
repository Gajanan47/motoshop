const db = require("../config/db")
const path = require("path")
const {generateInvoice} = require("../invoicegenerator.js")
const { sendCustomerEmail, sendAdminEmail, sendCustomerStatusChangeEmail, sendAdminStatusUpdate } = require("../utils/sendEmail")
// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      items,
      total,
      gst
    } = req.body

    // validate required fields
    if (!customerName || !customerEmail || !customerPhone || !items || !total) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    // generate unique order ID
    const orderId = "#MTS-" + Math.floor(100000 + Math.random() * 900000)
    const userId = req.user.id
    // save order to database
    await db.query(
      `INSERT INTO orders 
        (order_id, customer_name, customer_email, customer_phone, delivery_address, items, total, gst, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        JSON.stringify(items),  // convert array to JSON string for MySQL
        total,
        gst,
        "Confirmed",
        userId
      ]
    )
    const invoiceFileName = `${orderId.replace('#',"")}.pdf`
    const invoicePath = path.join(__dirname,"..", "invoices", invoiceFileName)

    await generateInvoice({
      orderId, customerName, customerEmail, customerPhone, deliveryAddress, items, total, gst, createdAt: new Date()},invoicePath )
    
    // send emails — don't crash the order if email fails
    try {
      await sendCustomerEmail(customerEmail, customerName, {
        orderId, items, total, gst, invoicePath
      })
      await sendAdminEmail({
        orderId, customerName, customerEmail,
        customerPhone, items, total, gst, invoicePath
      })
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message)
      // order still succeeds even if email fails
    }
    const invoiceUrl = `/invoices/${invoiceFileName}`

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
      invoiceUrl
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ?", [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // mysql2 already parses the JSON `items` column automatically
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
// PUT update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    //admin only
    const { id } = req.params
    const { status } = req.body
    const validStatuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      })
    }

    const [existing] = await db.query(
      "SELECT * FROM orders WHERE id = ?", [id]
    )

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    )
    const order = existing[0]
    res.json({ success: true, message: "Order status updated" })

Promise.all([
  sendCustomerStatusChangeEmail(order.customer_email, order.customer_name, {
    orderId: order.order_id,
    status
  }),
  sendAdminStatusUpdate({
    orderId: order.order_id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    status
  })
]).catch((emailError) => {
  console.log("Status update email failed:", emailError.message)
}) }catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
const getMyOrders = async (req,res) => {
  try{
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",[req.user.id] 
    )
    res.json({success:true, data: rows})
  }
  catch(err){
    res.status(500).json({ success:false, message: err.message })
  }
}

const cancelOrder = async (req, res) => {
  try{
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? AND id = ?", [req.user.id, req.params.id]
    )
    if(rows.length === 0){
      return res.status(404).json({success:false, message: "Order not found"})
    }

    const order = rows[0]
    const nonCancellable = ['Shipped', 'Delivered','Cancelled']

    if(nonCancellable.includes(order.status)){
     return res.status(200).json({
        success: false, message: `This order no longer be cancelled (status : ${order.status}`
      })
    }
    await db.query(
      'UPDATE orders SET status = ? WHERE id=?  ',['Cancelled', req.params.id]
    )
    res.json({success:true, message: "Order has been cancelled"})

  }catch(err){
    res.status(500).json({success:false, message: err.message})
  }
}

module.exports = { placeOrder, getAllOrders, updateOrderStatus, getOrderById, getMyOrders, cancelOrder}
