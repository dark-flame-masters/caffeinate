import '../styling/TreePage.css';
import { useEffect, useState } from "react";
import axios from "axios";
import * as Constants from '../constants'

export default function TreePage(props) {
  const { user } = props;
  const [treeStatus, setTreeStatus] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(treeStatus);
    const status = ['Your tree is underdeveloped. Start submitting postively rated surveys so it can start growing.', 
    'Your tree has started growing. The more positive days you have, the faster it will grow.', 
    'Your tree is feeling the love and all the positivity from your surveys. Keep up the positive, happy days!',
    'Your tree is flourishing! Your tree thanks you for your amazing positivity ❤️'];
    axios({
      url: Constants.GRAPHQL_ENDPOINT,
      method: "post",
      headers: Constants.HEADERS,
      data: { "operationName": "findUserByName",
              "query": 
                `query findUserByName($input: String!){
                  findUserByName(username: $input){
                    treeStatus
                  }
                }`,
              "variables": {'input': user},
            }
    })
    .then(res => {
      console.log(res.data);
      setTreeStatus(res.data.data.findUserByName.treeStatus);
      if (res.data.data.findUserByName.treeStatus === 0) {
        setMessage(status[0]);
      } else if (res.data.data.findUserByName.treeStatus === 1) {
        setMessage(status[1]);
      } else if (res.data.data.findUserByName.treeStatus === 2) {
        setMessage(status[2]);
      } else {
        setMessage(status[3]);
      }
    }).catch(error => {
      console.log(error);
    })
  }, []);

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