import {userAPI, adminAPI} from './axios'

export const fetchUserNotifications = ()=> userAPI.get('/notifications/user')
export const fetchAdminNotifications = ()=> adminAPI.get('/notifications/admin')