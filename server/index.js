const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

//npm init
//npm install mysql express
//npm install cors

//For login page / user authentication
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        //the get and post methods were screwing things up, right now the methods are * (all of them)
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookies: {
        expires: 60 * 60 * 24 * 1000
    }
}))

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "********",
    database: "todo",
});

app.post("/create", (req, res) => {
    const todo = req.body.todo;
    const date = req.body.date;
    const userid = req.body.userid;
    db.query("INSERT INTO completetable (task, date, userid) VALUES (?, ?, ?)", [todo, date, userid], (err, result) =>{
        if(err){
            console.log(err);
        } else {
            res.send("task inserted");
        }
    })
})

app.post("/createproject", (req, res) => {
    const name = req.body.name;
    const userid = req.body.userid;
    db.query("INSERT INTO projecttable (name, userid) VALUES (?, ?)", [name, userid], (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send("task inserted");
        }
    })
}) 

app.post("/createprojecttask", (req, res) => {
    const todo = req.body.todo;
    const date = req.body.date;
    const userid = req.body.userid;
    const projectid = req.body.projectid;
    db.query("INSERT INTO projecttask (task, date, userid, projectid) VALUES (?, ?, ?, ?)", [todo, date, userid, projectid], (err, result) =>{
        if(err){
            console.log(err);
        } else {
            res.send("task inserted");
        }
    })
})

app.get("/names", (req, res) => {
    db.query("SELECT * FROM projecttable", (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result); 
        }
    })
})

app.get("/getprojecttask", (req, res) => {
    db.query("SELECT * FROM projecttask", (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result); 
        }
    })
})

app.delete("/deleteprojecttask/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM projecttask WHERE id = ?", id, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/deleteprojectnametask/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM projecttask WHERE projectid = ?", id, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/deleteprojectname/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM projecttable WHERE id = ?", id, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    })
});

app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM completetable", (err, result) =>{
        if(err){
            console.log(err);
        } else { 
            res.send(result);
        }
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM completetable WHERE id = ?", id, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

//for login page / user authentication

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        db.query("INSERT INTO loginsystem (username, password) VALUES (?, ?)", [username, hash], (err, result) => {    
            if(err){
                console.log(err);
            } else {
                res.send("user inserted");
            }
        })
    })
})

app.get('/login', (req, res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false})
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    db.query("SELECT * FROM loginsystem WHERE username = ?", username, (err, result) => {    
        if(err){
            console.log(err);
        } 
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (error, response) => {
                if(response){
                    req.session.user = result;
                    console.log(req.session.user);
                    res.send(result);
                } else {
                    res.send({message: "Wrong username or password"});
                }
            });
        } else {
            res.send({message: "User doesn't exist"});
        }
    })
})

app.listen(3001, () =>{
    console.log("Server is running on port 3001")
});