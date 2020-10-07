import React from 'react';
import AppContainer from "./components/app-container";

function App() {
    return (
        <div className="App">
            <nav className="nav py-2 px-4 bg-light">
                <h2>My Money</h2>
            </nav>
            <AppContainer />
        </div>
    );
}

export default App;
