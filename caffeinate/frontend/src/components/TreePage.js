import '../styling/TreePage.css';
import { useEffect, useState } from "react";
import axios from "axios";
import * as Constants from '../constants'

export default function Tree() {
  // const treeStatus = parseInt(sessionStorage.getItem('treeStatus')[0]);
  const treeStatus = 0;
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(treeStatus);
    const status = ['Your tree is underdeveloped. Start submitting postively rated surveys so it can start growing.', 
      'Your tree has started growing. The more positive days you have, the faster it will grow.', 
      'Your tree is feeling the love and all the positivity from your surveys. Keep up the positive, happy days!',
      'Your tree is flourishing! Your tree thanks you for your amazing positivity ❤️'];

    
    if (treeStatus === 0) {
      setMessage(status[0]);
    } else if (treeStatus === 1) {
      setMessage(status[1]);
    } else if (treeStatus === 2) {
      setMessage(status[2]);
    } else {
      setMessage(status[3]);
    }
  }, [treeStatus]);

  function showTreeImage(stage) {
    if (treeStatus === 0) {
      return (<div className="image" id="stage-zero"></div>);
    } else if (treeStatus === 1) {
      return (<div className="image" id="stage-one"></div>);
    } else if (treeStatus === 2) {
      return (<div className="image" id="stage-two"></div>);
    } else {
      return (<div className="image" id="stage-three"></div>);
    }
  }

  return (
    <div className="tree-page">
      <div className="tree-image">
        {showTreeImage(treeStatus)}
      </div>
      <div className="tree-message">
        <h1 className="message" id={`message-${treeStatus}`}>{message}</h1>
      </div>
    </div>
  );
};