import './App.css';
import React, {useState} from "react";
import Axios from 'axios';
import { useEffect } from 'react';

const LoginPage = ({userid, setUserid}) => {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true; 

    const register = () => {
        Axios.post("http://localhost:3001/register", {
        username: usernameReg,
        password: passwordReg
        })
        setUsernameReg("");
        setPasswordReg("");
    };

    const login = () => {
        Axios.post("http://localhost:3001/login", {
        username: username,
        password: password
        }).then((response) => {
        if (response.data.message){
            setLoginStatus(response.data.message);
        } else{
            setLoginStatus(response.data[0].username);
            setUserid(response.data[0].id);
        }
        });
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
        if(response.data.loggedIn === true){
            setLoginStatus(response.data.user[0].username);
            setUserid(response.data.user[0].id);
        }
        });
    });
    
    return (
        <div className="App">
            <div className="registration">
                <h1>Registration</h1>
                <label>Username</label>
                <input type="text" onChange={(e) => {
                    setUsernameReg(e.target.value)
                    }}
                    value={usernameReg}
                />
                <label>Password</label>
                <input type="password" onChange={(e) => {
                    setPasswordReg(e.target.value)
                    }}
                    value={passwordReg}
                />
                <button onClick={register}>Register</button>
            </div>
            <div className="login">
                <h1>Login</h1>
                <input type="text" placeholder='Username...' 
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <input type="password" placeholder='Password...' 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button onClick={login}>Login</button>
            </div>
            <h1>{loginStatus}</h1>
            <h1>{userid}</h1>
        </div>
    );
}
 
export default LoginPage;