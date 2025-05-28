import { CircularProgress } from '@mui/material';
import React from 'react';

function SpinnerLoader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
                <CircularProgress />
                <div className="mt-4 text-lg font-medium">
                    Loading
                    <span className="inline-block animate-pulse">.</span>
                    <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                </div>
            </div>
        </div>
    );
}
export default SpinnerLoader;