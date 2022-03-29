import '../styling/JournalPage.css';
import { useState, useEffect } from "react";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axios from "axios";
import * as Constants from '../constants'
import ErrorMessage from './ErrorMessage';

export default function JournalPage(props) {
  const { user } = props;
  const [content, setContent] = useState("");
  const [date, setDate] = useState(Date());
  const [view, setView] = useState(0);
  const [idx, setIDX] = useState(0);
  const [count, setCount] = useState(0);
  const [currentJournalEntry, setCurrentJournalEntry] = useState({});
  const [error, setError] = useState('');
  const emojis = ['😁', '🙂', '😕', '😞', '😭', '😡'];

  useEffect(() => {
    axios({
      url: Constants.GRAPHQL_ENDPOINT,
      method: "post",
      headers: Constants.HEADERS,
      data: { "operationName": "findUserByName",
              "query": 
                `query findUserByName($input: String!){
                  findUserByName(username: $input){
                    journalCount
                  }
                }`,
              "variables": {'input': user},
            }
    })
    .then(res => {
      if (res.data.data) {
        setCount(res.data.data.findUserByName.journalCount);
      } else {
        if (res.data.errors[0].message === "Unauthorized") {
          setError("You are not authorized. Please sign out and sign in again.");
        } else {
          setError("There was a problem fetching journal entries.");
        }
      }
    }).catch(error => {
      setError("There was a problem fetching journal entries.");
    })
  }, []);

  useEffect(() => {
    getJournal();
  }, [idx]);

  useEffect(() => {
    console.log(currentJournalEntry);
  }, [currentJournalEntry])

  const getJournal = () => {
    console.log(idx);
    axios({
      url: Constants.GRAPHQL_ENDPOINT,
      method: "post",
      headers: Constants.HEADERS,
      data: { "operationName": "findJournalByAuthorIndex",
              "query": 
                `query findJournalByAuthorIndex($input: FindJournalInput!){
                  findJournalByAuthorIndex(input: $input){
                    content
                    author
                    date
                  }
                }`,
              "variables": {'input': {index: idx, author: user}},
            }
    })
    .then(res => {
      if (res.data.data) {
        if (res.data.data.findJournalByAuthorIndex) {
          setCurrentJournalEntry(res.data.data.findJournalByAuthorIndex);
        } else {
          if (idx !== 0) setError("You do not have any journal entries to view.");
          setIDX(idx === 0 ? idx : idx => idx - 1);
        }
      } else {
        if (res.data.errors[0].message === "Unauthorized") {
          setError("You are not authorized. Please sign out and sign in again.");
        } else {
          setError("There was a problem fetching journal entries.");
        }
      }
    })
    .catch(error => {
      setError("There was a problem fetching journal entries.");
    });  
  };

  const changeJournal = (direction) => {
    if (direction) {
      setIDX(idx => idx - 1);
    } else {
      setIDX(idx => idx + 1);
    }
    console.log(idx);
  }

  const setViewMode = (viewMode) => {
    getJournal();
    if (viewMode) {
      if (!Object.keys(currentJournalEntry).length) {
        setError("You do not have any journal entries to view.");
        return;
      }
    } 
    setIDX(0);
    setView(viewMode);
  }

  const editContent = (e) => {
    setContent(e.target.value);
  };

  const addEmoji = (emoji) => {
    setContent(prevContent => prevContent + emoji);
  };

  const resetContent = () => {
    setContent("");
  };

  const addJournal = () => {
    axios({
      url: Constants.GRAPHQL_ENDPOINT,
      method: "post",
      headers: Constants.HEADERS,
      data: { "operationName": "createJournal",
              "query": 
                `mutation createJournal($input: CreateJournalInput!){
                  createJournal(input: $input){
                    user {
                      journalCount
                    }
                    journal {
                      content
                      author
                      date
                    }
                  }
                }`,
              "variables": {'input': {content, author: user}},
            }
    })
    .then(res => {
      if (res.data.data) {
        let newJournal = {'date': res.data.data.createJournal.journal.date, 'author': res.data.data.createJournal.journal.author, 'content': res.data.data.createJournal.journal.content};
        setCurrentJournalEntry(newJournal);
        setIDX(0);
        setCount(res.data.data.createJournal.user.journalCount);
        resetContent();
      } else {
        if (res.data.errors[0].message === "Bad Request Exception") {
          setError("Journal entry could not be saved. Make sure your entry only contains" +
          " alphanumeric characters and does not include any illegal characters or emojis.");
        } else if (res.data.errors[0].message === "Unauthorized") {
          setError("You are not authorized to complete this action. Please sign out and sign in again.");
        } else {
          setError("Journal entry could not be saved. Try again later.")
        }
      }
    })
    .catch(error => {
      setError("Journal entry could not be saved. Try again later.")
    });  
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content) {
      setError("You must write something before your entry can be saved.");
    } else {
      addJournal();
      setDate(Date());
    }
  };

  return (
    <div className="journal">
      {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}
      {!view ? (
        <>
          <div className="paper">
            <div className="paper-lines">
              <p className="date">{date}</p>
              <textarea className="entry" onChange={(e) => editContent(e)} placeholder="Write what's on your mind..." value={content}/>
            </div>
          </div>
        
          <div className="settings-area">
            <div className="settings" onClick={handleSubmit}>
              Save entry
            </div>

            <div className="settings" onClick={() => setViewMode(1)}>
              Read previous entries
            </div>

            <div className="emoji-section">
              {emojis.map((emoji) => <button key={Math.random()} onClick={() => addEmoji(emoji)} className="emoji">{emoji}</button>)}
            </div>
          
          </div>
        </> ) : (
        <div className="view-journals">
          {idx + 1 < count ? <div className="previous" onClick={() => changeJournal(0)}> <NavigateBeforeIcon style={{ fontSize: 80 }}/></div> : <div className="prev-spacing"></div>}
          <div className="journal-paper">
            <div className="paper-lines">
              <p className="date">{Date(currentJournalEntry.date)}</p>
              <div className="journal-entry">{currentJournalEntry.content.split('\n').map(str => <p key={Math.random()}>{str}</p>)}</div>
            </div>
          </div>
          {idx !== 0 ? <div className="next" onClick={() => changeJournal(1)} ><NavigateNextIcon style={{ fontSize: 80 }}/></div> : <div className="next-spacing"></div>}
          <div className="journal-settings" onClick={() => setViewMode(0)}>
            Write a journal entry
          </div>
        </div>
      )}
    </div>
  );
};