/*
//servercjs
require('dotenv').config();                 // Load environment variables

//file to connect to the MySQL database

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());                // Allows frontend to communicate with backend
app.use(express.json());        // Allows receiving JSON data

// Secure MySQL Connection using 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: 
        { rejectUnauthorized: false }  //changed true to false
    
  
    
});
//console.log(process.env.DB_HOST)

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL database");
});


// API Route to Fetch Data from Database
app.get('/api/data', (req, res) => {
    //db.query("SELECT * FROM table", (err, results) => {
    db.query("SELECT * FROM animal", (err, results) => {

        if (err) {
            console.error("Data Retrieval Error: ", err);
            res.status(500).json({ error: "Database error" });
            return;
        }
        res.json(results);
    });
});

// Dynamic port for deployment
//const PORT = process.env.PORT || 3000;

/*
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});

*/

import express from 'express';
import mysql from 'mysql2'; 
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection with SSL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true }
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// API Route to Fetch Data
app.get('/api/data', (req, res) => {
    db.query("SELECT * FROM animal", (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// Determine Local & Azure URLs
const PORT = process.env.PORT || 8080;
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface && iface.family === 'IPv4' && !iface.internal)?.address || 'localhost';

const localURL = `http://${localIP}:${PORT}`;
//const azureURL = `https://${process.env.AZURE_WEB_APP_DOMAIN || 'zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net'}`;
const azureURL = `https://${process.env.WEBSITE_HOSTNAME || 'zooproject-aqbue2e2e3cbh9ek.centralus-01.azurewebsites.net'}`;

// Start the Server
app.listen(PORT, () => {
    console.log("Server is running!");
    console.log(`Local:  ${localURL}/data`);
    console.log(`Azure:  ${azureURL}/data\n`);
});





