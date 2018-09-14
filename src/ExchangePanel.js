import React, { Component } from 'react';
import { subscribeToExchange } from './api';

class ExchangePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeExchange: '',
            exhchangeData: [],
        };

        subscribeToExchange((dataStreamEntry) => {
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
                const newExchangeData = this.state.exhchangeData.slice(0);

                // Get index of pair to update
                const pairIdx = newExchangeData.indexOf(trackedPair);

                // Update entry in new array
                Object.keys(dataStreamEntry).forEach((thisKey) => {
                    newExchangeData[pairIdx][thisKey] = dataStreamEntry[thisKey];
                });

                // Once all keys have been updated, save array back into state
                this.setState({ exhchangeData: newExchangeData });
            }
        });
    }

    render() {
        return (
            <div>
                <h2>Exchange Transactions ({ this.state.activeExchange })</h2>

                <table>
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
                                <tr key={idx}>
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
                                        Last Trade ID: { item.TRADEID }
                                        <br />
                                        {/* Last Time: { new Date(item.LASTUPDATE * 1000) } */}
                                        <br />
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