import '../styling/JournalPage.css';
import { useState } from "react";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

export default function JournalPage() {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toUTCString());
  const [viewMode, setViewMode] = useState(0);
  const [currentJournalEntry, setCurrentJournalEntry] = useState({'date': 'Sun, 13 Mar 2022 04:36:00 GMT', 'content': 'sdfdfdfdff\ndfd\ndfdfdf'});

  const editContent = (e) => {
    setContent(e.target.value);
  };

  const resetContent = () => {
    setContent("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content) {
      alert("Write something first!");
    } else {
      setDate(new Date().toUTCString());
      console.log(content);
      resetContent();
    }
  };

  return (
    <div className="journal">
      {!viewMode ? (
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
          <div className="previous"> <NavigateBeforeIcon style={{ fontSize: 80 }}/></div>
          <div className="journal-paper">
            <div className="paper-lines">
              <p className="date">{currentJournalEntry.date}</p>
              <div className="journal-entry">{currentJournalEntry.content.split('\n').map(str => <p key={Math.random()}>{str}</p>)}</div>
            </div>
          </div>
          <div className="next"><NavigateNextIcon style={{ fontSize: 80 }}/></div>
          <div className="journal-settings" onClick={() => setViewMode(0)}>
            Write a journal entry
          </div>
        </div>
      )}
    </div>
  );
};