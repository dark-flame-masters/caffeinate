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
  const [count, setCount] = useState(0);
  const [currentJournalEntry, setCurrentJournalEntry] = useState({});
  console.log('render');
  console.log(count);

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
      console.log(res.data);
      setCount(res.data.data.findUserByName.journalCount);
    }).catch(error => {
      console.log(error);
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
      console.log(res.data);
      if (res.data.data.findJournalByAuthorIndex) {
        setCurrentJournalEntry(res.data.data.findJournalByAuthorIndex);
      } else {
        if (idx !== 0) alert( "Reached beginning of journal!");
        setIDX(idx === 0 ? idx : idx => idx - 1);
      }
    })
    .catch(error => {
      console.log(error);
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
    getJournal();
    console.log(currentJournalEntry);
    if (viewMode) {
      if (!Object.keys(currentJournalEntry).length) {
        console.log("h");
        alert("No journal entries yet!");
        return;
      }
    } 
    console.log("arrived");
    setIDX(0);
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
      console.log(res.data);
      let newJournal = {'date': res.data.data.createJournal.journal.date, 'author': res.data.data.createJournal.journal.author, 'content': res.data.data.createJournal.journal.content};
      setCurrentJournalEntry(newJournal);
      setIDX(0);
      setCount(res.data.data.createJournal.user.journalCount);
      resetContent();
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