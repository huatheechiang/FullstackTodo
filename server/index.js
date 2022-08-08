const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "*********",
    database: "todo",
});

app.post("/create", (req, res) => {
    const todo = req.body.todo;
    db.query("INSERT INTO todotable (task) VALUES (?)", [todo], (err, result) =>{
        if(err){
            console.log(err);
        } else {
            res.send("task inserted");
        }
    })
})

app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM todotable", (err, result) =>{
        if(err){
            console.log(err);
        } else { 
            res.send(result);
        }
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM todotable WHERE id = ?", id, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(3001, () =>{
    console.log("Server is running on port 3001")
});