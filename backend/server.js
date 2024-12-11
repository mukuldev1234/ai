const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/employeesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  about: { type: String, required: true },
  joiningDate: { type: String, required: true },
});

// Employee Model
const Employee = mongoose.model("Employee", employeeSchema);

// Routes
// Fetch all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// Add a new employee
app.post("/api/employees", async (req, res) => {
  const { name, position, about, joiningDate } = req.body;

  if (!name || !position || !about || !joiningDate) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const newEmployee = new Employee({ name, position, about, joiningDate });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error saving employee to database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete an employee by name
app.delete("/api/employees/:name", async (req, res) => {
  const { name } = req.params;
  try {
    await Employee.deleteOne({ name });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee" });
  }
});

// Update an employee's details
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, position, about, joiningDate } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, position, about, joiningDate },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
