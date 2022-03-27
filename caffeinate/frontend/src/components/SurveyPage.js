import { useEffect, useRef, useState } from "react";
import '../styling/SurveyPage.css';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';

export default function SurveyPage(props) {
  const { user } = props;
  const videoRef = useRef(null);

  const [cam, setCam] = useState(true);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const [rating, setRating] = useState(0);
  const [sentiment, setSentiment] = useState('');
  
  const [qOneContent, setQOneContent] = useState('');
  const [qTwoContent, setQTwoContent] = useState('');
  
  const [qOne, setQOne] = useState(0);
  const [qTwo, setQTwo] = useState(0);

  const [view, setView] = useState(0);
  const [idx, setIDX] = useState(0);
  const [count, setCount] = useState(0);

  const [date, setDate] = useState(new Date());
  const [currentSurvey, setCurrentSurvey] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    axios({
      url: Constants.GRAPHQL_ENDPOINT,
      method: "post",
      headers: Constants.HEADERS,
      data: { "operationName": "findUserByName",
              "query": 
                `query findUserByName($input: String!){
                  findUserByName(username: $input){
                    surveyCount
                  }
                }`,
              "variables": {'input': user},
            }
    })
    .then(res => {
      console.log(res.data);
      setCount(res.data.data.findUserByName.surveyCount);
    }).catch(error => {
      setError("There was a problem fetching survey responses.");
    })
  }, []);

  useEffect(() => {
    getSurvey();
  }, [idx]);

  useEffect(() => {
    if (surveyCompleted && currentSurvey) {
      setTimeout(resetSurvey, Math.min(10000, Math.abs(date.getTime() - new Date(currentSurvey.date).getTime())));
    }
  }, [surveyCompleted]);

  useEffect(() => {
    console.log(currentSurvey);
  }, [currentSurvey])

  const resetSurvey = () => {
    setSentiment(null);
    setQOneContent('');
    setQTwoContent('');
    setQOne(0);
    setQTwo(0);
    setRating(0);
    setDate(new Date());
    setSurveyCompleted(false);
  }

  const setViewMode = (viewMode) => {
    getSurvey();
    if (viewMode) {
      if (!Object.keys(currentSurvey).length) {
        alert("No survey entries yet!");
        return;
      }
    } 
    console.log("arrived");
    setIDX(0);
    setView(viewMode);
  }

  const getSurvey = () => {
    console.log(idx);
    axios({
      url: Constants.GRAPHQL_ENDPOINT,
      method: "post",
      headers: Constants.HEADERS,
      data: { "operationName": "findSurveyByAuthorIndex",
              "query": 
                `query findSurveyByAuthorIndex($input: FindSurveyInput!){
                  findSurveyByAuthorIndex(input: $input){
                    rate
                    answer1
                    answer2
                    sentiment
                    author
                    date
                  }
                }`,
              "variables": {'input': {index: idx, author: user}},
            }
    })
    .then(res => {
      console.log(res.data);
      if (res.data.data.findSurveyByAuthorIndex) {
        setCurrentSurvey(res.data.data.findSurveyByAuthorIndex);
        setDate(new Date());
        if (!idx) {
          let time = Math.abs(date.getTime() - new Date(res.data.data.findSurveyByAuthorIndex.date).getTime());
          if (time < 10000) {
            setSurveyCompleted(true);
          } 
        }
      } else {
        if (idx !== 0) setError("You do not have any survey responses to view.");
        setIDX(idx === 0 ? idx : idx => idx - 1);
      }
    })
    .catch(error => {
      setError("There was a problem fetching survey responses.");
    });  
  };

  const submitSurvey = () => {
    if (!qOne || !rating || !qTwo ) {
      console.log("something wrong...");
    } else {
      axios({
        url: Constants.GRAPHQL_ENDPOINT,
        method: "post",
        headers: Constants.HEADERS,
        data: { "operationName": "createSurvey",
                "query": 
                  `mutation createSurvey($input: CreateSurveyInput!){
                    createSurvey(input: $input){
                      user {
                        surveyCount
                      }
                      survey {
                        rate
                        answer1
                        answer2
                        sentiment
                        author
                        date
                      }
                    }
                  }`,
                "variables": {'input': {answer1: qOneContent, answer2: qTwoContent, rate: rating, sentiment: 'happy', author: user}},
              }
      })
      .then(res => {
        console.log(res.data);
        let newSurvey = {'date': res.data.data.createSurvey.survey.date, 'author': res.data.data.createSurvey.survey.author, 
            'rate': res.data.data.createSurvey.survey.rate, 'answer1': res.data.data.createSurvey.survey.answer1, 
            'sentiment': res.data.data.createSurvey.survey.sentiment, 'answer2': res.data.data.createSurvey.survey.answer2};
        setCurrentSurvey(newSurvey);
        setSurveyCompleted(true);
        setCount(res.data.data.createSurvey.user.surveyCount);
        setIDX(0);
      })
      .catch(error => {
        if (error.response.status === 400) {
          setError("Survey response could not be saved. Make sure your entries only contain" +
          "alphanumeric characters and does not include any illegal characters.");
        } else {
          setError("Survey response could not be saved. Try again later.")
        } 
      });  
    }
  }

  const changeSurvey = (direction) => {
    if (direction) {
      setIDX(idx => idx - 1);
    } else {
      setIDX(idx => idx + 1);
    }
  }

  const submitRating = (num) => {
    setRating(num);
  }

  const editContent = (e, q) => {
    if (q) {
      setQOneContent(e.target.value);
    } else {
      setQTwoContent(e.target.value);
    }
  };

  const finishQuestion = (e, q) => {
    e.preventDefault();
    if (q) {
      setQTwo(1);
    } else {
      setQOne(1);
    }
  }

  function showSurveyQuestions(question=1) {
    if (question === 1) {
      return (
        <>
          <div className="question">
            <p className="question_text">How are you feeling today?</p>
            <p className="question_subtext">Rate your day on a scale of 1-5 (1: horrible 5: wonderful)</p>
          </div>
          <div className="rating-buttons">
            {[1,2,3,4,5].map(num => <div key={num} className="rating-button" onClick={() => submitRating(num)}>{num}</div>)}
          </div>
        </>
      );
    } else if (question === 2) {
      return (
        <>
          <div className="question">
            <p className="question_text">What made you feel this way today?</p>
            <p className="question_subtext">Did something influence your mood?</p>
          </div>
          <form className="quesion_form" onSubmit={(e) => finishQuestion(e, 0)}>
            <textarea className="question_entry" onChange={(e) => editContent(e, 0)} required></textarea>
            <button className="question_submit" type="submit">submit</button>
          </form>
        </>
      );
    } else if (question === 3) {
      return (
        <>
          <div className="question">
            <p className="question_text">How are you going to have a better day tomorrow?</p>
            <p className="question_subtext">Write down something you can do to be happier.</p>
          </div>
          <form className="quesion_form" onSubmit={(e) => finishQuestion(e, 1)}>
            <textarea className="question_entry" onChange={(e) => editContent(e, 1)} required></textarea>
            <button className="question_submit" type="submit">submit</button>
          </form>
        </>
      );
    } else if (question === 4) {
      return (
        <>
          <div className="question">
            <p className="question_text">Let your face reflect your true feelings.</p>
            <p className="question_subtext">Let it alllll out.</p>
          </div>

          <div className="submit-survey" onClick={submitSurvey}>
            Finish
          </div>
        </>
      );
    }
  }

  return (
    <div className="survey">
      {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}
      <span className="survey-settings" onClick={() => setViewMode(1)}>Read previous entries</span>
      {surveyCompleted || view ? 
      <>
        <div className="completed-message"> 
          You completed today's survey. Check back in tomorrow for another one.
        </div> 
      </>
      :
        <div className="daily-survey">
          {!rating ? showSurveyQuestions(1): ""}
          {rating && !qOne ? showSurveyQuestions(2) : ""}
          {rating && qOne && !qTwo ? showSurveyQuestions(3) : ""}
          {qTwo && !sentiment ? showSurveyQuestions(4) : ""}
        </div>
      }

      {/* {cam ? (
      <video 
        className="selfie"
        ref={videoRef}
        autoPlay
      /> 
       )
      
      
      : <div>hi</div>} */}
      {/* {expression ? <div> You look {expression} </div>: ( <div> You look ugly </div>)} */}

      {!view ? "" :
        <div className="view-surveys">
          {idx + 1 < count ? <div className="previous" onClick={() => changeSurvey(0)}> <NavigateBeforeIcon style={{ fontSize: 80 }}/></div> : <div className="prev-spacing"></div>}
          <div className="survey-entry">
            <p className="survey-date">{currentSurvey.date}</p>
            <p className="survey-response">I rated this day a {currentSurvey.rate}/5</p>
            <p className="survey-response">I felt this way because: {currentSurvey.answer1}</p>
            <p className="survey-response">I planned to improve the day like the following: {currentSurvey.answer2}</p>
            <p className="survey-response">On that day, I looked: {currentSurvey.sentiment}</p>
          </div>
          {idx !== 0 ? <div className="next" onClick={() => changeSurvey(1)} ><NavigateNextIcon style={{ fontSize: 80 }}/></div> : <div className="next-spacing"></div>}
        </div>
      }
    </div>
  );
};