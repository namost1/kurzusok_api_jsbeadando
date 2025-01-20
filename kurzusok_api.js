document.getElementById("selection").addEventListener("change", toggleSections);

const API_URL = "https://vvri.pythonanywhere.com/api/courses";

function toggleSections() {
    const selected = document.getElementById("selection").value;
    document.getElementById("course-section").style.display = selected === "courses" ? "block" : "none";
    document.getElementById("student-section").style.display = selected === "students" ? "block" : "none";
}

function loadCourses() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const courseList = document.getElementById("course-list");
            courseList.innerHTML = '';
            data.forEach(course => {
                const li = document.createElement("li");
                li.textContent = `${course.name} (ID: ${course.id})`;
                courseList.appendChild(li);
            });
        })
        .catch(error => console.error('Hiba történt a kurzusok betöltésekor:', error));
}

function loadStudents() {
    console.log("Diákok betöltése...");
}

document.getElementById("course-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const courseName = document.getElementById("course-name").value;
    const newCourse = { name: courseName };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
    })
    .then(response => response.json())
    .then(data => {
        alert('Új kurzus létrehozva!');
        loadCourses(); 
    })
    .catch(error => console.error('Hiba történt a kurzus hozzáadásakor:', error));
});

document.getElementById("student-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const studentName = document.getElementById("student-name").value;
    console.log(`Új diák hozzáadva: ${studentName}`);
});
