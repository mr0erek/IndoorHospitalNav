// src/App.js
import React from 'react';
import IndoorMap from './components/IndoorMap';
import BuildAnnotator from './components/BlueprintAnnotator'

function App() {
  return (
    <div className="App">
      <h1>Hospital Navigation System</h1>
      <IndoorMap />
      <BuildAnnotator />
    </div>
  );
}

export default App;
