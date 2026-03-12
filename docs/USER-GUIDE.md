# User Guide - Grading System
## Giya sa Paggamit - Sistema sa Grades

---

## For Teachers / Para sa mga Maestra

### 1. Login (Pagsulod)

1. Open the website (Ablihi ang website)
2. Select "Teacher" role (Pilia ang "Teacher")
3. Enter your email (Isulod ang imong email)
4. Enter password: `CCCS2026`
5. Click "Login"

**Authorized Teacher Emails:**
- brocalrhiankate@gmail.com
- liganellakatrina@gmail.com
- nathanaudleybasas@gmail.com

---

### 2. Select Class Information (Pagpili sa Klase)

After login, you'll see the Teacher Dashboard:

**Step 1: Choose Grade Level**
- Select from Grade 7 to Grade 12

**Step 2: For Grade 11-12 ONLY**
- Select STRAND (STEM, ABM, HUMSS, GAS, TVL)
- Select SEMESTER (1st or 2nd)

**Step 3: Choose Section**
- Sections will appear based on your grade/strand selection
- Example: Grade 12 STEM has Margaret, Rita, Martha

**Step 4: Choose Quarter**
- 1st, 2nd, 3rd, or 4th Quarter
- For Grade 11-12: Quarters are filtered by semester

**Step 5: Choose Subject**
- Subjects will appear based on your selections
- Example: Grade 12 STEM 1st Sem shows Gen Chem 1, Gen Physics 1, etc.

**Step 6: Click "Edit Grades"**

---

### 3. How to Encode Grades (Unsaon Pag-encode sa Grades)

#### A. Add Students (Pagdugang og Estudyante)

**BOYS Section:**
1. Click "+ Add Row" under BOYS
2. Type student name in the text box
3. Press Enter or click outside
4. Students automatically sort alphabetically

**GIRLS Section:**
1. Click "+ Add Row" under GIRLS
2. Type student name
3. Press Enter or click outside

**Bisaya:**
- Pindota ang "+ Add Row"
- I-type ang ngalan sa estudyante
- Awtomatiko nga mo-sort alphabetically

---

#### B. Add Columns (Pagdugang og Columns)

**Three Types of Columns:**

1. **Activity Columns**
   - Click "Add Activity" button
   - Auto-named as "Act 1", "Act 2", etc.
   - You can add custom name after "Act #:"
   - Example: "Act 1: Quiz" or "Act 2: Homework"

2. **Performance Task (PT) Columns**
   - Click "Add PT" button
   - Named as "PT" by default
   - You can rename it (e.g., "PT 1", "Lab Work")

3. **Exam Columns**
   - Click "Add Exam" button
   - Named as "Exam" by default
   - You can rename it (e.g., "Midterm", "Final")

**Bisaya:**
- Activity = Buluhaton
- PT = Performance Task
- Exam = Eksamen

---

#### C. Set Maximum Points (Pag-set sa Maximum Points)

Below each column header, you'll see a number input:

1. Default is 100 points
2. Click the number to change it
3. Example: Quiz = 20 points, Exam = 50 points
4. Scores cannot exceed max points

**Bisaya:**
- Ang default kay 100 points
- Pwede nimo usbon (20, 50, etc.)
- Dili pwede molapas ang score sa max points

---

#### D. Enter Scores (Pagsulod sa Scores)

1. Click on the score box for each student
2. Type the score
3. Press Enter or Tab to move to next cell
4. Empty boxes show "MISS" in red
5. Scores automatically calculate the average

**Important:**
- Red background = Missing score
- Green average = 75% or above (Passing)
- Red average = Below 75% (Failing)

**Bisaya:**
- I-type ang score sa kada estudyante
- Pula ang kulba = Walay score pa
- Berde ang average = Passing (75% pataas)
- Pula ang average = Bagsak (ubos sa 75%)

---

#### E. Adjust Weights (Pag-adjust sa Weights)

At the top, you'll see three percentage boxes:

- **Activity Weight**: Default 30%
- **PT Weight**: Default 50%  
- **Exam Weight**: Default 20%

