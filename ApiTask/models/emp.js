const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        required: true
    },
    // created: {
    //     type: Date,
    //     default: Date.now
    // },
    // modified: {
    //     type: Date,
    //     default: Date.now
    // }
},
{ timestamps: true } // Automatically manages `createdAt` and `updatedAt`
);

const DepartmentSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
},
{ timestamps: true }
);


const Employee = mongoose.model("Employee", EmployeeSchema);
const Department = mongoose.model("Department", DepartmentSchema);

async function findAllEmp(page, limit) {
    try {
        const employees = await Employee.find()
          .skip((page - 1) * limit)
          .limit(Number(limit));
        return employees;
    } catch (error) {
        return error;
    }
};

async function findByEmail(email) {
    try {
        const employee = await Employee.findOne({ email });
        return employee;
    } catch (error) {
        return error;
    }
};

async function findById(_id) {
    try {
        const employee = await Employee.findOne({ _id });
        return employee;
    } catch (error) {
        return error;
    }
};

async function findByPhone(phone, email) {
    try {
        const employee = await Employee.find({}, { phone: 1 });
        return employee;
    } catch (error) {
        return error;
    }
};

function validateEmail(email) { 
    var regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    return regex.test(email);
}

function validatePhone(phone) {
    var regex = /^\d{10}$/;
    return regex.test(phone);
}

function isValidDate(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

async function addEmployee(obj) {
    try {
        const employee = new Employee(obj);
        await employee.save();
        return employee;
    } catch (error) {
        return error;
    }
}

async function updateEmployee(_id, obj) {
    try {
        const employee = await Employee.updateOne({ _id }, { $set: obj });
        return employee;
    } catch (error) {
        return error;
    }
}

async function deleteEmployee(_id) {
    try {
        const employee = await Employee.deleteOne({ _id });
        return employee;
    } catch (error) {
        return error;
    }
}

async function findSalaryByDept() {
    try {
        const employee = await Employee.aggregate([
                { $group: { _id: "$department_id", highestSalary: { $max: "$salary" } } }, 
                { $project: { _id: 0, department_id: "$_id", highestSalary: 1 } },
            ]);
        return employee;
    } catch (error) {
        return error;
    }
}

async function findSalaryRangeCount() {
    try {
        const employee = await Employee.aggregate([
                { 
                    $bucket: { groupBy: "$salary", boundaries: [0, 50001, 100001, Infinity], 
                    default: "100000+", output: { count: { $sum: 1 } } } 
                },
            ]);
        return employee;
    } catch (error) {
        return error;
    }
}

async function findYoungestEmployee() {
    try {
        const employee = await Employee.aggregate([
                    { $sort: { dob: 1 } },
                    { $group: { _id: "$department_id", youngestEmp: { $first: { name: "$name", dob: "$dob" } } } },
                ]);
        return employee;
    } catch (error) {
        return error;
    }
}

function calculateEmployeeAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    let dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

const EmployeeRepo = {
    findAllEmp,
    findByEmail,
    findByPhone,
    findById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    validateEmail,
    validatePhone,
    isValidDate,
    findSalaryByDept,
    findSalaryRangeCount,
    findYoungestEmployee,
    calculateEmployeeAge
};

module.exports.EmployeeRepo = EmployeeRepo;
