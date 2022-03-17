import { useEffect, useRef, useState } from "react";
import '../styling/SurveyPage.css';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as faceapi from 'face-api.js';

export default function SurveyPage() {
  const videoRef = useRef(null);
  const qOneRef = useRef(null);
  const qTwoRef = useRef(null);

  const [cam, setCam] = useState(true);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [viewMode, setViewMode] = useState(0);

  const [date, setDate] = useState(new Date().toUTCString());
  const [rating, setRating] = useState(0);
  const [expression, setExpression] = useState(null);
  const [qOne, setQOne] = useState('');
  const [qTwo, setQTwo] = useState('');

  const submitSurvey = () => {
    setExpression('happy');
    if (!expression || !qOne || !rating || !qTwo) {
      console.log("something wrong...");
    }
    setSurveyCompleted(true);
  }

  const submitRating = (num) => {
    console.log("click")
    setRating(num);
  }

  const submitQOne = (e) => {
    e.preventDefault();
    console.log("click")
    setQOne(1);
  }

  const submitQTwo = (e) => {
    e.preventDefault();
    setQTwo(1);
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
          <form className="quesion_form" onSubmit={submitQOne}>
            <textarea className="question_entry" ref={qOneRef} required></textarea>
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
          <form className="quesion_form" onSubmit={submitQTwo}>
            <textarea className="question_entry" ref={qTwoRef} required></textarea>
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
      {surveyCompleted ? 
      <>
        <div className="completed-message"> 
          You completed today's survey. Check back in tomorrow for another one. <span className="survey-settings" onClick={() => setViewMode(1)}>Read previous entries</span>
        </div> 
      </>
      :
        <div className="daily-survey">
          {!rating ? showSurveyQuestions(1): ""}
          {rating && !qOne ? showSurveyQuestions(2) : ""}
          {rating && qOne && !qTwo ? showSurveyQuestions(3) : ""}
          {qTwo && !expression ? showSurveyQuestions(4) : ""}
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

      {!viewMode ? "" :
      <div className="view-surveys">
        <div className="previous"> <NavigateBeforeIcon style={{ fontSize: 80 }}/></div>
        <div className="survey-entry">
          I rated -date- as: number
          I felt this way because: q1
          I was going to improve that day as following: q2
          I looked: impression
        </div>
        <div className="next"> <NavigateNextIcon style={{ fontSize: 80 }}/></div>
      </div>
      }
    </div>
  );
};