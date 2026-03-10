// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const grade = urlParams.get('grade');
const strand = urlParams.get('strand');
const section = urlParams.get('section');
const studentName = urlParams.get('student');
const subject = urlParams.get('subject');
const quarter = urlParams.get('quarter');
const semester = urlParams.get('semester');

// Display student info
document.getElementById('studentName').textContent = studentName;

let detailsText = `Grade ${grade}`;
if (strand) detailsText += ` - ${strand}`;
detailsText += ` - St. ${section} | ${subject}`;
if (semester && semester !== 'null') {
    detailsText += ` - ${semester === '1' ? '1st' : '2nd'} Sem`;
}
detailsText += ` - Q${quarter}`;

document.getElementById('studentDetails').textContent = detailsText;

// Get student data from localStorage
function getStudentData() {
    const storageKey = `grades_${grade}_${strand}_${section}_${semester}_${quarter}_${subject}`;
    const saved = localStorage.getItem(storageKey);
    
    if (!saved) {
        console.log('No data found for key:', storageKey);
        return null;
    }
    
    const data = JSON.parse(saved);
    const students = data.students || { boys: [], girls: [] };
    const columns = data.columns || { activity: [], pt: [], exam: [] };
    
    // Find the student
    let student = students.boys.find(s => s.name === studentName);
    if (!student) {
        student = students.girls.find(s => s.name === studentName);
    }
    
    return { student, columns };
}

function renderStudentDetails() {
    const data = getStudentData();
    
    if (!data || !data.student) {
        document.getElementById('averageGrade').textContent = 'N/A';
        document.getElementById('missingActivities').innerHTML = '<p style="color: #666;">No data available</p>';
        return;
    }
    
    const { student, columns } = data;
    
    // Display average
    document.getElementById('averageGrade').textContent = student.average.toFixed(2);
    
    // Find missing activities
    const missingActivities = [];
    const allScores = [];
    
    ['activity', 'pt', 'exam'].forEach(type => {
        columns[type].forEach(col => {
            const score = (student.scores && student.scores[type] && student.scores[type][col.id]) || 0;
            const typeLabel = type === 'activity' ? 'Activity' : type === 'pt' ? 'PT' : 'Exam';
            
            allScores.push({
                name: col.name,
                type: typeLabel,
                score: score,
                maxPoints: col.maxPoints,
                isMissing: score === 0 || score === null || score === undefined
            });
            
            if (score === 0 || score === null || score === undefined) {
                missingActivities.push({
                    name: col.name,
                    type: typeLabel
                });
            }
        });
    });
    
    // Render missing activities
    const missingContainer = document.getElementById('missingActivities');
    if (missingActivities.length === 0) {
        missingContainer.innerHTML = '<p style="color: #00A651; font-weight: 500;">✓ No missing activities</p>';
    } else {
        missingContainer.innerHTML = '';
        missingActivities.forEach(item => {
            const div = document.createElement('div');
            div.className = 'missing-item';
            div.textContent = `${item.type}: ${item.name || 'Unnamed'}`;
            missingContainer.appendChild(div);
        });
    }
    
    // Render all scores
    const tbody = document.getElementById('scoresTable');
    tbody.innerHTML = '';
    
    allScores.forEach(item => {
        const row = document.createElement('tr');
        const statusClass = item.isMissing ? 'status-missing' : 'status-complete';
        const statusText = item.isMissing ? 'MISSING' : 'COMPLETE';
        
        row.innerHTML = `
            <td>${item.name || 'Unnamed'}</td>
            <td>${item.type}</td>
            <td>${item.isMissing ? '-' : item.score}</td>
            <td>${item.maxPoints}</td>
            <td class="${statusClass}">${statusText}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function goBack() {
    window.history.back();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
}

// Initialize
renderStudentDetails();
