function updateForm() {
    const grade = document.getElementById('grade').value;
    const strandGroup = document.getElementById('strandGroup');
    const semesterGroup = document.getElementById('semesterGroup');
    
    // Show strand and semester for grades 11-12
    if (grade === '11' || grade === '12') {
        strandGroup.classList.add('show');
        strandGroup.style.display = 'flex';
        semesterGroup.classList.add('show');
        semesterGroup.style.display = 'flex';
    } else {
        strandGroup.classList.remove('show');
        strandGroup.style.display = 'none';
        semesterGroup.classList.remove('show');
        semesterGroup.style.display = 'none';
        document.getElementById('strand').value = '';
        document.getElementById('semester').value = '';
    }
    
    // Update sections and subjects when grade changes
    updateSections();
    updateSubjects();
}

function updateSections() {
    const grade = document.getElementById('grade').value;
    const strand = document.getElementById('strand').value;
    const sectionSelect = document.getElementById('section');
    
    let sections = [];
    
    // Grade 12 sections
    if (grade === '12') {
        if (strand === 'STEM') {
            sections = ['Margaret', 'Rita', 'Martha'];
        } else if (strand === 'HUMSS') {
            sections = ['Philomena', 'Theresa'];
        } else if (strand === 'ABM') {
            sections = ['Gertrude'];
        } else if (strand === 'TVL') {
            sections = ['Agatha'];
        }
    }
    // Grade 11 sections
    else if (grade === '11') {
        if (strand === 'STEM') {
            sections = ['Pedro', 'Ignatius', 'Gregory'];
        } else if (strand === 'HUMSS') {
            sections = ['Timothy', 'James'];
        } else if (strand === 'ABM') {
            sections = ['Pio'];
        } else if (strand === 'TVL') {
            sections = ['Hannibal'];
        }
    }
    // Grade 10 sections
    else if (grade === '10') {
        sections = ['Benedict', 'John', 'Luke', 'Mark', 'Matthew', 'Philip'];
    }
    // Grade 9 sections
    else if (grade === '9') {
        sections = ['Agnes', 'Anne', 'Bernadette', 'Bridget', 'Monica', 'Therese'];
    }
    // Grade 8 sections
    else if (grade === '8') {
        sections = ['Andrew', 'Jude', 'Lorenzo', 'Martin', 'Paul', 'Peter'];
    }
    // Grade 7 sections
    else if (grade === '7') {
        sections = ['Anthony', 'Elizabeth', 'Francis', 'Joseph', 'Michael', 'Roque', 'Thomas'];
    }
    
    // Update section dropdown
    sectionSelect.innerHTML = '<option value="">Select Section</option>';
    sections.forEach(section => {
        sectionSelect.innerHTML += `<option value="${section}">${section}</option>`;
    });
}

function updateQuarter() {
    const grade = document.getElementById('grade').value;
    const semester = document.getElementById('semester').value;
    const quarterSelect = document.getElementById('quarter');
    
    // For grades 11-12, filter quarters based on semester
    if ((grade === '11' || grade === '12') && semester) {
        quarterSelect.innerHTML = '<option value="">Select Quarter</option>';
        
        if (semester === '1') {
            quarterSelect.innerHTML += '<option value="1">1st Quarter</option>';
            quarterSelect.innerHTML += '<option value="2">2nd Quarter</option>';
        } else if (semester === '2') {
            quarterSelect.innerHTML += '<option value="3">3rd Quarter</option>';
            quarterSelect.innerHTML += '<option value="4">4th Quarter</option>';
        }
    } else {
        // For grades 7-10, show all quarters
        quarterSelect.innerHTML = '<option value="">Select Quarter</option>';
        quarterSelect.innerHTML += '<option value="1">1st Quarter</option>';
        quarterSelect.innerHTML += '<option value="2">2nd Quarter</option>';
        quarterSelect.innerHTML += '<option value="3">3rd Quarter</option>';
        quarterSelect.innerHTML += '<option value="4">4th Quarter</option>';
    }
    
    // Update subjects when semester changes
    updateSubjects();
}

