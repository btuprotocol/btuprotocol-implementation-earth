import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppBar } from 'material-ui';
import { Tabs, Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SwipeableViews from 'react-swipeable-views';
import IndexStyles from './styles/IndexStyles';
import Web3Container from './web3/Web3Container';
import Publish from './RESimpl/Publish';
import DisplayAvailabilities from './RESimpl/DisplayAvailabilities';

class Index extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { slideIndex: 0 };
	}

	select = (index) => this.setState({ selectedIndex: index });
	
	handleChange = (value) => {
		value = value === 1 ? value : 0;
		this.setState({ slideIndex: value });
	} 

	render() {
		const styles = new IndexStyles();
		function handleClick() {
			window.open("http://booking-token.launchrock.com/");
		}
		return (
			<div>
				<header>
					<MuiThemeProvider muiTheme={styles.appBar}>
						<AppBar
							title={<span style={styles.customStyles}>MVP DEMO - Booking Unit Token Protocol</span>}
							onTitleClick={handleClick} />
					</MuiThemeProvider>
				</header>

				<MuiThemeProvider muiTheme={styles.tabs}>
					<Tabs onChange={this.handleChange} value={this.state.slideIndex} >
						<Tab label="List decentralized publications" value={0} />
						<Tab label="Decentralize a booking" value={1} />
					</Tabs>
				</MuiThemeProvider>

				<Web3Container
					renderLoading={() => <div>Loading Dapp Page...</div>}
					render={({ accounts, RES, BTU }) => (
					<SwipeableViews index={this.state.slideIndex}>
						<div style={styles.styles2.slide}>
							<MuiThemeProvider>
								<div>
									<DisplayAvailabilities accounts={accounts} RES={RES} BTU={BTU} />
								</div>
							</MuiThemeProvider>
						</div>
						<div style={styles.styles2.slide}>
							<MuiThemeProvider muiTheme={styles.appBar}>
								<div>
									<Publish accounts={accounts} RES={RES} BTU={BTU} />
								</div>
							</MuiThemeProvider>
						</div>
					</SwipeableViews>
				)}/>
			</div>
		);
	}
}
ReactDOM.render(<Index />, document.getElementById('root'));

