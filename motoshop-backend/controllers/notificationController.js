const db = require("../config/db")

const createNotification = async({
    recipientRole, userId = null, orderId = null, title, message
})=>{
    await db.query(`INSERT INTO notifications(
        recipient_role, user_id, order_id, title, message
        ) VALUES (?,?,?,?,?)`, [recipientRole, userId, orderId, title, message])
}

const getUserNotifications = async (req, res)=>{
    try{
        const [rows] = await db.query(`SELECT * FROM notifications WHERE recipient_role = 'user' AND user_id = ? 
            ORDER BY created_at DESC LIMIT 30`, [req.user.id])
            res.json({
                success:true,
                data:rows, 
                unreadCount : rows.filter((item)=> !item.is_read).length
            })

    }
    catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

const getAdminNotifications = async (req, res)=>{
    try{
        const [rows] = await db.query(`SELECT * FROM notifications WHERE recipient_role = 'admin' 
            ORDER BY created_at DESC LIMIT 30`, )
            res.json({
                success:true,
                data:rows, 
                unreadCount : rows.filter((item)=> !item.is_read).length
            })

    }
    catch(err){
        res.status(500).json({success:false, message:err.message})
    }   
}

module.exports = {createNotification, getUserNotifications, getAdminNotifications}