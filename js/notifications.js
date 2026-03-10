// Notification system for registrar
function sendNotification(type, data) {
    const notifications = JSON.parse(localStorage.getItem('registrar_notifications') || '[]');
    
    const notification = {
        id: Date.now(),
        type: type,
        data: data,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notification); // Add to beginning
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
        notifications.splice(100);
    }
    
    localStorage.setItem('registrar_notifications', JSON.stringify(notifications));
}

function getUnreadNotificationCount() {
    const notifications = JSON.parse(localStorage.getItem('registrar_notifications') || '[]');
    return notifications.filter(n => !n.read).length;
}

function getAllNotifications() {
    return JSON.parse(localStorage.getItem('registrar_notifications') || '[]');
}

function markNotificationAsRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('registrar_notifications') || '[]');
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('registrar_notifications', JSON.stringify(notifications));
    }
}

function markAllAsRead() {
    const notifications = JSON.parse(localStorage.getItem('registrar_notifications') || '[]');
    notifications.forEach(n => n.read = true);
    localStorage.setItem('registrar_notifications', JSON.stringify(notifications));
    renderNotifications();
    updateNotificationBadge();
}

function clearAllNotifications() {
    localStorage.setItem('registrar_notifications', '[]');
    renderNotifications();
    updateNotificationBadge();
}
