var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
// import models
const { EmployeeRepo } = require('../models/emp');

router.get('/', function (req, res) {
    res.send("Welcome to Employee API");
});

// all employees with a paging feature.
router.get("/all-employees", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const employees = await EmployeeRepo.findAllEmp(page, limit);
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// add employee
router.post("/add-employee", async (req, res) => {
    try {
        console.log("department_id: ", req.body)
        const { department_id, name, dob, phone, email, salary, status } = req.body;

        if (!department_id || !name || !dob || !phone || !email || !salary || !status) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!EmployeeRepo.validatePhone(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number format" });
        }

        if (!EmployeeRepo.validateEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (!EmployeeRepo.isValidDate(dob)) {
            return res.status(400).json({ success: false, message: "Invalid DOB format. Use YYYY-MM-DD." });
        }

        const existingEmployees = await EmployeeRepo.findByPhone();

        for (const emp of existingEmployees) {
          if (await bcrypt.compare(String(phone), emp.phone)) {
            return res.status(400).json({ success: false, message: "Phone number already in use" });
          }
        }
    
        const existing = await EmployeeRepo.findByEmail(email);

        if (existing) return res.status(400).json({ success: false, message: "Email already in use" });

        req.body.phone = await bcrypt.hash(String(phone), 10);

        const employee = await EmployeeRepo.addEmployee(req.body);

        res.status(201).json({ success: true, data: employee, message: "Employee added successfully" });
    } catch (error) {
        console.log("err: ", error)
        res.status(500).json({ success: false, message: error.message });
    }
});

// edit employee
router.put("/employee/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const check = await EmployeeRepo.findById(id);
        if(!check) return res.status(404).json({ success: false, message: "Employee not found" });

        if(req.body.phone) {
            const existingEmployees = await EmployeeRepo.findByPhone();

            for (const emp of existingEmployees) {
              if (await bcrypt.compare(String(req.body.phone), emp.phone)) {
                return res.status(400).json({ success: false, message: "Phone number already in use" });
              }
            }

            req.body.phone = await bcrypt.hash(String(req.body.phone), 10);
        }

        if (req.body.email) {
            const existing = await EmployeeRepo.findByEmail(email);
            if (existing) return res.status(400).json({ success: false, message: "Duplicate contact not allowed" });    
        }

        const employee = await EmployeeRepo.updateEmployee(id, req.body);
        res.status(200).json({ success: true, data: employee, Message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// delete employee
router.delete("/employee/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeRepo.deleteEmployee(id);
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Statistics
router.get("/statistics", async (req, res) => {
    try {
        const salaryByDept = await EmployeeRepo.findSalaryByDept();

        const salaryRangeCount = await EmployeeRepo.findSalaryRangeCount();

        const youngestEmployees = await EmployeeRepo.findYoungestEmployee();
        const employeesWithAge = youngestEmployees.map(emp => ({
            name: emp.youngestEmp.name,
            age: EmployeeRepo.calculateEmployeeAge(emp.youngestEmp.dob)
        }));

        res.status(200).json({
            success: true,
            salaryByDept,
            salaryRangeCount,
            employeesWithAge,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;