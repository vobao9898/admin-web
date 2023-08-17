import React from "react";
import Routes from "routes/index";
import { GlobalContextProvider } from "context/GlobalContextProvider";
import "./assets/fonts/stylesheet.css";

function App() {
    return (
        <GlobalContextProvider>
            <div className="App">
                <Routes />
            </div>
        </GlobalContextProvider>
    );
}

export default App;