**To Change:**
1. Click "Update Weights" button
2. Enter new percentages
3. Must total 100%
4. Click OK

**Example:**
- Activity: 40%
- PT: 40%
- Exam: 20%
- Total: 100% ✓

**Bisaya:**
- Kinahanglan ang total kay 100%
- Activity = 30%, PT = 50%, Exam = 20% (default)
- Pwede nimo usbon base sa imong gusto

---

### 4. Saving and Sending (Pag-save ug Pag-send)

**Auto-Save:**
- Grades automatically save every 30 seconds
- Also saves when you close the tab
- Saves to Firebase (cloud) and localStorage (backup)

**Manual Save:**
- Just edit any score and it saves automatically

**Send to Registrar:**
1. Click "Send to Registrar" button at the top
2. Registrar will receive a notification
3. Grades are saved to cloud immediately

**Bisaya:**
- Awtomatiko nga mag-save kada 30 seconds
- Pindota ang "Send to Registrar" para ipadala sa registrar
- Makita sa registrar ang imong gi-encode

---

### 5. Other Functions (Uban pang Functions)

**Delete Student:**
- Click 🗑️ (trash icon) beside student name
- Confirm deletion

**Delete Column:**
- Click ✕ beside column name
- All scores in that column will be deleted

**Clear All Data:**
- Click "Clear Table" button
- Deletes ALL students and columns
- Use with caution!

**Go Back:**
- Click "← Back" to return to dashboard
- Your work is automatically saved

**Logout:**
- Click "Logout" button
- Confirms before logging out

---

## For Registrar / Para sa Registrar

### 1. Login

1. Select "Registrar" role
2. Email: edrichjumaoas@gmail.com
3. Password: CCCS2026
4. Click Login

---

### 2. View Sections (Pagtan-aw sa Sections)

After login, you'll see all sections organized by grade:

- Grade 12 (with strands)
- Grade 11 (with strands)
- Grade 10
- Grade 9
- Grade 8
- Grade 7

**Click any section** to view all grades for that section.

---

### 3. View Student Grades (Pagtan-aw sa Grades)

**Section View:**
- Shows all subjects with grades
- Shows all quarters
- Click any subject/quarter to see detailed grades

**Student Details:**
- Click on a student's grade
- See complete breakdown:
  - Activities
  - Performance Tasks
  - Exams
  - Final Average

---

### 4. Notifications (Mga Notification)

**Bell Icon (🔔):**
- Shows number of unread notifications
- Click to see all notifications
- Notifications appear when teachers update grades

**Actions:**
- Mark All as Read
- Clear All Notifications
- Click individual notification to mark as read

---

## Troubleshooting / Mga Problema

### Problem: Grades not saving
**Solution:**
1. Check internet connection
2. Open browser console (Press F12)
3. Look for error messages
4. Run `firebase-test.html` to test connection

### Problem: Can't login
**Solution:**
1. Check if email is in authorized list
2. Verify password is correct: `CCCS2026`
3. Make sure you selected the correct role

### Problem: Firebase not working
**Solution:**
1. Open `firebase-test.html`
2. Click "Run Tests"
3. Check which test fails
4. Contact admin if needed

---

## Tips / Mga Tip

1. **Always check Firebase connection** before encoding
   - Look for ✅ in browser console
   
2. **Encode regularly** - Don't wait until deadline
   
3. **Double-check scores** before sending to registrar

4. **Use meaningful column names**
   - Good: "Act 1: Quiz on Cells"
   - Bad: "Act 1"

5. **Keep backup** - System saves to both cloud and local

---

## Keyboard Shortcuts

- **Tab** - Move to next cell
- **Shift + Tab** - Move to previous cell
- **Enter** - Move down
- **Ctrl + S** - Manual save (auto-saves anyway)

---

## Contact / Kontak

If you encounter problems:
1. Check browser console (F12)
2. Take screenshot of error
3. Contact system administrator

---

**Made with ❤️ for CCCS**