function updateSubjects() {
    const grade = document.getElementById('grade').value;
    const strand = document.getElementById('strand').value;
    const semester = document.getElementById('semester').value;
    const section = document.getElementById('section').value;
    const subjectSelect = document.getElementById('subject');
    
    let subjects = [];
    
    // Grade 12 subjects
    if (grade === '12') {
        if (strand === 'STEM') {
            // Margaret, Rita, Martha sections
            if (semester === '1') {
                subjects = ['ESP', 'PerDev', 'PR 2', 'CPAR', 'Gen Chem 1', 'EFAPP', 'PFPL', 'Gen Physics 1', 'MIL', 'PEH'];
            } else if (semester === '2') {
                subjects = ['ESP', 'Capstone', 'Entrep', 'Gen Chem 2', 'E-Tech', 'Work Immersion', 'Gen Physics 2', 'PEH'];
            }
        } else if (strand === 'HUMSS') {
            // Philomena, Theresa sections
            if (semester === '1') {
                subjects = ['ESP', 'PerDev', 'PR 2', 'MIT', 'EFAPP', 'CESC', 'CPAR', 'CWNF', 'PFPL', 'PEH'];
            } else if (semester === '2') {
                subjects = ['ESP', 'Work Immersion', 'IWRBS', 'TNCT', 'E-Tech', 'Culminating', 'Entrep', 'PEH'];
            }
        } else if (strand === 'ABM') {
            // Gertrude section
            if (semester === '1') {
                subjects = ['ESP', 'PFPL', 'PM', 'PR2', 'MIL', 'FABM 2', 'PerDev', 'EFAPP', 'CPAR', 'PEH'];
            } else if (semester === '2') {
                subjects = ['ESP', 'Culminating', 'BF', 'PEH', 'Entrep', 'BESR', 'Work Immersion', 'E-Tech'];
            }
        } else if (strand === 'TVL') {
            // Agatha section
            if (semester === '1') {
                subjects = ['ESP', 'EFAPP', 'CPAR', 'Cookery', 'PFPL', 'MIL', 'PerDev', 'PR 2', 'PEH'];
            } else if (semester === '2') {
                subjects = ['ESP', 'E-Tech', 'Entrep', 'Cookery', 'Culminating', 'Work Immersion', 'PEH'];
            }
        }
    }
    // Grade 11 subjects
    else if (grade === '11') {
        if (strand === 'STEM') {
            // Pedro, Ignatius, Gregory sections
            if (semester === '1') {
                subjects = ['ESP', 'Earth Science', 'Philosophy', 'KomPan', 'OralCom', 'GenMath', 'Gen Bio 1', 'PEH', '21st Century', 'PreCal'];
            } else if (semester === '2') {
                subjects = ['ESP', 'DRRR', 'PR1', 'PPTTP', 'RW', 'UCSP', 'Stats', 'Bascal', 'PEH', 'Gen Bio 2'];
            }
        } else if (strand === 'HUMSS') {
            // Timothy, James sections
            if (semester === '1') {
                subjects = ['ESP', 'Kompan', 'OralCom', 'GenMath', 'Philosophy', 'ELS', '21st Century', 'PPG', 'DISS', 'PEH'];
            } else if (semester === '2') {
                subjects = ['ESP', 'PPTTP', 'RW', 'UCSP', 'Physical Science', 'PR1', 'CW', 'DISS', 'PEH'];
            }
        } else if (strand === 'ABM') {
            // Pio section
            if (semester === '1') {
                subjects = ['ESP', '21st Century', 'GenMath', 'ELS', 'BM', 'OralCom', 'Philosophy', 'KomPan', 'OM', 'PEH'];
            } else if (semester === '2') {
                subjects = ['ESP', 'PR1', 'Stats', 'Physical Science', 'FABM 1', 'RW', 'UCSP', 'PPTTP', 'AE', 'PEH'];
            }
        } else if (strand === 'TVL') {
            // Hannibal section
            if (semester === '2') {
                subjects = ['ESP', 'RW', 'PPTTP', 'UCSP', 'Physical Science', 'FBS', 'PR 1', 'Stats', 'PEH'];
            }
        }
    }
    // Grades 7-10 subjects (Junior High)
    else if (grade === '7' || grade === '8' || grade === '9' || grade === '10') {
        subjects = ['ESP', 'MAPEH', 'Science', 'Math', 'AP', 'TLE', 'Filipino', 'English'];
    }
    
    // Update subject dropdown
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjects.forEach(subject => {
        subjectSelect.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
}

function proceed() {
    const grade = document.getElementById('grade').value;
    const section = document.getElementById('section').value;
    const quarter = document.getElementById('quarter').value;
    const subject = document.getElementById('subject').value;
    
    if (!grade || !section || !quarter || !subject) {
        alert('Please fill in all required fields');
        return;
    }
    
    // For grades 11-12, check strand and semester
    if (grade === '11' || grade === '12') {
        const strand = document.getElementById('strand').value;
        const semester = document.getElementById('semester').value;
        
        if (!strand || !semester) {
            alert('Please select strand and semester for Grade ' + grade);
            return;
        }
        
        // Redirect to edit grades page with parameters
        window.location.href = `edit-grades.html?grade=${grade}&strand=${strand}&section=${section}&semester=${semester}&quarter=${quarter}&subject=${encodeURIComponent(subject)}`;
    } else {
        // Redirect to edit grades page with parameters
        window.location.href = `edit-grades.html?grade=${grade}&section=${section}&quarter=${quarter}&subject=${encodeURIComponent(subject)}`;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
}
