import React from 'react';
import './App.css';
import { useState } from "react";
import Axios from "axios";
import swal from 'sweetalert';

function App() {

  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);

  window.onload = function() {
    Axios.get("https://mysql2-deploy-heroku.herokuapp.com/tasks").then((response) => {
      setTaskList(response.data);
    })
  };

  const addTask = () => {
    Axios.post("https://mysql2-deploy-heroku.herokuapp.com/create", {task: task}).then(() => {
      setTaskList([...taskList, {task: task},])
      swal("Task has been added!", {
        buttons: false,
        timer: 1500,
      });
    });
  };

  const getTasks = () => {
    Axios.get("https://mysql2-deploy-heroku.herokuapp.com/tasks").then((response) => {
      if (response.data.length === 0) {
        swal("You do not have any tasks today!", {
          buttons: false,
          timer: 1500,
        });
      } else {
        setTaskList(response.data);
      }
      
    })
  }

  const deleteTask = (id) => {
    Axios.delete(`https://mysql2-deploy-heroku.herokuapp.com/${id}`)
    swal("Task has been removed!", {
      buttons: false,
      timer: 1500,
    });
    getTasks()
  };

  const editTask = (id, task) => {
    swal({
      content: {
        element: "input",
        attributes: {
          placeholder: task,
          type: "text",
        },
      },
    }).then((value) => {
      Axios.put("https://mysql2-deploy-heroku.herokuapp.com/edit", { task: value, id: id});
      swal("Task has been updated!", {
        buttons: false,
        timer: 1500,
      });
      getTasks()
    });
  }


  return (
    <div className="App">
      <section className="task-input">
        <h1>Task Tracker</h1>
        <input type="text" placeholder="Enter task"
        onChange={(event) => setTask(event.target.value)}
        />
        <button className="btn" onClick={ addTask }>Add task</button>
        <button className="btn" onClick={ getTasks }>Show tasks</button>
    </section>
    <section className="task-list">
        {taskList.map((val, key) => {
          return (
          <div key={val.id} className="card">
            <h2>{ val.task }</h2>
            <button className="btn" onClick={() => deleteTask(val.id)}>Delete</button>
            <button className="btn" onClick={() => editTask(val.id, val.task)}>Edit</button>
          </div>
          )
        })}
    </section>
      
    </div>
  );
}

export default App;
