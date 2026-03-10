// Get class info from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const grade = urlParams.get('grade');
const strand = urlParams.get('strand');
const section = urlParams.get('section');
const semester = urlParams.get('semester');
const quarter = urlParams.get('quarter');
const subject = urlParams.get('subject');

// Display class info
let classInfoText = `${grade}`;
if (strand) classInfoText += ` - ${section.toUpperCase()}`;
else classInfoText += ` - ${section}`;

// Format semester and quarter properly
if (semester) {
    const semesterText = semester === '1' ? '1st' : '2nd';
    const quarterNum = quarter === '1' ? '1st' : quarter === '2' ? '2nd' : quarter === '3' ? '3rd' : '4th';
    classInfoText += ` | ${semesterText} Sem ${quarterNum} Quarter`;
} else {
    const quarterNum = quarter === '1' ? '1st' : quarter === '2' ? '2nd' : quarter === '3' ? '3rd' : '4th';
    classInfoText += ` | ${quarterNum} Quarter`;
}

document.getElementById('classInfo').textContent = classInfoText;
document.getElementById('subjectName').textContent = subject || 'Subject';
document.getElementById('subjectIcon').textContent = (subject || 'S').charAt(0).toUpperCase();

// Active tab
let activeTab = 'activity';

// Activities/PT/Exam columns
let columns = {
    activity: [],
    pt: [],
    exam: []
};

// Student data structure
let studentsData = {
    boys: [],
    girls: []
};

// Ensure studentsData is always valid
function ensureStudentsData() {
    if (!studentsData || typeof studentsData !== 'object') {
        studentsData = { boys: [], girls: [] };
    }
    if (!Array.isArray(studentsData.boys)) {
        studentsData.boys = [];
    }
    if (!Array.isArray(studentsData.girls)) {
        studentsData.girls = [];
    }
}

// Ensure columns is always valid
function ensureColumns() {
    if (!columns || typeof columns !== 'object') {
        columns = { activity: [], pt: [], exam: [] };
    }
    if (!Array.isArray(columns.activity)) {
        columns.activity = [];
    }
    if (!Array.isArray(columns.pt)) {
        columns.pt = [];
    }
    if (!Array.isArray(columns.exam)) {
        columns.exam = [];
    }
}

// Load data from localStorage and Firebase
async function loadData() {
    const storageKey = `grades_${grade}_${strand}_${section}_${semester}_${quarter}_${subject}`;
    
    // Initialize with empty data
    studentsData = { boys: [], girls: [] };
    columns = { activity: [], pt: [], exam: [] };
    
    // Try to load from Firebase first (if available)
    if (typeof loadFromFirebase === 'function') {
        try {
            const firebaseData = await loadFromFirebase(storageKey);
            if (firebaseData && firebaseData.students) {
                studentsData = {
                    boys: Array.isArray(firebaseData.students.boys) ? firebaseData.students.boys : [],
                    girls: Array.isArray(firebaseData.students.girls) ? firebaseData.students.girls : []
                };
                columns = firebaseData.columns || { activity: [], pt: [], exam: [] };
                return;
            }
        } catch (error) {
            console.log('Firebase load failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.students) {
                studentsData = {
                    boys: Array.isArray(data.students.boys) ? data.students.boys : [],
                    girls: Array.isArray(data.students.girls) ? data.students.girls : []
                };
            }
            columns = data.columns || { activity: [], pt: [], exam: [] };
        } catch (error) {
            console.error('Error parsing saved data:', error);
        }
    }
    // If no data exists, start with empty tables (no shared student list)
}

// Save data to localStorage and Firebase
async function saveData() {
    const storageKey = `grades_${grade}_${strand}_${section}_${semester}_${quarter}_${subject}`;
    
    // Ensure studentsData is properly initialized
    if (!studentsData || !studentsData.boys || !studentsData.girls) {
        studentsData = { boys: [], girls: [] };
    }
    
    const gradeData = {
        students: studentsData,
        columns: columns
    };
    
    // Save to localStorage (backup)
    localStorage.setItem(storageKey, JSON.stringify(gradeData));
    
    // Save to Firebase (cloud sync) if available
    if (typeof saveToFirebase === 'function') {
        try {
            await saveToFirebase(storageKey, gradeData);
        } catch (error) {
            console.log('Firebase save failed:', error);
        }
    }
}

// Send grades to registrar
function sendToRegistrar() {
    // Save first
    saveData();
    
    // Send in-app notification to registrar
    sendNotification('grades_updated', {
        grade: grade,
        strand: strand,
        section: section,
        semester: semester,
        quarter: quarter,
        subject: subject
    });
    
    alert('Grades sent to registrar successfully!');
}

