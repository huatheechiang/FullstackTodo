import './App.css';
import {useEffect, useState} from "react";
import Axios from "axios";
import {BsFillTrashFill} from 'react-icons/bs';

//npm install axios

function App({userid, setUserid}) {

  const [todo, setTodo] = useState("");
  const [todolist, setTodolist] = useState([]);
  const [date, setDate] = useState((new Date()).toISOString().substring(0,10));
  const displaylist = [...todolist];
  
  const finallist = displaylist.filter((value) => {
    return value.userid === userid;
  })
  
  const submitTodo = () => {
    if(todo === ""){
      alert("Must fill in a task");
    } else {
      Axios.post("http://localhost:3001/create",{
        todo: todo,
        date: date,
        userid: userid
      })
      setTodo("");
      setDate((new Date()).toISOString().substring(0,10));
    }
  }

  const search = (obj) => {
    if(obj.key === 'Enter'){
      submitTodo();
    }
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/tasks").then((response) => {
      setTodolist(response.data);
    });
  })

  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
      setTodolist(
        todolist.filter((val)=>{
          return val.id !== id;
        })
      );
    });
  };
  
  return (
    <div className="App">
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
        {finallist.map((val, key)=>{
          return (
            <div className="taskBox">
              <h3>{val.task}</h3>
              <button className="deletetask" onClick={() => {deleteTask(val.id);}}><BsFillTrashFill /></button>
              <h3>{(val.date).substring(0,10)}</h3>
            </div>
          )
        })}
      </div>
      <h1>{userid}</h1>
    </div>
  );
}

export default App;
