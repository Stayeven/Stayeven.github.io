// Get section info from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const grade = urlParams.get('grade');
const strand = urlParams.get('strand');
const section = urlParams.get('section');

console.log('URL Parameters:', { grade, strand, section });

// Display section info
let sectionTitle = `Grade ${grade}`;
if (strand) sectionTitle += ` - ${strand}`;
sectionTitle += ` - St. ${section}`;

document.getElementById('sectionTitle').textContent = sectionTitle;

// Store all failing students globally
let allFailingStudents = [];

// Function to filter by quarter
function filterByQuarter() {
    const selectedQuarter = document.getElementById('quarterFilter').value;
    
    let filteredStudents = allFailingStudents;
    
    if (selectedQuarter !== 'all') {
        filteredStudents = allFailingStudents.filter(student => student.quarter === selectedQuarter);
    }
    
    renderFailingStudents(filteredStudents);
}

// Function to get all failing students from localStorage and Firebase
async function getFailingStudents() {
    const failingStudents = [];
    
    console.log('Getting failing students for:', { grade, strand, section });
    
    // Get all subjects for this grade/strand
    const subjects = getSubjectsForGrade(grade, strand);
    
    console.log('Checking subjects:', subjects);
    
    // First, get all keys from localStorage to see what actually exists
    const existingKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`grades_${grade}_${strand}_${section}_`)
    );
    console.log('Existing grade keys in localStorage:', existingKeys);
    
    // Check each subject and quarter
    for (const subject of subjects) {
        // For grades 11-12
        if (grade === '11' || grade === '12') {
            for (let semester = 1; semester <= 2; semester++) {
                const quarters = semester === 1 ? ['1', '2'] : ['3', '4'];
                
                for (const quarter of quarters) {
                    const storageKey = `grades_${grade}_${strand}_${section}_${semester}_${quarter}_${subject}`;
                    
                    // Skip if key doesn't exist in localStorage (quick check)
                    if (!existingKeys.includes(storageKey)) {
                        continue;
                    }
                    
                    console.log('Checking key:', storageKey);
                    
                    let data = null;
                    
                    // Try localStorage first (faster)
                    const saved = localStorage.getItem(storageKey);
                    if (saved) {
                        try {
                            data = JSON.parse(saved);
                            console.log('Loaded from localStorage:', storageKey);
                        } catch (error) {
                            console.error('Error parsing data:', error);
                        }
                    }
                    
                    // Try Firebase if localStorage failed
                    if (!data && typeof loadFromFirebase === 'function') {
                        try {
                            data = await loadFromFirebase(storageKey);
                            if (data) console.log('Loaded from Firebase:', storageKey);
                        } catch (error) {
                            console.log('Firebase load failed:', error);
                        }
                    }
                    
                    if (data) {
                        console.log('Found data for:', storageKey, data);
                        const students = data.students || { boys: [], girls: [] };
                        
                        console.log('Boys in this subject/quarter:', students.boys);
                        console.log('Girls in this subject/quarter:', students.girls);
                        
                        // Check boys
                        if (Array.isArray(students.boys)) {
                            students.boys.forEach(student => {
                                console.log('Checking boy:', student.name, 'average:', student.average);
                                // Show failing if they have a name and average < 75
                                if (student.name && student.name.trim() !== '' && student.average < 75) {
                                    console.log('Adding failing boy:', student.name);
                                    failingStudents.push({
                                        name: student.name,
                                        subject: subject,
                                        quarter: quarter,
                                        semester: semester,
                                        average: student.average
                                    });
                                }
                            });
                        }
                        
                        // Check girls
                        if (Array.isArray(students.girls)) {
                            students.girls.forEach(student => {
                                console.log('Checking girl:', student.name, 'average:', student.average);
                                // Show failing if they have a name and average < 75
                                if (student.name && student.name.trim() !== '' && student.average < 75) {
                                    console.log('Adding failing girl:', student.name);
                                    failingStudents.push({
                                        name: student.name,
                                        subject: subject,
                                        quarter: quarter,
                                        semester: semester,
                                        average: student.average
                                    });
                                }
                            });
                        }
                    } else {
                        console.log('No data found for:', storageKey);
                    }
                }
            }
        } else {
            // For grades 7-10 (no semester)
            for (const quarter of ['1', '2', '3', '4']) {
                const storageKey = `grades_${grade}_null_${section}_null_${quarter}_${subject}`;
                console.log('Checking key:', storageKey);
                
                let data = null;
                
                // Try Firebase first
                if (typeof loadFromFirebase === 'function') {
                    try {
                        data = await loadFromFirebase(storageKey);
                    } catch (error) {
                        console.log('Firebase load failed:', error);
                    }
                }
                
                // Fallback to localStorage
                if (!data) {
                    const saved = localStorage.getItem(storageKey);
                    if (saved) {
                        try {
                            data = JSON.parse(saved);
                        } catch (error) {
                            console.error('Error parsing data:', error);
                        }
                    }
                }
                
                if (data) {
                    console.log('Found data for:', storageKey);
                    const students = data.students || { boys: [], girls: [] };
                    
                    // Check boys
                    if (Array.isArray(students.boys)) {
                        students.boys.forEach(student => {
                            // Show failing if they have a name and average < 75
                            if (student.name && student.name.trim() !== '' && student.average < 75) {
                                failingStudents.push({
                                    name: student.name,
                                    subject: subject,
                                    quarter: quarter,
                                    semester: null,
                                    average: student.average
                                });
                            }
                        });
                    }
                    
                    // Check girls
                    if (Array.isArray(students.girls)) {
                        students.girls.forEach(student => {
                            // Show failing if they have a name and average < 75
                            if (student.name && student.name.trim() !== '' && student.average < 75) {
                                failingStudents.push({
                                    name: student.name,
                                    subject: subject,
                                    quarter: quarter,
                                    semester: null,
                                    average: student.average
                                });
                            }
                        });
                    }
                }
            }
        }
    }
    
    console.log('Total failing students found:', failingStudents.length);
    return failingStudents;
}

