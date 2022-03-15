import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const [hello, setHello] = useState('undef');

  const onClick = async (e) => {
    e.preventDefault();
    const res = await axios.get('/api/hello/');
    setHello(res.data)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn <button onClick={onClick}>{hello}</button>
        </a>
      </header>
    </div>
  );
}

export default App;
