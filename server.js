/*
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
        { rejectUnauthorized: true }
    
  
    
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

app.get('/test', (req, res) => {
    res.send("✅ Test route is working!");
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
const PORT = process.env.PORT || 3000;

console.log("🛠️ Starting Node.js server...");
console.log("📡 Listening on port:", PORT);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//8080
//3000
*/
import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true }
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL database");
});

app.get('/test', (req, res) => {
    res.send("✅ Test route is working!");
});

app.get('/api/data', (req, res) => {
    db.query("SELECT * FROM animal", (err, results) => {
        if (err) {
            console.error("Data Retrieval Error: ", err);
            res.status(500).json({ error: "Database error" });
            return;
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
