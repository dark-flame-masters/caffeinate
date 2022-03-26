import '../styling/AnalyticsPage.css';
import axios from "axios";
import * as Constants from '../constants';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
  
export default function AnalyticsPage(props) {
    const { user } = props;
    const [ratingsNum, setRatingsNum] = useState(0);
    const [ratingLabels, setRatingLabels] = useState([]);
    const [ratingData, setRatingData] = useState([]);
    const [words, setWords] = useState([]);
    
    useEffect(() => {
        axios({
          url: Constants.GRAPHQL_ENDPOINT,
          method: "post",
          headers: Constants.HEADERS,
          data: { "operationName": "find30RatesByAuthor",
                  "query": 
                    `query find30RatesByAuthor($input: String!){
                        find30RatesByAuthor(input: $input){
                        rate
                        date
                      }
                    }`,
                  "variables": {'input': user},
                }
        })
        .then(res => {
          console.log(res.data);
          console.log(res.data.data.find30RatesByAuthor);
          setRatingsNum(res.data.data.find30RatesByAuthor.length);
          setRatingData(res.data.data.find30RatesByAuthor.map(elem => elem.rate).reverse());
          setRatingLabels(res.data.data.find30RatesByAuthor.map(elem => new Date(elem.date).toDateString().split(' ')[1] + ' ' + new Date(elem.date).toDateString().split(' ')[2]).reverse());
        })
        .catch(error => {
          console.log(error);
        });  

    }, []);

    useEffect(() => {
      axios({
        url: Constants.GRAPHQL_ENDPOINT,
        method: "post",
        headers: Constants.HEADERS,
        data: { "operationName": "findJournalDictByAuthor",
                "query": 
                  `query findJournalDictByAuthor($input: String!){
                    findJournalDictByAuthor(input: $input){
                      text
                      value
                    }
                  }`,
                "variables": {'input': user},
              }
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
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
          text: 'Survey ratings (showing last ' + ratingsNum + ')',
          color: "#AD8B73",
          font: {
              size: 17
          }
        },
      },
      legend: {
          labels: {
              fontColor: 'orange'
          }
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
  }
  
  return (
      <div className="analytics">
          <div className="analytics-title">
              My Analytics
          </div>
          <div className="journal-section">
            <h2 className="analytics-subsection">Your Journal</h2>

            <div className="journal-section_sub">
              {words.length ? <ReactWordcloud words={words} options={wordOptions}/> : <div>No data to show.</div> }
                  bar graph
              </div>
          </div>

          <div className="survey-section">
              <h2 className="analytics-subsection">Your Surveys</h2>
              <div className="survey-section_sub">
                  {ratingsNum ? <Line data={ratingSetup} options={ratingOptions}/> : <div>No data to show.</div> }
              </div>

          </div>
      </div>
  );
};

