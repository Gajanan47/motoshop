
import  {useState, useEffect} from 'react'
import {fetchUserNotifications, fetchAdminNotifications} from '../api/notifications'
import { SiPanasonic } from 'react-icons/si'


export default function NotificationBell  ({role})  {
    const [open, setopen] = useState(false)
    const [notifications, setnotifications] = useState([])
    const [unreadCount, setunreadCount] = useState(0)

    useEffect(() => {
      async function loadNotifications(){
        try{
            const response = role === "admin" ?
             await fetchAdminNotifications() :
              await fetchUserNotifications()

              setnotifications(response.data.data || [])
              setunreadCount(response.data.unreadCount || 0)

        }catch(err){
            console.error("Unable to load notifications", err)
        }


      }
      loadNotifications()
      const interval = setInterval(loadNotifications, 30000);
      
      
    
      return () => {
        clearInterval(interval)
      }
    }, [role])
    
  return (
    <div className='relative'>
        <button className='relative border border-slate-200 rounded-md px-3 py-1.5'
         onClick={()=>setopen(!open)}>
            🔔
            {unreadCount>0 &&
             (
                <span className='absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full px-1.5'>
                    {unreadCount}
                </span>
             )
            }
        </button>
        {
            open && (
                <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50'>
                    <h3 className='text-center bg-amber-100 font-semibold p-3 border-b'>
                        Notifications
                    </h3>
                    {notifications.length === 0 ? (
                    
                            <span className='text-center p-4 text-sm text-slate-500'>No notifications yet</span>
                        
                    ) :
                    notifications.map((notification) => (
                        <div
                        key={notification.id}
                        className='p-3 border-b' 
                        >
                            <p>{notification.title}</p>
                            <p>{notification.message}</p>

                        </div>

                    ))
                }
                </div>
            )
        }
    </div>
  )
}

