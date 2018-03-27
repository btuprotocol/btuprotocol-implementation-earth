import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3Container from './web3/Web3Container';
import { Menu, Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SwipeableViews from 'react-swipeable-views';
import Publish from './RESimpl/Publish';
import BookerPanel from './RESimpl/BookerPanel';
import NavBar from './viewComponent/NavBar';
import IndexStyles from './styles/IndexStyles';

class Index extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { slideIndex: 0 };
	}

	select = (index) => this.setState({ selectedIndex: index });

	handleChange = (e, {value}) => {
		value = value === 1 ? value : 0;
		this.setState({ slideIndex: value });
	}

	render() {
		const styles = new IndexStyles();
		return (
			<Container fluid={true} style={styles.container}>
				<header>
					<NavBar index={this.state.slideIndex}/>
				</header>

        		<Menu pointing secondary>
         			<Menu.Item name='booker' value={0} active={this.state.slideIndex === 0} onClick={this.handleChange} />
         			<Menu.Item name='provider' value={1} active={this.state.slideIndex === 1} onClick={this.handleChange} />
        		</Menu>

				<Web3Container
					renderLoading={() => <div>Loading Dapp Page...</div>}
					render={({ accounts, RES, BTU }) => (
					<SwipeableViews index={this.state.slideIndex} style={styles.container}
						containerStyle={{
							overflow: "visible",
						}}>
						<div style={styles.slide}>
							<BookerPanel accounts={accounts} RES={RES} BTU={BTU} />
						</div>
						<div style={styles.slide}>
							<Publish accounts={accounts} RES={RES} BTU={BTU} />
						</div>
					</SwipeableViews>
				)}/>
			</Container>
		);
	}
}
ReactDOM.render(<Index />, document.getElementById('root'));