// Auto-save and send notifications on page unload
window.addEventListener('beforeunload', function() {
    saveData();
    
    // Send in-app notification when exiting tab
    sendNotification('grades_updated', {
        grade: grade,
        strand: strand,
        section: section,
        semester: semester,
        quarter: quarter,
        subject: subject
    });
});

// Auto-save every 30 seconds (without notifications)
setInterval(saveData, 30000);

function setActiveTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tab + 'Btn').classList.add('active');
    renderTable();
}

function addColumn(type) {
    ensureColumns();
    ensureStudentsData();
    
    // Auto-generate column name based on type
    let columnName = '';
    
    if (type === 'pt') {
        columnName = 'PT';
    } else if (type === 'exam') {
        columnName = 'Exam';
    }
    // Activity columns start with empty name
    
    const newColumn = {
        id: Date.now(),
        name: columnName,
        type: type,
        maxPoints: 100
    };
    columns[type].push(newColumn);
    
    // Add score entry for all students
    studentsData.boys.forEach(student => {
        if (!student.scores) student.scores = {};
        if (!student.scores[type]) student.scores[type] = {};
        student.scores[type][newColumn.id] = 0;
    });
    studentsData.girls.forEach(student => {
        if (!student.scores) student.scores = {};
        if (!student.scores[type]) student.scores[type] = {};
        student.scores[type][newColumn.id] = 0;
    });
    
    calculateAverages();
    renderTable();
    saveData();
}

function updateColumnName(columnId, type, newName) {
    const column = columns[type].find(c => c.id === columnId);
    if (column) {
        column.name = newName.trim() || column.name;
        renderTable();
        saveData();
    }
}

function deleteColumn(columnId, type) {
    if (confirm('Delete this column? All scores will be lost.')) {
        columns[type] = columns[type].filter(c => c.id !== columnId);
        
        // Remove scores from all students
        studentsData.boys.forEach(student => {
            if (student.scores && student.scores[type]) {
                delete student.scores[type][columnId];
            }
        });
        studentsData.girls.forEach(student => {
            if (student.scores && student.scores[type]) {
                delete student.scores[type][columnId];
            }
        });
        
        calculateAverages();
        renderTable();
        saveData();
    }
}

function updateMaxPoints(columnId, type, value) {
    const column = columns[type].find(c => c.id === columnId);
    if (column) {
        column.maxPoints = parseFloat(value) || 100;
        calculateAverages();
        renderTable();
        saveData();
    }
}

function updateScore(studentId, gender, columnId, type, value) {
    const student = studentsData[gender].find(s => s.id === studentId);
    if (student) {
        if (!student.scores) student.scores = {};
        if (!student.scores[type]) student.scores[type] = {};
        
        // Get max points for this column
        const column = columns[type].find(c => c.id === columnId);
        const maxPoints = column ? column.maxPoints : 100;
        
        // Ensure score doesn't exceed max points
        let score = parseFloat(value) || 0;
        if (score > maxPoints) {
            score = maxPoints;
        }
        
        student.scores[type][columnId] = score;
        calculateAverages();
        renderTable();
        saveData();
    }
}

function calculateAverages() {
    ensureStudentsData();
    ensureColumns();
    
    const actWeight = parseFloat(document.getElementById('actWeight').value) || 30;
    const ptWeight = parseFloat(document.getElementById('ptWeight').value) || 50;
    const examWeight = parseFloat(document.getElementById('examWeight').value) || 20;
    
    const calculateCategoryAverage = (student, category) => {
        const cols = columns[category];
        if (cols.length === 0) return 0;
        
        let totalScore = 0;
        let totalMax = 0;
        
        cols.forEach(col => {
            const score = (student.scores && student.scores[category] && student.scores[category][col.id]) || 0;
            totalScore += score;
            totalMax += col.maxPoints;
        });
        
        return totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    };
    
    [...studentsData.boys, ...studentsData.girls].forEach(student => {
        const actAvg = calculateCategoryAverage(student, 'activity');
        const ptAvg = calculateCategoryAverage(student, 'pt');
        const examAvg = calculateCategoryAverage(student, 'exam');
        
        student.average = (actAvg * actWeight / 100) + (ptAvg * ptWeight / 100) + (examAvg * examWeight / 100);
    });
}

function updateWeights() {
    const actWeight = parseFloat(document.getElementById('actWeight').value) || 0;
    const ptWeight = parseFloat(document.getElementById('ptWeight').value) || 0;
    const examWeight = parseFloat(document.getElementById('examWeight').value) || 0;
    
    const total = actWeight + ptWeight + examWeight;
    if (total !== 100) {
        alert('Weights must add up to 100%');
        return;
    }
    
    calculateAverages();
    renderTable();
    saveData();
}

