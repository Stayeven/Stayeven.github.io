// Sections data organized by grade
const sectionsData = {
    '12': {
        'STEM': ['Margaret', 'Rita', 'Martha'],
        'HUMSS': ['Philomena', 'Theresa'],
        'ABM': ['Gertrude'],
        'TVL': ['Agatha']
    },
    '11': {
        'STEM': ['Pedro', 'Ignatius', 'Gregory'],
        'HUMSS': ['Timothy', 'James'],
        'ABM': ['Pio'],
        'TVL': ['Hannibal']
    },
    '10': ['Benedict', 'John', 'Luke', 'Mark', 'Matthew', 'Philip'],
    '9': ['Agnes', 'Anne', 'Bernadette', 'Bridget', 'Monica', 'Therese'],
    '8': ['Andrew', 'Jude', 'Lorenzo', 'Martin', 'Paul', 'Peter'],
    '7': ['Anthony', 'Elizabeth', 'Francis', 'Joseph', 'Michael', 'Roque', 'Thomas']
};

function renderSections() {
    const container = document.getElementById('sectionsList');
    container.innerHTML = '';
    
    // Iterate through grades from 12 to 7
    for (let grade = 12; grade >= 7; grade--) {
        const gradeGroup = document.createElement('div');
        gradeGroup.className = 'grade-group';
        
        const gradeHeader = document.createElement('div');
        gradeHeader.className = 'grade-header';
        gradeHeader.textContent = `Grade ${grade}`;
        gradeGroup.appendChild(gradeHeader);
        
        const sections = sectionsData[grade.toString()];
        
        if (typeof sections === 'object' && !Array.isArray(sections)) {
            // For grades 11-12 with strands
            Object.keys(sections).forEach(strand => {
                sections[strand].forEach(section => {
                    const sectionItem = document.createElement('div');
                    sectionItem.className = 'section-item';
                    sectionItem.onclick = () => viewSection(grade, strand, section);
                    
                    sectionItem.innerHTML = `
                        <span class="section-name">${strand} - St. ${section}</span>
                        <span class="section-arrow">→</span>
                    `;
                    
                    gradeGroup.appendChild(sectionItem);
                });
            });
        } else {
            // For grades 7-10
            sections.forEach(section => {
                const sectionItem = document.createElement('div');
                sectionItem.className = 'section-item';
                sectionItem.onclick = () => viewSection(grade, null, section);
                
                sectionItem.innerHTML = `
                    <span class="section-name">St. ${section}</span>
                    <span class="section-arrow">→</span>
                `;
                
                gradeGroup.appendChild(sectionItem);
            });
        }
        
        container.appendChild(gradeGroup);
    }
}

function viewSection(grade, strand, section) {
    // Navigate to section view page
    window.location.href = `registrar-section-view.html?grade=${grade}&strand=${strand || ''}&section=${encodeURIComponent(section)}`;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
}

function showNotifications() {
    const modal = document.getElementById('notificationsModal');
    modal.style.display = 'flex';
    renderNotifications();
}

function closeNotifications() {
    const modal = document.getElementById('notificationsModal');
    modal.style.display = 'none';
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    const notifications = getAllNotifications();
    
    if (notifications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No notifications</p>';
        return;
    }
    
    container.innerHTML = '';
    
    notifications.forEach(notification => {
        const div = document.createElement('div');
        div.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        
        let message = '';
        if (notification.type === 'grades_updated') {
            message = `Grades updated for ${notification.data.subject} - Grade ${notification.data.grade}${notification.data.strand ? ' ' + notification.data.strand : ''} - ${notification.data.section}`;
        }
        
        const date = new Date(notification.timestamp);
        const timeAgo = getTimeAgo(date);
        
        div.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <span class="notification-time">${timeAgo}</span>
            </div>
            ${!notification.read ? '<span class="unread-dot"></span>' : ''}
        `;
        
        div.onclick = () => {
            markNotificationAsRead(notification.id);
            renderNotifications();
            updateNotificationBadge();
        };
        
        container.appendChild(div);
    });
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    return date.toLocaleDateString();
}

function updateNotificationBadge() {
    const count = getUnreadNotificationCount();
    const badge = document.getElementById('notificationBadge');
    
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Initialize
renderSections();
updateNotificationBadge();

// Update badge every 30 seconds
setInterval(updateNotificationBadge, 30000);