import React from 'react';

function StudentDash() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Student Dashboard</h1>
            <p className="text-lg text-gray-700">Welcome to your dashboard!</p>
            <div className="mt-8">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View Assignments
                </button>
            </div>
        </div>
    );
}
export default StudentDash;