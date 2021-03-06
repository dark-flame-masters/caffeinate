import '../styling/AgendaPage.css';
import React from 'react';
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import { useEffect, useState, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import DateAdapter from '@mui/lab/AdapterDayjs';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import CircularProgress from '@mui/material/CircularProgress';

// learned how to do styling from https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield and https://stackoverflow.com/questions/64721126/how-to-style-textfield-in-materialui
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
    const { user, name } = props;
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const [idx, setIDX] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);    
    
    const todoRef = useRef(null);
    const [selected, setSelected] = useState(false);
    const [dueDate, setDueDate] = useState('');

    const handleDate = (deadline) => {
        setDueDate(deadline);
    };

    const changePage = (direction) => {
        if (direction) {
            getTodos(idx - 1, true);
        } else {
            getTodos(idx + 1, true);
        }
    }

    useEffect(()=> {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: {...Constants.HEADERS, Authorization: user},
                    data: { "operationName": "findUserByName",
                    "query": 
                      `query findUserByName {
                        findUserByName {
                          todoCount
                        }
                      }`,
                  }
                })
        .then(res => {
            if (res.data.data) {
                getTodos(idx);
                setCount(res.data.data.findUserByName.todoCount);
                setLoading(false);
            } else {
                if (res.data.errors[0].message === "Unauthorized") {
                    setError("You are not authorized. Please sign out and sign in again.");
                } else {
                    setError("There was a problem fetching todo items.");
                }
            }
        }).catch(error => {
            setError("There was a problem fetching todo items.");
        })        
    }, [])

    const getTodos = (tIdx, page) => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: {...Constants.HEADERS, Authorization: user},
            data: { "operationName": "findTodoByAuthorIndex",
                    "query": 
                      `query findTodoByAuthorIndex($input: Float!) {
                        findTodoByAuthorIndex(index: $input) {
                            item
                            completed
                            _id
                        }
                    }`,
                    "variables": {input: tIdx},
                }
            })
        .then(res => {
            if (res.data.data) {
                setTodos(res.data.data.findTodoByAuthorIndex);
                if (page) {
                    setIDX(tIdx);
                }
            } else {
                setError("There was a problem fetching todo items.");
            }
        })
        .catch(err => {
            setError("There was a problem fetching todo items.");
        })
    };

    const addTodo = (e) => {
        e.preventDefault();
        let content = todoRef.current.value;
        if (content.length) {
            axios({
                url: Constants.GRAPHQL_ENDPOINT,
                method: "post",
                headers: {...Constants.HEADERS, Authorization: user},
                data: { "operationName": "createTodo",
                        "query": 
                            `mutation createTodo($input: String!){
                                createTodo(input: $input) {
                                    todo {
                                        item
                                        completed
                                        _id
                                    }
                                }
                        }`,
                        "variables": {input: content },
                    }
            })
            .then(res => {
                if (res.data.data) {
                    if (selected && dueDate) {
                        let tID = res.data.data.createTodo.todo._id;
                        let now = new Date().getTime();
                        let dif =  dueDate - now;
                        if (Math.floor(dif / 60000) >= 10) {
                            axios({
                                url: Constants.GRAPHQL_ENDPOINT,
                                method: "post",
                                headers: {...Constants.HEADERS, Authorization: user},
                                data: { "operationName": "setDueDate",
                                        "query": 
                                        `mutation setDueDate($input: UpdateTodoInput!){
                                            setDueDate(input: $input) {
                                                item
                                                completed
                                                _id
                                            }
                                        }`,
                                        "variables": {'input': {id: tID, dueDate}},
                                    }
                            })
                            .then(res => {
                                if (!res.data.data) {
                                    setError("Adding todo without deadline: Could not set a deadline for the todo.");
                                }
                            })
                            .catch(error => {
                                setError("Adding todo without deadline: Could not set a deadline for new todo.");
                            })
                        } else {
                            setError("Adding todo without deadline: Deadline must be at least 10 minutes from now.");
                        }
                    }
                    setCount(prevC => prevC + 1);
                    getTodos(idx);
                    setSelected(false);
                    todoRef.current.value = '';
                } else {
                    if (res.data.errors[0].message === "Unauthorized") {
                        setError("You are not authorized to complete this action. Please sign out and sign in again.");
                    } else if (res.data.errors[0].message === "Bad Request Exception") {
                        setError("Could not add new todo. Make sure your input only consists of alphanumeric characters.");
                    } else {
                        setError("Could not add new todo. Try again later.");
                    }
                }
            })
            .catch(error => {
                setError("Could not add new todo. Check that your input only consists of alphanumeric characters, or try again later.");
            });
        } else {
            setError("Write a todo!");
        } 
    };

    const deleteTodo = (tID) => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: {...Constants.HEADERS, Authorization: user},
            data: { "operationName": "deleteTodo",
                    "query": 
                      `mutation deleteTodo($input: String!){
                        deleteTodo(id: $input) 
                      }`,
                    "variables": {'input': tID},
                  }
          })
          .then(res => {
            if (res.data.data) {
                setCount(prevCount => prevCount - 1);
                if (todos.length == 1 && idx > 0) {
                    changePage(1);
                } else {
                    getTodos(idx);
                }
            } else {
                if (res.data.errors[0].message === "Unauthorized") {
                    setError("You are not authorized to complete this action. Please sign out and sign in again.");
                } else {
                    setError("Could not delete todo. Try again later.");
                }
            }
        })
        .catch(error => {
            setError("Could not delete todo. Try again later.");
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
                      `mutation completeTodo($input: String!){
                        completeTodo(id: $input) {
                            item
                        }
                      }`,
                    "variables": {'input': tID},
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
                    setError("Could not mark todo as complete. Try again later.");
                }
            }
        })
        .catch(error => {
            setError("Could not mark todo as complete. Try again later.");
        }); 
    };

    const setIncomplete = (tID, tIdx) => {
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: {...Constants.HEADERS, Authorization: user},
            data: { "operationName": "incompleteTodo",
                    "query": 
                      `mutation incompleteTodo($input: String!){
                        incompleteTodo(id: $input) {
                            item
                        }
                      }`,
                    "variables": {'input': tID},
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
                    setError("Could not mark todo as incomplete. Try again later.");
                }
            }
        })
        .catch(error => {
            setError("Could not mark todo as incomplete. Try again later.");
        }); 
    };
    
    const theme = createTheme({
        typography: {
            fontFamily: 'Noto',
            fontSize: 16,
            button: {
                textTransform: 'none',
                fontSize: 20,
            }
        },
        palette: {
            borderColor: '#D7B19D',
            test: {
                light: '#6B4F4F',
                main: '#483434',
                dark: '#483434',
                contrastText: '#D7B19D',
            },
        },
    });

    return (
        <div className="agenda-page">
            {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}

            <div className="agenda-slogan">
                {name}, what do you need to do today?
            </div>

            <div className="agenda-todo">
                <form className="todo-form" onSubmit={(e) => addTodo(e)}>
                <ThemeProvider theme={theme}>
                <div className="deadline">
                <StyledTextField className="TextField" label="New Todo" variant="outlined" inputRef={todoRef} fullWidth sx={{ width: 4/8 }} />
                <ToggleButton 
                    value="check"
                    selected={selected}
                    onChange={() => {
                        setSelected(!selected);
                    }}
                    sx={{ width: 3/8 }} 
                >
                Set a deadline
                </ToggleButton> 
                <Button color="test" className="Button" type="submit" variant="contained" disableElevation sx={{ width: 1/8 }} >Add</Button>
                </div>

                {selected ? 
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DateTimePicker
                            label="Deadline"
                            value={dueDate}
                            onChange={handleDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider> : ''}
                </ThemeProvider>
                </form>
            </div>

            <div className="agenda-list">
                <div className="agenda-list__title">
                    Your Todo List
                </div>
                
                <div className="todo-list">
                {loading ? <CircularProgress color="inherit"/> : <>
                    {count ? 
                        <div className="todo-section">
                            {(idx + 1) * 10 < count ? <div className="previous-ap" onClick={() => changePage(0)}> <NavigateBeforeIcon style={{ fontSize: 80 }}/></div> : <div className="prev-spacing-ap"></div>}
                            <div className="todos">
                                {todos.map((todo, tIdx) => 
                                    <div className="todo-item" key={todo._id}>
                                        <Checkbox
                                            checked={todo.completed}
                                            onChange={(e) => handleChange(e, todo._id, tIdx)}
                                            style ={{
                                                color: "#6B4F4F",
                                            }}
                                        />
                                        <div className="todo">{todo.item}</div>
                                        <div className="delete" onClick={() => deleteTodo(todo._id)}></div>  
                                    </div>
                                )} 
                            </div>
                            {idx !== 0 ? <div className="next-ap" onClick={() => changePage(1)} ><NavigateNextIcon style={{ fontSize: 80 }}/></div> : <div className="next-spacing-ap"></div>}
                        </div>
                    : 'No todos'}
                    </>}
                </div>
            </div>
        </div>
    );
};