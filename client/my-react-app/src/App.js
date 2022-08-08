import './App.css';
import {useEffect, useState} from "react";
import Axios from "axios";
import {BsFillTrashFill} from 'react-icons/bs';

function App() {

  const [todo, setTodo] = useState("");
  const [todolist, setTodolist] = useState([]);

  const submitTodo = () => {
    Axios.post("http://localhost:3001/create",{
      todo: todo
    }).then(() => {
      setTodolist([
        ...todolist,
        {
          todo: todo
        },
      ]);
    });
    setTodo("");
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
          onChange={(event)=>{ setTodo(event.target.value)}}
          onKeyPress={search}
          value={todo}
        />
        <button className="savetask" onClick={submitTodo}>Save task</button>
      </div>
      <div className="todolist">
        {todolist.map((val, key)=>{
          return (
            <div className="taskBox">
            <h3>{val.task}</h3>
            <button className="deletetask" onClick={() => {deleteTask(val.id);}}><BsFillTrashFill /></button>
            </div>
          )
        })}

      </div>
    </div>
  );
}

export default App;
