import React from 'react';
import './App.css';
import Metronome from './components/Metronome/Metronome'; // Import the Metronome component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Metronome App</h1>
        <Metronome /> {/* Include the Metronome component here */}
      </header>
    </div>
  );
}

export default App;
