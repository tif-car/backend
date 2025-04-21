                Lonestar Houston Zoo
This is the Lonestar Houston Zoo backend repository. This code is written in Node.js, and is hosted on Azure's webb app. Our goal was to create a functional zoo database system that allowed the user to manage habitats, attractions, animals, sales, and employees. 

This Backend repository include:

# server.js 
This file loads and registers all route files where the endpoints are defined

# routes
It connects the web address or URL of a request to the code that should run. Each route links a specific path to a function in the controller and helps organize how different parts of the app respond to users.

# controllers
This folder has all the Node.js modules responsible for handling the business logic behind each route.
It Processes incoming requests from the routes folder and performs the necessary SQL operations to interact with the database.

# Mini World Description
This website is designed to work with both the customers and zoo employees. 

## Customers
Customers can sign-in if they are a member. They would be allowed to purchase tickets and items from the zoos online store. 

Employees are divided based on their roles.

## Admin
 The admin would be in charge of the HR and maintenance of the zoo. They would be able to sign in and add, edit or delete other employee's data. They would manke sure the maintenace of all deparments are up to date. Departments would include habitats, attractions, and vendors.

## Managers
They would be work be able to view where their employees are working and how their departments are running. 

## Servers
They would be able to log in and create a maintenance request for their specific vendor location.  

## caretakers 
They would be able to sign in and see all the information they would need. This would include any information on the animals they are taking care of. They would be able to add to the feeding log and medical records of the animals. 

# Hosting Locally

- Install git on your machine if you haven't already.
- Make sure the latest version of [Node.js](https://nodejs.org/en/) is installed on your machine. Some features may not work on older versions of Node.js. 

### Cloning The Repository

```bash
 mkdir backend
 cd backend
 git init
 git remote add origin https://github.com/tif-car/backend.git
 git pull origin main
 npm i
 (create .env file in root directory)
 npm run start
``` 

> [!IMPORTANT]
 > Ensure that `.env` and is properly implemented so it could function.

 
```env
 DB_HOST= //url address where mySQL database is hosted
 DB_USER= // valid username 
 DB_PASSWORD=//valid password for DB 
 DB_NAME=zoo
 DB_PORT=3306
 PORT=8080
 ```


