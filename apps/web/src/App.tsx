import { useState } from 'react';
import './App.css';
import PlaybooksPage from './pages/PlaybooksPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Crew Directory</h1>
      </header>
      <main>
        <PlaybooksPage />
      </main>
    </div>
  );
}

export default App;
