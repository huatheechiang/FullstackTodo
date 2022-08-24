import App from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Projects from "./Projects";
import LoginPage from "./LoginPage";
import { useState } from "react";

const NavBar = () => {
    
    const [userid, setUserid] = useState(0);
    
    return (  
        <div className="navbar">
            <BrowserRouter>
                <nav>
                    <Link to="/">Inbox</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/login">Login</Link>
                </nav>
                <Routes>
                    <Route path="/" element={ <App userid={userid} setUserid={setUserid} /> } />
                    <Route path="/projects" element={ <Projects userid={userid} setUserid={setUserid}/> } />
                    <Route path="/login" element={ <LoginPage userid={userid} setUserid={setUserid} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
 
export default NavBar;