function getSubjectsForGrade(grade, strand) {
    // Return subjects based on grade and strand
    if (grade === '7' || grade === '8' || grade === '9' || grade === '10') {
        return ['ESP', 'MAPEH', 'Science', 'Math', 'AP', 'TLE', 'Filipino', 'English'];
    }
    
    // For grades 11-12, return all possible subjects across all strands and semesters
    if (grade === '11' || grade === '12') {
        return [
            'ESP', 'PerDev', 'PR 2', 'CPAR', 'Gen Chem 1', 'EFAPP', 'PFPL', 'Gen Physics 1', 'MIL', 'PEH',
            'Capstone', 'Entrep', 'Gen Chem 2', 'E-Tech', 'Work Immersion', 'Gen Physics 2',
            'MIT', 'CESC', 'CWNF', 'IWRBS', 'TNCT', 'Culminating',
            'PM', 'PR2', 'FABM 2', 'BF', 'BESR',
            'Cookery',
            'Earth Science', 'Philosophy', 'KomPan', 'Kompan', 'OralCom', 'GenMath', 'Gen Bio 1', '21st Century', 'PreCal',
            'DRRR', 'PR1', 'PPTTP', 'RW', 'UCSP', 'Stats', 'Bascal', 'Gen Bio 2',
            'ELS', 'PPG', 'DISS', 'Physical Science', 'CW',
            'BM', 'OM', 'FABM 1', 'AE',
            'FBS'
        ];
    }
    
    return [];
}

function renderFailingStudents(failingStudents) {
    const tbody = document.getElementById('studentsTable');
    const tableContainer = document.querySelector('.students-table');
    const noFailingDiv = document.getElementById('noFailingStudents');
    
    console.log('Rendering failing students:', failingStudents.length);
    
    if (failingStudents.length === 0) {
        tableContainer.style.display = 'none';
        noFailingDiv.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'table';
    noFailingDiv.style.display = 'none';
    tbody.innerHTML = '';
    
    failingStudents.forEach(student => {
        const row = document.createElement('tr');
        
        const quarterText = student.semester 
            ? `${student.semester === 1 ? '1st' : '2nd'} Sem - Q${student.quarter}`
            : `Q${student.quarter}`;
        
        row.innerHTML = `
            <td><a href="#" onclick="viewStudentDetails('${student.name}', '${student.subject}', '${student.quarter}', '${student.semester}'); return false;" style="color: #00A651; text-decoration: none; font-weight: 500;">${student.name}</a></td>
            <td>${student.subject}</td>
            <td>${quarterText}</td>
            <td class="average-failing">${student.average.toFixed(2)}</td>
            <td class="status-failing">FAILING</td>
        `;
        
        tbody.appendChild(row);
    });
}

function goBack() {
    window.location.href = 'registrar-dashboard.html';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
}

function viewStudentDetails(studentName, subject, quarter, semester) {
    // Navigate to student details page
    window.location.href = `registrar-student-details.html?grade=${grade}&strand=${strand || ''}&section=${encodeURIComponent(section)}&student=${encodeURIComponent(studentName)}&subject=${encodeURIComponent(subject)}&quarter=${quarter}&semester=${semester}`;
}

// Initialize
async function init() {
    console.log('Initializing with:', { grade, strand, section });
    console.log('All localStorage keys:', Object.keys(localStorage));
    allFailingStudents = await getFailingStudents();
    console.log('Total failing students found:', allFailingStudents.length);
    renderFailingStudents(allFailingStudents);
}

init();