function addRow(gender) {
    ensureStudentsData();
    ensureColumns();
    
    const newStudent = {
        id: Date.now(),
        name: '',
        gender: gender,
        scores: {},
        average: 0
    };
    
    // Initialize scores for all columns
    ['activity', 'pt', 'exam'].forEach(category => {
        newStudent.scores[category] = {};
        if (columns[category]) {
            columns[category].forEach(col => {
                newStudent.scores[category][col.id] = 0;
            });
        }
    });
    
    studentsData[gender].push(newStudent);
    sortStudents(gender);
    renderTable();
    saveData();
    
    // Focus on the newly created input
    setTimeout(() => {
        const input = document.getElementById(`student-${newStudent.id}`);
        if (input) {
            input.focus();
        }
    }, 100);
}

function deleteStudent(id, gender) {
    if (confirm('Are you sure you want to delete this student?')) {
        studentsData[gender] = studentsData[gender].filter(s => s.id !== id);
        renderTable();
        saveData();
    }
}

function updateStudentName(id, gender, name) {
    const student = studentsData[gender].find(s => s.id === id);
    if (student) {
        student.name = name;
        sortStudents(gender);
        renderTable();
        saveData();
    }
}

function sortStudents(gender) {
    studentsData[gender].sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.localeCompare(b.name);
    });
}

