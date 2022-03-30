import '../styling/AgendaPage.css';
import React from 'react';
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import DateAdapter from '@mui/lab/AdapterDayjs';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function AgendaPage(props) {
    const { user } = props;
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));

    const handleDate = (newValue) => {
      setValue(newValue);
    };

    // useEffect(()=> {
    //     axios({
    //         url: Constants.GRAPHQL_ENDPOINT,
    //         method: "post",
    //         headers: Constants.HEADERS,
    //         data: { "operationName": "findTodoByAuthor",
    //                 "query": 
    //                   `mutation findTodoByAuthor($input: UpdateTodoInput!){
    //                     findTodoByAuthor(input: $input) {
    //                         item
    //                     }
    //                   }`,
    //                 "variables": {'input': {author: user}},
    //               }
    //       })
    //       .then(res => {
    //         if (res.data.data) {
    //             setTodos(prevTodos => prevTodos.filter((_, i) => i !== tIdx));
    //         } else {
    //             if (res.data.errors[0].message === "Unauthorized") {
    //                 setError("You are not authorized to complete this action. Please sign out and sign in again.");
    //             } else {
    //                 setError("Could not complete todo. Try again later.")
    //             }
    //         }
    //     })
    //     .catch(error => {
    //         setError("Could not fetch todos. Try again later.")
    //     }); 
    // }, [])

    const addTodo = (content, dueDate="") => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: Constants.HEADERS,
            data: { "operationName": "createTodo",
                    "query": 
                      `mutation createTodo($input: CreateTodoInput!){
                        createTodo(input: $input)
                      }`,
                    "variables": dueDate.length ? {'input': {author: user, item: content, dueDate}} : {'input': {author: user, item: content}},
                  }
          })
          .then(res => {
            console.log(res);
            if (res.data.data) {
            } else {
                if (res.data.errors[0].message === "Unauthorized") {
                    setError("You are not authorized to complete this action. Please sign out and sign in again.");
                } else {
                    setError("Could not delete todo. Try again later.")
                }
            }
        })
        .catch(error => {
            setError("Could not delete todo. Try again later.")
        }); 
    };

    const deleteTodo = (tID, tIdx) => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: Constants.HEADERS,
            data: { "operationName": "deleteTodo",
                    "query": 
                      `mutation deleteTodo($input: UpdateTodoInput!){
                        deleteTodo(input: $input)
                      }`,
                    "variables": {'input': {author: user, _id: tID}},
                  }
          })
          .then(res => {
            if (res.data.data) {
                setTodos(prevTodos => prevTodos.filter((_, i) => i !== tIdx));
            } else {
                if (res.data.errors[0].message === "Unauthorized") {
                    setError("You are not authorized to complete this action. Please sign out and sign in again.");
                } else {
                    setError("Could not delete todo. Try again later.")
                }
            }
        })
        .catch(error => {
            setError("Could not delete todo. Try again later.")
        }); 
    };

    const handleChange = (e, tID, tIdx) => {
        if (e.target.checked) {
            setComplete(tID, tIdx);
        } else {
            setIncomplete(tID, tIdx);
        }
    }

    const setComplete = (tID, tIdx) => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: Constants.HEADERS,
            data: { "operationName": "completeTodo",
                    "query": 
                      `mutation completeTodo($input: UpdateTodoInput!){
                        completeTodo(input: $input)
                      }`,
                    "variables": {'input': {author: user, _id: tID}},
                  }
          })
          .then(res => {
            if (res.data.data) {
                setTodos([
                    ...todos.slice(0, tIdx),
                    {
                        ...todos[tIdx],
                        completed: true,
                    },
                    ...todos.slice(tIdx + 1)
                ]);
            } else {
                if (res.data.errors[0].message === "Unauthorized") {
                    setError("You are not authorized to complete this action. Please sign out and sign in again.");
                } else {
                    setError("Could not mark todo as complete. Try again later.")
                }
            }
        })
        .catch(error => {
            setError("Could not mark todo as complete. Try again later.")
        }); 
    };

    const setIncomplete = (tID, tIdx) => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: Constants.HEADERS,
            data: { "operationName": "incompleteTodo",
                    "query": 
                      `mutation incompleteTodo($input: UpdateTodoInput!){
                        incompleteTodo(input: $input)
                      }`,
                    "variables": {'input': {author: user, _id: tID}},
                  }
          })
          .then(res => {
            if (res.data.data) {
                setTodos([
                    ...todos.slice(0, tIdx),
                    {
                        ...todos[tIdx],
                        completed: false,
                    },
                    ...todos.slice(tIdx + 1)
                ]);
            } else {
                if (res.data.errors[0].message === "Unauthorized") {
                    setError("You are not authorized to complete this action. Please sign out and sign in again.");
                } else {
                    setError("Could not mark todo as incomplete. Try again later.")
                }
            }
        })
        .catch(error => {
            setError("Could not mark todo as incomplete. Try again later.")
        }); 
    };

    return (
        <div className="agenda-page">
            {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}

            <div className="agenda-slogan">
                {user}, what do you need to do today?
            </div>

            <div className="agenda-todo">
                <form>
                    <label for="fname">First name:</label>
                    <input type="text" id="fname" name="fname" />
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DateTimePicker
                            label="Deadline"
                            value={value}
                            onChange={handleDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </form>
            </div>

            <div className="agenda-list">
                <div className="agenda-list__title">
                    Todo
                </div>
                
                {todos.length ? 
                    <div>
                        {todos.map((todo, idx) => 
                            <div key={todo._id}>
                                <Checkbox
                                    checked={todo.checked}
                                    onChange={(e) => handleChange(e, todo._id, idx)}
                                />
                                <div className="todo">{todo.item}</div>
                                <div className="delete" onClick={(todo) => deleteTodo(todo._id, idx)}></div>
                            </div>
                        )} 
                    </div>
                : ''}

            </div>
        </div>
    );
};