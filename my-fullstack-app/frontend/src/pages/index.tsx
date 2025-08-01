import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold">Welcome to My Fullstack App</h1>
            <p className="mt-4 text-lg">This is the main page of the application.</p>
        </div>
    );
};

export default Home;