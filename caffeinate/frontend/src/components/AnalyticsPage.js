import '../styling/AnalyticsPage.css';
import axios from "axios";
import * as Constants from '../constants';
import { Line, Doughnut} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';
import ErrorMessage from './ErrorMessage';
import CircularProgress from '@mui/material/CircularProgress';

// tutorial on using Chart.js and Word Cloud from https://react-chartjs-2.js.org/examples/line-chart https://react-chartjs-2.js.org/examples/doughnut-chart https://react-wordcloud.netlify.app/readme 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
  
export default function AnalyticsPage(props) {
    const { user } = props;
    const [ratingsNum, setRatingsNum] = useState(0);
    const [ratingLabels, setRatingLabels] = useState([]);
    const [ratingData, setRatingData] = useState([]);
    const [sentimentData, setSentimentData] = useState([]);
    const [words, setWords] = useState([]);
    const [error, setError] = useState('');
    const [donutLoading, setDonutLoading] = useState(true);    
    const [lineLoading, setLineLoading] = useState(true);    
    const [cloudLoading, setCloudLoading] = useState(true);  
    const sentimentLabels = ["very happy", "happy", "neutral", "disappointed", "angry"];  

    useEffect(() => {
        axios({
          url: Constants.GRAPHQL_ENDPOINT,
          method: "post",
          headers: {...Constants.HEADERS, Authorization: user},
          data: { "operationName": "find30RatesByAuthor",
                  "query": 
                    `query find30RatesByAuthor {
                        find30RatesByAuthor {
                        rate
                        date
                      }
                    }`,
                }
        })
        .then(res => {
          if (res.data.data) {
            setRatingsNum(res.data.data.find30RatesByAuthor.length);
            setRatingData(res.data.data.find30RatesByAuthor.map(elem => elem.rate).reverse());
            setRatingLabels(res.data.data.find30RatesByAuthor.map(elem => new Date(elem.date).toDateString().split(' ')[1] + ' ' + new Date(elem.date).toDateString().split(' ')[2]).reverse());
            setLineLoading(false);
          } else {
            if (res.data.errors[0].message === "Unauthorized") {
              setError("You are not authorized. Please sign out and sign in again.");
            } else {
              setError("There was a problem fetching survey data.");
            }
          }
        })
        .catch(error => {
          setError("There was a problem fetching survey data.");
        });  

    }, []);

    useEffect(() => {
      axios({
        url: Constants.GRAPHQL_ENDPOINT,
        method: "post",
        headers: {...Constants.HEADERS, Authorization: user},
        data: { "operationName": "findJournalDictByAuthor",
                "query": 
                  `query findJournalDictByAuthor {
                    findJournalDictByAuthor {
                      text
                      value
                    }
                  }`,
              }
      })
      .then(res => {
        if (res.data.data) {
          setWords(res.data.data.findJournalDictByAuthor);
          setCloudLoading(false);
        } else {
          if (res.data.errors[0].message === "Unauthorized") {
            setError("You are not authorized. Please sign out and sign in again.");
          } else {
            setError("There was a problem fetching journal data.");
          }
        }
      })
      .catch(error => {
        setError("There was a problem fetching journal data.");
      });  
    }, []);

    useEffect(() => {
      axios({
        url: Constants.GRAPHQL_ENDPOINT,
        method: "post",
        headers: {...Constants.HEADERS, Authorization: user},
        data: { "operationName": "find30SentimentsByAuthor",
                "query": 
                  `query find30SentimentsByAuthor {
                    find30SentimentsByAuthor
                  }`,
              }
      })
      .then(res => {
        if (res.data.data) {
          if (res.data.data.find30SentimentsByAuthor.filter(freq => freq > 0).length) {
            setSentimentData(res.data.data.find30SentimentsByAuthor);
          }
          setDonutLoading(false);
        } else {
          if (res.data.errors[0].message === "Unauthorized") {
            setError("You are not authorized. Please sign out and sign in again.");
          } else {
            setError("There was a problem fetching sentiment data.");
          }
        }
      })
      .catch(error => {
        setError("There was a problem fetching sentiment data.");
      });  
    }, []);

  
    const ratingOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Survey Ratings (showing last ' + ratingsNum + ')',
          color: "#AD8B73",
          font: {
            size: 17
          }
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
          y: {
            min: 0,
            max: 5.5,
            ticks: {
              stepSize: 1,
            },
            grid: {
              color: '#6B4F4F'
            },
          },
          x: {
              grid: {
                color: '#6B4F4F'
              }
          }
      },
  };

  const sentimentSetup = {
    labels: sentimentLabels,
    datasets: [
      {
        data: sentimentData,
        backgroundColor: [
          'rgba(38, 27, 27, 0.2)',
          'rgba(120, 76, 76, 0.2)',
          'rgba(107, 79, 79, 0.2)',
          'rgba(238, 214, 196, 0.2)',
          'rgba(255, 243, 228, 0.2)'
        ],
        borderColor: [
          'rgba(38, 27, 27, 1)',
          'rgba(120, 76, 76, 1)',
          'rgba(107, 79, 79, 1)',
          'rgba(238, 214, 196, 1)',
          'rgba(255, 243, 228, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const ratingSetup = {
      labels: ratingLabels,
      datasets: [{
          label: 'Rating',
          data: ratingData,
          borderColor: '#D7B19D',
          backgroundColor: '#865439',
      }],
  };
  
  const wordOptions = {
    colors: ['#AD8B73', '#CEAB93', '#E3CAA5', '#FFFBE9'],
    fontFamily: 'Krub',
    fontSizes: [20, 60],
  }
  
  return (
      <div className="analytics">
          {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}
          
          <div className="analytics-title">
              My Analytics
          </div>
          
          <div className="journal-section">
            <h2 className="analytics-subsection">Your Journal</h2>
            <div className="journal-section_sub">
              Journal Word Cloud
              {cloudLoading ?  <CircularProgress color="inherit"/> : <>
              {words.length ? <><p>Note: Words greater than 20 characters will not appear in the word cloud.</p><ReactWordcloud words={words} options={wordOptions}/></> : <div>No data to show.</div> }
              </>}
            </div>

            <div className="journal-section_sub">
              Sentiment Breakdown of Last 30 Entries
              {donutLoading ?  <CircularProgress color="inherit"/> : <div className="donut">
              {sentimentData.length ? <Doughnut data={sentimentSetup} /> : <div>No data to show.</div> }
              </div>}
            </div>
          </div>

          <div className="survey-section">
              <h2 className="analytics-subsection">Your Surveys</h2>
              <div className="survey-section_sub">
                {lineLoading ?  <CircularProgress color="inherit"/> : <>
                {ratingsNum ? <Line data={ratingSetup} options={ratingOptions}/> : <div>No data to show.</div> }
                </>}
              </div>

          </div>
      </div>
  );
};

