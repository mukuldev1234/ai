document.addEventListener("DOMContentLoaded", () => {
    const employeesTable = document.getElementById("employee-list");

    // Fetch Employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/employees");
            const employees = await response.json();

            employeesTable.innerHTML = `
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>About</th>
                    <th>Joining Date</th>
                    <th>Actions</th>
                </tr>
            `;

            employees.forEach((employee) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.position}</td>
                    <td>${employee.about}</td>
                    <td>${employee.joiningDate}</td>
                    <td>
                        <button onclick="deleteEmployee('${employee.name}')">Delete</button>
                    </td>
                `;
                employeesTable.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Delete Employee
    window.deleteEmployee = async (name) => {
        try {
            const response = await fetch(`http://localhost:3000/api/employees/${name}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchEmployees();
            } else {
                alert("Error deleting employee");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };
    

    // Handle Registration
    const registrationForm = document.querySelector("#registration-form");
    if (registrationForm) {
        registrationForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const position = document.getElementById("position").value.trim();
            const about = document.getElementById("about").value.trim();
            const joiningDate = document.getElementById("joining_date").value;

            try {
                const response = await fetch("http://localhost:3000/api/employees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, position, about, joiningDate }),
                });

                if (response.ok) {
                    alert("Employee registered successfully!");
                    window.location.href = "listing.html";
                } else {
                    const data = await response.json();
                    alert(data.message || "Error registering employee");
                }
            } catch (error) {
                console.error("Error registering employee:", error);
            }
        });
    }

    // Fetch employees on page load
    if (employeesTable) {
        fetchEmployees();
    }
});
