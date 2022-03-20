import '../styling/JournalPage.css';
import { useState, useEffect } from "react";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axios from "axios";
import * as Constants from '../constants'

export default function JournalPage(props) {
  const { user } = props;
  const [content, setContent] = useState("");
  const [date, setDate] = useState(Date());
  const [view, setView] = useState(0);
  const [idx, setIDX] = useState(0);
  const [currentJournalEntry, setCurrentJournalEntry] = useState({'date': '2022-03-20T02:15:48.323Z', 'content': 'hi', 'author': user});

  useEffect(() => {
    getJournal();
  }, [idx]);

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
      console.log(res.data);
      setCurrentJournalEntry(res.data.data.findJournalByAuthorIndex);
    })
    .catch(error => {
      alert(idx === 0 ? "No journal entries yet...": "Reached beginning of journal!");
      setIDX(idx === 0 ? idx : idx => idx - 1);
    });  
  };

  const changeJournal = (direction) => {
    console.log(idx);
    if (direction) {
      setIDX(idx => idx - 1);
    } else {
      setIDX(idx => idx + 1);
    }
    console.log(idx);
  }

  const setViewMode = (viewMode) => {
    if (viewMode) {
      getJournal();
    } else {
      setIDX(0);
    }
    setView(viewMode);
  }

  const editContent = (e) => {
    setContent(e.target.value);
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
                    content
                    author
                    date
                  }
                }`,
              "variables": {'input': {content, author: user}},
            }
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      alert("Error saving journal entry");
    });  
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content) {
      alert("Write something first!");
    } else {
      addJournal();
      setDate(Date());
      console.log(content);
      resetContent();
    }
  };

  return (
    <div className="journal">
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
          
          </div>
        </> ) : (
        <div className="view-journals">
          <div className="previous" onClick={() => changeJournal(0)}> <NavigateBeforeIcon style={{ fontSize: 80 }}/></div>
          <div className="journal-paper">
            <div className="paper-lines">
              <p className="date">{Date(currentJournalEntry.date)}</p>
              <div className="journal-entry">{currentJournalEntry.content.split('\n').map(str => <p key={Math.random()}>{str}</p>)}</div>
            </div>
          </div>
          {idx !== 0 ? <div className="next" onClick={() => changeJournal(1)} ><NavigateNextIcon style={{ fontSize: 80 }}/></div> : <div className="spacing"></div>}
          <div className="journal-settings" onClick={() => setViewMode(0)}>
            Write a journal entry
          </div>
        </div>
      )}
    </div>
  );
};