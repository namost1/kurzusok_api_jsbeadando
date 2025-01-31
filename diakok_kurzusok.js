const API_BASE = "https://vvri.pythonanywhere.com/api";

window.loadCourses = async function() {
    const response = await fetch(`${API_BASE}/courses`);
    const courses = await response.json();
    displayItems(courses, 'course');
};

window.loadStudents = async function() {
    const response = await fetch(`${API_BASE}/students`);
    const students = await response.json();
    displayItems(students, 'student');
};

function displayItems(items, type) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add(type);
        div.innerHTML = `<strong>${item.name}</strong> 
                        <button onclick="editItem('${type}', ${item.id})">Szerkesztés</button>
                        <button onclick="deleteItem('${type}', ${item.id})">Törlés</button>`;

        if (type === 'course' && item.students && item.students.length > 0) {
            const studentList = document.createElement("ul");
            item.students.forEach(student => {
                const studentItem = document.createElement("li");
                studentItem.textContent = student.name;
                studentList.appendChild(studentItem);
            });
            div.appendChild(studentList);
        } else if (type === 'course') {
            const noStudentsMessage = document.createElement("p");
            noStudentsMessage.textContent = "Nincsenek diákok ebben a kurzusban.";
            div.appendChild(noStudentsMessage);
        }

        contentDiv.appendChild(div);
    });

    contentDiv.innerHTML += `<button onclick="createItem('${type}')">Új ${type}</button>`;
}

window.createItem = async function(type) {
    const name = prompt(`Add meg az új ${type} nevét:`);
    if (!name) return;

    const body = { name };

    if (type === 'student') {
        const courseId = prompt('Add meg a kurzus ID-t, amire a diákot rendeljük:');
        if (courseId) {
            body.courseId = courseId;
        }
    }

    await fetch(`${API_BASE}/${type}s`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    type === 'course' ? loadCourses() : loadStudents();
};

window.editItem = async function(type, id) {
    const name = prompt(`Új név megadása:`);
    if (!name) return;

    let body = { name };

    if (type === 'student') {
        const courseId = prompt('Add meg az új kurzus ID-t a diáknak:');
        if (courseId) {
            body.courseId = courseId;
        }
    }

    if (type === 'course') {
        const students = prompt('Add meg a diákok ID-jait, vesszővel elválasztva:');
        if (students) {
            body.students = students.split(',').map(studentId => parseInt(studentId.trim()));
        }
    }

    const response = await fetch(`${API_BASE}/${type}s/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        type === 'course' ? loadCourses() : loadStudents();
    } else {
        const error = await response.json();
        console.error("Frissítési hiba:", error);
        alert(`Hiba történt a frissítés során: ${error.message || 'Ismeretlen hiba'}`);
    }
};

window.deleteItem = async function(type, id) {
    if (!confirm("Biztosan törlöd?")) return;
    await fetch(`${API_BASE}/${type}s/${id}`, { method: "DELETE" });
    type === 'course' ? loadCourses() : loadStudents();
};
