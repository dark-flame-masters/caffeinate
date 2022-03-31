import '../styling/AgendaPage.css';
import React from 'react';
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import { useEffect, useState, useRef } from 'react';
import Checkbox from '@mui/material/Checkbox';
import DateAdapter from '@mui/lab/AdapterDayjs';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';

const StyledTextField = styled(TextField)`
label.focused {
    color: #D7B19D;
}
.MuiOutlinedInput-root {
    fieldset {
        border-color: #D7B19D;
    }
    &:hover fieldset {
        border-color: #D7B19D;
    }
    &.Mui-focused fieldset {
        border-color: #483434;
    }     
}
`;

export default function AgendaPage(props) {
    const { user } = props;
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const [value, setValue] = useState('');
    
    
    const todoRef = useRef(null);
    const [selected, setSelected] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [dateError, setDateError] = useState(false);
    

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
            headers: {...Constants.HEADERS, Authorization: user},
            data: { "operationName": "createTodo",
                    "query": 
                      `mutation createTodo($input: CreateTodoInput!){
                        createTodo(input: $input)
                      }`,
                    "variables": dueDate.length ? {'input': {item: content, dueDate}} : {'input': {item: content}},
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
            headers: {...Constants.HEADERS, Authorization: user},
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
            headers: {...Constants.HEADERS, Authorization: user},
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
            headers: {...Constants.HEADERS, Authorization: user},
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
                <form className="todo-form">
                <div className="deadline">


                <StyledTextField className="TextField" label="New Todo" variant="outlined" inputRef={todoRef} fullWidth/>
                <ToggleButton
                    value="check"
                    selected={selected}
                    onChange={() => {
                        setSelected(!selected);
                    }}
                    sx={{ width: 1/3 }} 
                >
                Set a deadline
                </ToggleButton> 
                </div>

                {selected ? 
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DateTimePicker
                            label="Deadline"
                            value={value}
                            onChange={handleDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider> : ''}
                
                </form>
            </div>

            <div className="agenda-list">
                <div className="agenda-list__title">
                    Your Todo List
                </div>
                
                <div className="todo-list">
                {todos.length ? 
                    <>
                        {todos.map((todo, idx) => 
                            <div className="todo-item" key={todo._id}>
                                <Checkbox
                                    checked={todo.checked}
                                    onChange={(e) => handleChange(e, todo._id, idx)}
                                />
                                <div className="todo">{todo.item}</div>
                                <div className="delete" onClick={(todo) => deleteTodo(todo._id, idx)}></div>
                            </div>
                        )} 
                    </>
                : 'No todos'}
                </div>

            </div>
        </div>
    );
};