function renderTable() {
    const tbody = document.getElementById('studentsTable');
    const thead = document.querySelector('.grades-table thead');
    
    // Collect all columns from all types
    const allColumns = [
        ...columns.activity.map(c => ({...c, type: 'activity'})),
        ...columns.pt.map(c => ({...c, type: 'pt'})),
        ...columns.exam.map(c => ({...c, type: 'exam'}))
    ];
    
    // Build header
    let headerHTML = '<tr><th class="student-col">STUDENT NAME</th>';
    allColumns.forEach((col) => {
        const typeLabel = col.type === 'activity' ? 'ACT' : col.type === 'pt' ? 'PT' : 'EXAM';
        
        if (col.type === 'activity') {
            // Activity columns - show "Act #: " + editable name
            const activityNumber = columns.activity.findIndex(c => c.id === col.id) + 1;
            headerHTML += `<th class="score-col">
                Act ${activityNumber}: <input type="text" value="${col.name}" 
                       placeholder="Name"
                       onchange="updateColumnName(${col.id}, '${col.type}', this.value)"
                       style="width: 80px; padding: 4px; border: 1px solid #e0e0e0; border-radius: 3px; background: transparent; font-weight: 600;">
                <button onclick="deleteColumn(${col.id}, '${col.type}')" style="color: red; border: none; background: none; cursor: pointer; font-size: 12px;">✕</button>
            </th>`;
        } else {
            // PT and Exam columns - fully editable
            headerHTML += `<th class="score-col">
                <input type="text" value="${col.name}" 
                       onchange="updateColumnName(${col.id}, '${col.type}', this.value)"
                       style="width: 100px; padding: 4px; border: 1px solid #e0e0e0; border-radius: 3px; background: transparent; font-weight: 600; text-align: center;">
                (${typeLabel}) 
                <button onclick="deleteColumn(${col.id}, '${col.type}')" style="color: red; border: none; background: none; cursor: pointer; font-size: 12px;">✕</button>
            </th>`;
        }
    });
    headerHTML += '<th class="score-col">AVERAGE</th><th class="action-col">ACTION</th></tr>';
    
    // Max points row
    headerHTML += '<tr class="max-points-row"><td></td>';
    allColumns.forEach(col => {
        headerHTML += `<td><input type="number" value="${col.maxPoints}" onchange="updateMaxPoints(${col.id}, '${col.type}', this.value)" style="width: 60px; padding: 4px; text-align: center; border: 1px solid #e0e0e0; border-radius: 3px;"></td>`;
    });
    headerHTML += '<td colspan="2" class="max-points-label">MAX POINTS:</td></tr>';
    
    thead.innerHTML = headerHTML;
    
    tbody.innerHTML = '';
    
    // Boys section
    const boysHeader = document.createElement('tr');
    boysHeader.className = 'section-header';
    boysHeader.innerHTML = `<td colspan="${3 + allColumns.length}">BOYS</td>`;
    tbody.appendChild(boysHeader);
    
    studentsData.boys.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'student-row';
        let rowHTML = `
            <td>
                <input type="text" 
                       id="student-${student.id}"
                       class="student-name-input" 
                       value="${student.name}" 
                       placeholder="Enter student name"
                       onchange="updateStudentName(${student.id}, 'boys', this.value)">
            </td>`;
        
        allColumns.forEach(col => {
            const score = (student.scores && student.scores[col.type] && student.scores[col.type][col.id]);
            const hasScore = score !== undefined && score !== null && score !== 0;
            const displayValue = hasScore ? score : '';
            rowHTML += `<td><input type="text" value="${displayValue}" data-missing="${!hasScore}" placeholder="MISS" min="0" max="${col.maxPoints}" onchange="updateScore(${student.id}, 'boys', ${col.id}, '${col.type}', this.value)" oninput="if(parseFloat(this.value) > ${col.maxPoints}) this.value = ${col.maxPoints};" style="width: 60px; padding: 4px; text-align: center; border: 1px solid #e0e0e0; border-radius: 3px; ${!hasScore ? 'background: #ffe6e6; color: #dc3545; font-weight: 600;' : ''}"></td>`;
        });
        
        const avgColor = student.average < 75 && student.average > 0 ? 'color: red;' : 'color: #00A651;';
        const avgText = student.average.toFixed(2);
        rowHTML += `
            <td class="average-score" style="${avgColor}">${avgText}%</td>
            <td>
                <button onclick="deleteStudent(${student.id}, 'boys')" class="delete-btn">🗑️</button>
            </td>
        `;
        row.innerHTML = rowHTML;
        tbody.appendChild(row);
    });
    
    const boysAddRow = document.createElement('tr');
    boysAddRow.className = 'add-row-btn-row';
    boysAddRow.innerHTML = `<td colspan="${3 + allColumns.length}"><button onclick="addRow('boys')" class="add-row-btn">+ Add Row</button></td>`;
    tbody.appendChild(boysAddRow);
    
    // Girls section
    const girlsHeader = document.createElement('tr');
    girlsHeader.className = 'section-header';
    girlsHeader.innerHTML = `<td colspan="${3 + allColumns.length}">GIRLS</td>`;
    tbody.appendChild(girlsHeader);
    
    studentsData.girls.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'student-row';
        let rowHTML = `
            <td>
                <input type="text" 
                       id="student-${student.id}"
                       class="student-name-input" 
                       value="${student.name}" 
                       placeholder="Enter student name"
                       onchange="updateStudentName(${student.id}, 'girls', this.value)">
            </td>`;
        
        allColumns.forEach(col => {
            const score = (student.scores && student.scores[col.type] && student.scores[col.type][col.id]);
            const hasScore = score !== undefined && score !== null && score !== 0;
            const displayValue = hasScore ? score : '';
            rowHTML += `<td><input type="text" value="${displayValue}" data-missing="${!hasScore}" placeholder="MISS" min="0" max="${col.maxPoints}" onchange="updateScore(${student.id}, 'girls', ${col.id}, '${col.type}', this.value)" oninput="if(parseFloat(this.value) > ${col.maxPoints}) this.value = ${col.maxPoints};" style="width: 60px; padding: 4px; text-align: center; border: 1px solid #e0e0e0; border-radius: 3px; ${!hasScore ? 'background: #ffe6e6; color: #dc3545; font-weight: 600;' : ''}"></td>`;
        });
        
        const avgColor = student.average < 75 && student.average > 0 ? 'color: red;' : 'color: #00A651;';
        const avgText = student.average.toFixed(2);
        rowHTML += `
            <td class="average-score" style="${avgColor}">${avgText}%</td>
            <td>
                <button onclick="deleteStudent(${student.id}, 'girls')" class="delete-btn">🗑️</button>
            </td>
        `;
        row.innerHTML = rowHTML;
        tbody.appendChild(row);
    });
    
    const girlsAddRow = document.createElement('tr');
    girlsAddRow.className = 'add-row-btn-row';
    girlsAddRow.innerHTML = `<td colspan="${3 + allColumns.length}"><button onclick="addRow('girls')" class="add-row-btn">+ Add Row</button></td>`;
    tbody.appendChild(girlsAddRow);
}

function clearTable() {
    if (confirm('Are you sure you want to clear all student data? This cannot be undone.')) {
        studentsData = {
            boys: [],
            girls: []
        };
        columns = {
            activity: [],
            pt: [],
            exam: []
        };
        renderTable();
        saveData();
    }
}

// Initialize - make sure Firebase is loaded first
if (typeof loadData === 'function') {
    loadData().then(() => {
        calculateAverages();
        renderTable();
    }).catch((error) => {
        console.error('Error loading data:', error);
        calculateAverages();
        renderTable();
    });
} else {
    // Fallback if Firebase not loaded
    calculateAverages();
    renderTable();
}

function goBack() {
    window.location.href = 'teacher-dashboard.html';
}
