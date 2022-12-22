INSERT INTO department (name)
VALUES ("Software Engineering"),
       ("Sales"),
       ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Front End Web Developer", 60000, 1),
       ("Back End Web Developer", 80000, 1),
       ("Software Engineering Manager", 100000, 1),
       ("Sales Representative", 70000, 2),
       ("Sales Manager", 100000, 2),
       ("Accountant", 60000, 3),
       ("Accounting Manager", 90000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gregory", "Rivera", 1, 3),
       ("Andres", "Sanchez", 2, 3),
       ("Ernestine", "Sherman", 3, NULL),
       ("Ron", "Mcgee", 4, 5),
       ("Michael", "Webb", 5, NULL),
       ("Johnny", "Hines", 6, 7),
       ("Elbert", "Mccormick", 7, NULL);

