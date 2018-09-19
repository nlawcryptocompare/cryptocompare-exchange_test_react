import React, { Component } from 'react';
import AppHeader from './AppHeader';
import ExchangePanel from './ExchangePanel';
import './app.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                {/* <AppHeader></AppHeader> */}

                <div className="App-body">
                    <ExchangePanel></ExchangePanel>
                </div>
            </div>
        );
    }
}

export default App;
