import '../styling/CreditsPage.css';

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
                <li>Design platform: Figma</li>
            </ul>

            <h2>Credits:</h2>
            <ul>
                <li>material ui</li>
                <li>freepik/flaticon https://www.flaticon.com/premium-icon/coffee_2465580?term=coffee&related_id=2465580</li>
                <li>https://stackoverflow.com/questions/52911169/how-to-change-the-border-color-of-mui-textfield</li>
                <li>https://www.codesdope.com/blog/article/getting-notebook-paper-effect-with-css/, https://codepen.io/magnificode/pen/rQpaBO</li>
                <li>https://forum.freecodecamp.org/t/newline-in-react-string-solved/68484</li>
            </ul>

        </div>
    );
};