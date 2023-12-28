import React, { useState, useEffect } from 'react';
import './Metronome.css';
// Import other necessary components or utilities

function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(60);

  useEffect(() => {
    if (isPlaying) {
      // Calculate the interval for the beats
      const interval = 60000 / bpm;
      // Set up the interval for playing the beat
      const timer = setInterval(playBeat, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, bpm]);

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const playBeat = () => {
    // Create an oscillator (sound source) and a gain node (volume control)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect the oscillator to the gain node and the gain node to the output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set the type of the sound wave and the frequency
    oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle' are options
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Frequency in Hz

    // Start playing the sound right now
    oscillator.start(audioContext.currentTime);

    // Stop playing the sound in 0.1 seconds
    oscillator.stop(audioContext.currentTime + 0.1);

    // Disconnect the nodes after the sound is stopped to clean up
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const [tapTimes, setTapTimes] = useState([]);
  const maxTaps = 4; // Adjust the number of taps to average as needed

  const handleTap = () => {
    const currentTime = new Date().getTime();
    setTapTimes(prevTimes => {
      const newTimes = [...prevTimes, currentTime];
      if (newTimes.length > maxTaps) {
        newTimes.shift(); // Remove the oldest tap time
      }
      return newTimes;
    });

    if (tapTimes.length > 1) {
      const intervals = tapTimes.slice(1).map((time, index) => time - tapTimes[index]);
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const averageBpm = Math.round(60000 / averageInterval); // Round to nearest integer
      setBpm(averageBpm);
    }
  };

  return (
    <div className="metronome">
      <div className="bpm-slider">
        <div>{bpm} BPM</div>
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
        />
      </div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleTap}>Tap Tempo</button>
    </div>
  );
}


export default Metronome;
