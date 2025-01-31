const apiBaseUrl = 'https://vvri.pythonanywhere.com/api';

// Displays the list of courses
function showCourses() {
    fetch(`${apiBaseUrl}/courses`)
        .then(response => response.json())
        .then(courses => {
            let content = '<h2>Courses</h2>';
            content += `<button onclick="toggleCourseForm()">Create Course</button>`;
            content += `
                <div id="courseForm" style="display:none;">
                    <input type="text" id="courseName" placeholder="Course Name">
                    <button onclick="createCourse()">Save</button>
                </div>
            `;
            courses.forEach(course => {
                content += `
                    <div class="item">
                        <p><strong>ID:</strong> ${course.id}</p>
                        <p><strong>Name:</strong> ${course.name}</p>
                        <button onclick="showEditCourseForm(${course.id}, '${course.name}')">Edit</button>
                        <button onclick="deleteCourse(${course.id})">Delete</button>
                    </div>
                `;
            });
            document.getElementById('content').innerHTML = content;
        });
}

// Displays the list of students
function showStudents() {
    fetch(`${apiBaseUrl}/students`)
        .then(response => response.json())
        .then(students => {
            fetch(`${apiBaseUrl}/courses`)
                .then(response => response.json())
                .then(courses => {
                    let content = '<h2>Students</h2>';
                    content += `
                        <button onclick="toggleStudentForm()">Create Student</button>
                        <div id="studentForm" style="display:none;">
                            <input type="text" id="studentName" placeholder="Student Name">
                            <select id="courseSelect"></select>
                            <button onclick="createStudent()">Save</button>
                        </div>
                    `;
                    students.forEach(student => {
                        const course = courses.find(c => c.id === student.course_id) || { name: 'No Course' };
                        content += `
                            <div class="item">
                                <p><strong>ID:</strong> ${student.id}</p>
                                <p><strong>Name:</strong> ${student.name}</p>
                                <p><strong>Course:</strong> ${course.name}</p>
                                <button onclick="showEditStudentForm(${student.id}, '${student.name}', ${student.course_id})">Edit</button>
                                <button onclick="deleteStudent(${student.id})">Delete</button>
                            </div>
                        `;
                    });
                    document.getElementById('content').innerHTML = content;
                    populateCourseSelect();
                });
        });
}

// Populates the course dropdown
function populateCourseSelect(selectedCourseId = null) {
    fetch(`${apiBaseUrl}/courses`)
        .then(response => response.json())
        .then(courses => {
            const courseSelect = document.getElementById('courseSelect');
            courseSelect.innerHTML = '<option value="">Select Course</option>';
            courses.forEach(course => {
                courseSelect.innerHTML += `<option value="${course.id}">${course.name}</option>`;
            });
            if (selectedCourseId) {
                courseSelect.value = selectedCourseId;
            }
        });
}

// Toggles the course form visibility
function toggleCourseForm() {
    document.getElementById('courseForm').style.display = 
        document.getElementById('courseForm').style.display === 'none' ? 'block' : 'none';
}

// Toggles the student form visibility
function toggleStudentForm() {
    document.getElementById('studentForm').style.display = 
        document.getElementById('studentForm').style.display === 'none' ? 'block' : 'none';
}

// Creates a new course
function createCourse() {
    const name = document.getElementById('courseName').value;
    if (name) {
        fetch(`${apiBaseUrl}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        }).then(() => {
            document.getElementById('courseName').value = '';
            showCourses();
        });
    }
}

// Displays the course edit form
function showEditCourseForm(id, name) {
    document.getElementById('courseForm').style.display = 'block';
    document.getElementById('courseForm').innerHTML = `
        <input type="text" id="courseName" value="${name}" placeholder="Course Name">
        <button onclick="editCourse(${id})">Save</button>
    `;
}

// Edits the course
function editCourse(id) {
    const name = document.getElementById('courseName').value;
    if (name) {
        fetch(`${apiBaseUrl}/courses/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        }).then(() => {
            showCourses();
        });
    }
}

// Deletes a course
function deleteCourse(id) {
    fetch(`${apiBaseUrl}/courses/${id}`, { method: 'DELETE' })
        .then(() => showCourses());
}

// Creates a new student
function createStudent() {
    const name = document.getElementById('studentName').value;
    const courseId = document.getElementById('courseSelect').value;
    if (name && courseId) {
        fetch(`${apiBaseUrl}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, course_id: courseId })
        }).then(() => {
            document.getElementById('studentName').value = '';
            document.getElementById('courseSelect').value = '';
            showStudents();
        });
    }
}

// Displays the student edit form
function showEditStudentForm(id, name, courseId) {
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('studentForm').innerHTML = `
        <input type="text" id="studentName" value="${name}" placeholder="Student Name">
        <select id="courseSelect"></select>
        <button onclick="editStudent(${id})">Save</button>
    `;
    populateCourseSelect(courseId);
}

// Edits the student
function editStudent(id) {
    const name = document.getElementById('studentName').value;
    const courseId = document.getElementById('courseSelect').value;
    if (name && courseId) {
        fetch(`${apiBaseUrl}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, course_id: courseId })
        }).then(() => {
            showStudents();
        });
    }
}

// Deletes a student
function deleteStudent(id) {
    fetch(`${apiBaseUrl}/students/${id}`, { method: 'DELETE' })
        .then(() => showStudents());
}
