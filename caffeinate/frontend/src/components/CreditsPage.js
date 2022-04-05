import '../styling/CreditsPage.css';
import React from 'react';

export default function CreditsPage() {
    return (
        <div className="credits">
            <h1>Caffeinate</h1>
            <h2>Made by: Yara Radwan, Meixuan Lu, Jan Garong</h2>
            <h2>Tech Stack:</h2>
            <ul>
                <li>Frontend: React.js</li>
                <li>Backend: Nest.js using GraphQL</li>
                <li>Database: MongoDB</li>
            </ul>

            <h2>Credits:</h2>
            <ul>
<<<<<<< HEAD
                <li>material ui</li>
                <li>freepik/flaticon https://www.flaticon.com/premium-icon/coffee_2465580?term=coffee&related_id=2465580</li>
                <li>https://stackoverflow.com/questions/52911169/how-to-change-the-border-color-of-mui-textfield</li>
                <li>https://www.codesdope.com/blog/article/getting-notebook-paper-effect-with-css/, https://codepen.io/magnificode/pen/rQpaBO</li>
                <li>https://forum.freecodecamp.org/t/newline-in-react-string-solved/68484</li>
                <li>https://react-chartjs-2.js.org/examples/line-chart</li>
                <li>https://react-wordcloud.netlify.app/props</li>
                <li>https://www.flaticon.com/free-icon/cancel_271203?k=1648786945015</li>
                <li>https://react-chartjs-2.js.org/examples/doughnut-chart</li>
                <li>https://www.flaticon.com/premium-icon/play_666173?term=play&page=1&position=19&page=1&position=19&related_id=666173&origin=search</li>
                <li>https://www.flaticon.com/free-icon/pause_709691?term=pause&page=1&position=11&page=1&position=11&related_id=709691&origin=search</li>
                <li>https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate</li>
                <li>https://github.com/thangngoc89/react-howler/blob/master/examples/react/src/players/OnlyPlayPauseButton.js</li>
                <li>https://www.youtube.com/watch?v=917TAjUpTxY</li>
                <li>https://graphql.org/learn/</li>
                <li>https://www.youtube.com/watch?v=XPSSgAPjTb4</li>
                <li>https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date</li>
                <li>https://regexr.com/</li>
                <li>https://blog.logrocket.com/sentiment-analysis-node-js/</li>
                <li>https://docs.nestjs.com/techniques/task-scheduling</li>
                <li>https://nodemailer.com/about/</li>
                <li>https://mongoosejs.com/docs/guide.html</li>
                <li>SSL setup with Docker, Nginx and Certbot: https://www.programonaut.com/setup-ssl-with-docker-nginx-and-lets-encrypt/</li>
                <li>NestJS Documentation: https://docs.nestjs.com/</li>
                <li>Google Identity API Documentation: https://developers.google.com/identity</li>
                <li>Dockerizing a React App: https://mherman.org/blog/dockerizing-a-react-app/</li>
                <li>NestJS Starter Dockerfile: https://github.com/marcson909/nest_js_docker_starter/blob/main/Dockerfile</li>
                <li>Bcrypt fix for Dockerfile: https://stackoverflow.com/questions/69884391/docker-alpine-unable-to-select-packages-python-no-such-package-while-buildin</li>
=======
                <li>Several components (Button, DateTimePicker, Checkbox, NavigateBeforeIcon, NavigateNextIcon, CircularProgress, ThemeProvider, LocalizationProvider) was taken from the free version of <a href="https://mui.com/">Material UI</a>, which is free to use under its MIT license</li>
                <li>The following icons were taken from from <a href="http://www.flaticon.com" title="Flaticon">Flaticon</a> which is licensed under the <a href="https://www.freepikcompany.com/legal#nav-flaticon">Flaticon License</a>
                    <ul>
                        <li><a href="https://www.flaticon.com/premium-icon/coffee_2465580?term=coffee&related_id=2465580">Coffee icon</a> (from Freepik)</li>
                        <li><a href="https://www.flaticon.com/premium-icon/play_666173?term=play&page=1&position=19&page=1&position=19&related_id=666173&origin=search">Play icon</a> (from Maxim Basinski Premium - Flaticon)</li>
                        <li><a href="https://www.flaticon.com/free-icon/pause_709691?term=pause&page=1&position=11&page=1&position=11&related_id=709691&origin=search">Pause icon</a> (from Kiranshastry - Flaticon)</li>
                        <li><a href="https://www.flaticon.com/free-icon/cancel_271203?k=1648786945015">Cancel/Close icon</a> (from Roundicons - Flaticon)</li>
                    </ul>
                </li>
                <li>We used <a href="https://www.chartjs.org/">Chart.js</a>(specifically <a href="https://react-chartjs-2.js.org">React-Chart.js</a>) for the Line and Doughnut graphs in Analytics
                    <ul>
                        <li>We followed the React-Chart.js tutorial for <a href="https://react-chartjs-2.js.org/examples/line-chart">Line charts</a> and <a href="https://react-chartjs-2.js.org/examples/doughnut-chart">Doughnut charts</a> in creating our graphs</li>
                    </ul>
                </li>
                <li>We used <a href="https://react-wordcloud.netlify.app/">React Word Cloud</a> (and its <a href="https://react-wordcloud.netlify.app/readme">readme</a>) for our Word Cloud in Analytics</li>
                <li>We used the following StackOverflow posts to help with our code solutions:
                    <ul>
                        <li>https://stackoverflow.com/questions/52911169/how-to-change-the-border-color-of-mui-textfield</li>
                        <li>https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate</li>
                        <li>https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield</li>
                        <li>https://stackoverflow.com/questions/64721126/how-to-style-textfield-in-materialui</li>
                    </ul>
                </li>
                <li>We used <a href="https://www.codesdope.com/blog/article/getting-notebook-paper-effect-with-css/">this tutorial</a> and <a href="https://codepen.io/magnificode/pen/rQpaBO">this public codepen</a> (which is free to use under MIT license) for our journal styling</li>
                <li>We used <a href="https://www.youtube.com/watch?v=917TAjUpTxY">this royalty-free YouTube video</a> for the calming background music in our site</li>
                <li>We used <a href="https://www.npmjs.com/package/react-howler">React-Howler.js</a> and <a href="https://github.com/thangngoc89/react-howler/blob/master/examples/react/src/players/OnlyPlayPauseButton.js">and this example</a> for our background music feature</li>
>>>>>>> frontend-refactor
            </ul>

        </div>
    );
};