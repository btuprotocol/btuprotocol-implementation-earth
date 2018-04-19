import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Web3Container from './web3/Web3Container'
import { Menu, Container, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import gif from './img/load.gif'
import SwipeableViews from 'react-swipeable-views'
import Publish from './RESimpl/Publish'
import BookerPanel from './RESimpl/BookerPanel'
import NavBar from './viewComponent/NavBar'
import Tutorial from './viewComponent/Tutorial'
import IndexStyles from './styles/IndexStyles'

class Index extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { slideIndex: 1 };
	}

	select = (index) => this.setState({ selectedIndex: index });

	handleChange = (e, {value}) => {
		value = value <= 2 ? value : 0;
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
                    <Menu.Item name='Tutorial' value={0} active={this.state.slideIndex === 0} onClick={this.handleChange} />
                    <Menu.Item name='Booker panel' value={1} active={this.state.slideIndex === 1} onClick={this.handleChange} />
                    <Menu.Item name='Provider panel' value={2} active={this.state.slideIndex === 2} onClick={this.handleChange} />
                </Menu>
                    <SwipeableViews index={this.state.slideIndex} style={styles.container}>
                        <div style={styles.slide}>
                            <Tutorial/>
                        </div>
                        <div style={styles.slide}>
                        <Web3Container
                            renderLoading={() => <div>Loading dApp, see tutorial if nothing happen
                                                    <Image centered alt="loading..." src={gif} size='mini' />
                                                 </div>}
                            render={({ accounts, RES, BTU }) => (
                            <div>
                                <BookerPanel accounts={accounts} RES={RES} BTU={BTU} />
                            </div>
                        )}/>
                        </div>
                        <div style={styles.slide}>
                        <Web3Container
                            renderLoading={() => <div>Loading dApp, see tutorial if nothing happen...</div>}
                            render={({ accounts, RES, BTU }) => (
                            <div>
                                <Publish accounts={accounts} RES={RES} BTU={BTU} />
                            </div>
                        )}/>
                        </div>
                    </SwipeableViews>
            </Container>
		);
	}
}
ReactDOM.render(<Index />, document.getElementById('root'));

