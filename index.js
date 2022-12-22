const inquirer = require('inquirer');
const db = require("./db/dbconnect");

//conncect database and run terminal api
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    init();
}) 

// api menu options

const menu = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do? (Use arrow keys)",
        choices : [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "View total budget of a department",
            "End Program"
        ],
    }
];
const addEmployeeMenu = [
    {
      type: "input",
      message:
        "First name of the employee?",
      name: "firstName"
    },
    {
      type: "input",
      message:
        "Last name of the employee?",
      name: "lastName"
    },
    {
      type: "input",
      message: "role id?",
      name: "roleid"
    },
    {
      type: "input",
      message: "manager's id?",
      name: "managerid"
    }
  ]

// TODO: Create a function to initialize app
function init() {
    inquirer.prompt(menu).then(
        function({ menu }){
            // start a function based on user's selection
            if (menu === "View All Employees") {
                viewAllEmployees()
            } else if (menu === "Add Employee") {
                inquirer.prompt(addEmployeeMenu).then(function(response) {
                    addEmployee([
                        response.firstName,
                        response.lastName,
                        response.roleid,
                        response.managerid
                    ]);
                });
            }  else if (menu === "Update Employee Role") {
                updateEmployeeRole()
            }  else if (menu === "View All Roles") {
                viewRoles()
            }  else if (menu === "Add Role") {
                addRole()
            }  else if (menu === "View All Departments") {
                viewDepartments()
            }   else if (menu === "Add Department") {
                addDepartment()
            }   else if (menu === "View total budget of a department"){
                viewDepBudget()
            }   else if (menu === "End Program") {
                console.log("\n")
                console.log("Thank you")
                process.exit(1)
            }

        }
    )
};
// view the list of employees
function viewAllEmployees() {
    console.log("\n")
    let que = ` SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee. role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
    db.query(que, (err, res) => {
        console.table(res);
        setTimeout(()=>{
            console.log("\n");
            init()
        }, 1000)
    })  
}
// add an employee
function addEmployee(newEmployeeinfo){
    let que = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
    db.query(que, newEmployeeinfo, (err, res) => {
        setTimeout(()=>{
            console.log("New employee is added");
            init()
        }, 1000)
    })
}
// update an employee's role
function updateEmployeeRole(){
    db.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS fullname FROM employee;", (err, name) => {
        employeeArray = []
        Object.keys(name).forEach(function (key) {
            employeeArray.push(name[key].fullname);
        });
        inquirer.prompt([
            {
              type: "list",
              message: "Select employee you want to update in the list",
              name: "employeeName",
              choices: employeeArray
            },
            {
              type: "input",
              message: "role id?",
              name: "roleid"
            }
            ]).then(function(response) {
            let Name = response.employeeName.split(" ");
            let firstName = Name[0];
            let lastName = Name[1];
            db.query("UPDATE employee SET role_id = (?) WHERE first_name = ? AND last_name = ?;", [response.roleid, firstName, lastName], (err, res) => {
                setTimeout(()=>{
                    console.log("employee role is updated");
                    init()
                }, 1000)
            })
        })
    })
        
}
// view the list of roles
function viewRoles() {
    console.log("\n")
    let que = `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id;`
    db.query(que, (err, res) => {
        console.table(res);
        setTimeout(()=>{
            console.log("\n");
            init()
        }, 1000)
    })  
}
// add a new role
function addRole(){
    inquirer.prompt([
        {
          type: "input",
          message: "Name of role?",
          name: "role"
        },
        {
          type: "input",
          message: "Salary?",
          name: "salary"
        },
        {
          type: "input",
          message:"department id?",
          name: "departmentid",
          default: "1"
        }
      ]).then(function(response) {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.role, response.salary, response.departmentid], (err, res) => {
            setTimeout(()=>{
                console.log("New role is added");
                init()
            }, 1000)
        })
      })
}

// view the list of departments 

function viewDepartments() {
    console.log("\n")
    let que = `SELECT * FROM department;`
    db.query(que, (err, res) => {
        console.table(res);
        setTimeout(()=>{
            console.log("\n");
            init()
        }, 1000)
    })  
}

// add a new department

function addDepartment(newEmployeeinfo){
    inquirer.prompt([
        {
        type: "input",
        message:"Name of the department?",
        name: "department"
        }
    ]).then(function(response) {
        db.query("INSERT INTO department (name) VALUES (?)", response.department, (err, res) => {
            setTimeout(()=>{
                console.log("New employee is added");
                init()
            }, 1000)
        })
      });
}

// view total amount of budget of the selected department

function viewDepBudget(){
    console.log("\n")
    let que = `SELECT * FROM department;`
    db.query(que, (err, res) => {
        const department = [];
        res.forEach(({ name, id }) => {
            department.push({
                name: name,
                value: id
            });
        });
        inquirer.prompt([
            {
                type: "list",
                choices: department,
                message: "Select the name of a deparment that you want to see their total budget",
                name: "depBudget"
            }
        ]).then(function(response) {
            db.query(`SELECT D.name, SUM(salary) AS budget FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id WHERE D.id = ?`, [response.depBudget], (err, res) => {
                console.table(res);
                setTimeout(()=>{
                    console.log("\n");
                    init()
                }, 1000)
            })  
        })
    })
}