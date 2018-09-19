import React, { Component } from 'react';
import { subscribeToExchange } from './api';
import { unsubscribeFromExchange } from './api';
import './exchange-panel.css';

class ExchangePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeExchange: '',
            exhchangeData: [],
        };

        this.unsub = () => {
            console.log('Unsubscribing....');

            unsubscribeFromExchange();
        };

        this.sub = subscribeToExchange((dataStreamEntry) => {
            // Set active exchange
            if (this.state.activeExchange !== dataStreamEntry.MARKET) {
                this.setState({ activeExchange: dataStreamEntry.MARKET });
            }

            // Check if the incoming pair is already being tracked
            const trackedPair = this.state.exhchangeData.filter((tableEntry) => tableEntry.FROMSYMBOL === dataStreamEntry.FROMSYMBOL && tableEntry.TOSYMBOL === dataStreamEntry.TOSYMBOL)[0];

            // If the incoming pair is not yet being tracked, push it in
            if (!trackedPair) {
                const concatedData = this.state.exhchangeData.concat([dataStreamEntry]);

                this.setState({ exhchangeData: concatedData });
            } else {
                // If a pair already exists, update it

                // Clone array out of state
                let newExchangeData = this.state.exhchangeData.slice(0);

                // Get index of pair to update
                const pairIdx = newExchangeData.indexOf(trackedPair);

                // Update entry in new array
                Object.keys(dataStreamEntry).forEach((thisKey) => {
                    newExchangeData[pairIdx][thisKey] = dataStreamEntry[thisKey];
                });

                newExchangeData[pairIdx].updated = 'updated';

                // Once all keys have been updated, save array back into state
                this.setState({ exhchangeData: newExchangeData });

                setTimeout(() => {
                    newExchangeData[pairIdx].updated = '';
                }, 0);
            }
        });
    }

    render() {
        return (
            <div className="container">
                <h2>Exchange Transactions ({ this.state.activeExchange })</h2>

                <table className="ExchangePanel-table" cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>Market</th>
                            <th>Price</th>
                            <th>Open 24H</th>
                            <th>Range 24H</th>
                            <th>Last Trade</th>
                            <th>Volume 24H</th>
                        </tr>
                        {this.state.exhchangeData.map((item, idx) => {
                            return (
                                <tr key={idx} className={item.updated}>
                                    <td>{ item.FROMSYMBOL }/{ item.TOSYMBOL }</td>
                                    <td>{ item.PRICE } { item.TOSYMBOL }</td>
                                    <td>{ item.OPEN24HOUR }</td>
                                    <td>
                                        H: { item.HIGH24HOUR }
                                        <br />
                                        L: { item.LOW24HOUR }
                                    </td>
                                    <td>
                                        Last Volume: { item.LASTVOLUME }
                                        <br />
                                        Last Trade ID: { item.LASTTRADEID }
                                        <br />
                                        Last Time: { JSON.stringify(new Date(item.LASTUPDATE * 1000)) }
                                    </td>
                                    <td>{ item.VOLUME24HOUR } { item.FROMSYMBOL }</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ExchangePanel;
