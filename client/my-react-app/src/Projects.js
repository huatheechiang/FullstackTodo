import Axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Projects = ({userid, setuUserid}) => {
    
    const [name, setName] = useState("");
    const [namelist, setNamelist] = useState([]);
    const [projectid, setProjectid] = useState(0);
    const [projectname, setProjectname] = useState("");
    const [projecttask, setProjecttask] = useState([]);

    const [todo, setTodo] = useState("");
    const [date, setDate] = useState((new Date()).toISOString().substring(0,10));

    const [projectselected, setProjectselected] = useState(false);

    useEffect(() => {
        Axios.get("http://localhost:3001/names").then((response) => {
            setNamelist(response.data);
        })
    })

    const projectlist = [...namelist];
    const finalprojectlist = projectlist.filter((value) => {
        return value.userid === userid;
    })

    useEffect(() => {
        Axios.get("http://localhost:3001/getprojecttask").then((response) => {
            setProjecttask(response.data);
        })
    })

    const ptask = [...projecttask];
    const pptask = ptask.filter((value) => {
        return (value.projectid === projectid); 
    })

    //adds a project NAME only 
    const addproject = () => {
        if(name === ""){
            alert("Project must have a name");
        } else {
            Axios.post("http://localhost:3001/createproject", {
                name: name,
                userid: userid
            })
            setName("");
        }
    }

    //when you click the PROJECT NAME 
    const addTask = (val) => {
        setProjectname(val.name);
        setProjectid(val.id);
        setProjectselected(true);
    }

    const deleteTask = (id) => {
        Axios.delete(`http://localhost:3001/deleteprojecttask/${id}`).then((response) => {
          setNamelist(
            namelist.filter((val)=>{
              return val.id !== id;
            })
          );
        });
    };

    const deleteproject = (id) => {
        Axios.delete(`http://localhost:3001/deleteprojectname/${id}`)
        Axios.delete(`http://localhost:3001/deleteprojectnametask/${id}`)
        setProjectname("");
        setProjectselected(false);
    }

    const search = (obj) => {
        if(obj.key === 'Enter'){
          submitTodo();
        }
    }

    const submitTodo = () => {
        if(todo === ""){
            alert("Must fill in a task");
        } else if (projectid === 0) {
            alert("Must choose a project");
        } else {
          Axios.post("http://localhost:3001/createprojecttask",{
            todo: todo,
            date: date,
            userid: userid,
            projectid: projectid
          })
          setTodo("");
          setDate((new Date()).toISOString().substring(0,10));
        }
      }

    return (  
        <div className="projects">
            <input 
                type="text" 
                placeholder="Project name..."
                onChange={(event) => setName(event.target.value)}
                value={name}
            />
            <button className="addproject" onClick={addproject}>Add project</button>
            <div>  
                {finalprojectlist.map((val, key) => {
                    return (
                        <div>
                            <button onClick={() => addTask(val)}>{val.name}</button>
                            <button onClick={() => deleteproject(val.id)}>Delete Project</button>
                        </div>
                    )
                })}
            </div>  
            <h1>{projectname}</h1>
            {projectselected && <div>
                <div className="enterToDo">
                    <input type="text" placeholder="Enter task..." 
                        className="taskinput"
                        onChange={(event)=>{ setTodo(event.target.value)}}
                        onKeyPress={search}
                        value={todo}
                    />
                    <input 
                        type="date" 
                        className="dateinput"
                        placeholder="Enter date..." 
                        onChange={(event) => setDate(event.target.value)}
                        value={date}
                    />
                    <button className="savetask" onClick={submitTodo}>Save task</button>
                </div>
                <div className="todolist">
                    {pptask.map((val, key)=>{
                    return (
                        <div className="taskBox">
                            <h3>{val.task}</h3>
                            <button className="deletetask" onClick={() => {deleteTask(val.id);}}>Delete</button>
                            <h3>{(val.date).substring(0,10)}</h3>
                        </div>
                    )
                    })}
                </div>
            </div>}
        </div>
    );
}
 
export default Projects;
