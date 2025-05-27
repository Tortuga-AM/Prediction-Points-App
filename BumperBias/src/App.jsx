// src/App.jsx
// Bumper Bias Project
import React from 'react';
import TestComponent from './Components/TestComponent/TestComponent';

function App() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <TestComponent />
            <h1 className='text-3xl font-bold text-center text-blue-600'>Bumper Bias</h1>
            <p>Project Setup!</p>
        </div>
    );
}

export default App;