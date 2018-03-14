import React from 'react';
import { GridList } from 'material-ui/GridList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DisplayAvailabilitiesStyles from '../styles/DisplayAvailabilitiesStyles';
import Availability from './Availability';
import AvailabilityService from '../RESserv/AvailabilityService';

/** 
 * Main class to provide functions to display all
 * availabilies in RES contract
 */
class DisplayAvailabilities extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log("Blockchain Booking Protocol: ", props)
    this.state = {
      selectedBooking: 0,
      availability: null,
      availabilities: [],
      tiles: [],
    };
    this.service = new AvailabilityService(this.state);
    this.focusAvailability = this.focusAvailability.bind(this);
    this.displayAvailabilities = this.displayAvailabilities.bind(this);
    this.requestReservation = this.requestReservation.bind(this);
  }

  /**
   * Focus an availability and display it
   */
  focusAvailability(value, e) {
    this.setState({ selectedBooking: e })
    this.getAvailability();
  }

  /**
   * Basic availabilities display
   * based on number of publications
   * in RES contract. 
   */
  displayAvailabilities = async () => {
    const { RES } = this.props;
    const service = new AvailabilityService(this.state);
    let tmpAvailabilities = [];
    const AvailabilityNumber = await RES.getAvailabilityNumber.call();
    var tiles = [];
    for (var i = 0; i < AvailabilityNumber.c[0]; i++) {
      let it = i;
      const smartResponse = await RES.getAvailability(i);
      const availability = new Availability(smartResponse);
      if (!availability.isNullProvider()) {
        availability.setId(it);
        tmpAvailabilities.push(availability);
        const toPush = service.getTileFromAvailability(availability, this.focusAvailability);
        tiles.push(toPush);
      }
    }
    if (service.needRefresh(tmpAvailabilities)) {
      this.setState({ availabilities: tmpAvailabilities });
      this.setState({ tiles: tiles });
    }
  }

  /**
   * invoked immediately after a component is mounted
   * will refresh the view
   */
  componentDidMount = async () => {
    setInterval(this.displayAvailabilities.bind(this), 5000)
  }

  /**
   * Display the focused availability
   */
  getAvailability = async () => {
    const { accounts, RES } = this.props;
    const selectedResource = this.state.selectedBooking;
    const smartResponse = await RES.getAvailability.call(selectedResource, { from: accounts[0] })
    const availability = new Availability(smartResponse);
    availability.setId(selectedResource);
    if (availability !== null) {
      this.setState({ availability: availability });
    } else {
      alert("Availability is empty. A problem occurred.");
    }
  }

  /**
   * Print the actual availability status in console
   */
  getReservationStatus = async () => {
    const { accounts, RES } = this.props
    const response = await RES.getReservationStatus(localStorage.getItem('ressourceId'), { from: accounts[0] })
    console.log("getReservationStatus: ", response.c[0]);
  }

  /**
   * Rely on BTU contract to allow the required BTU minDeposit amount
   * in RES transaction.
   * Send a option on the focused availability from the
   * connected address to RES contract.
   */
  requestReservation = async () => {
    const { accounts, RES, BTU } = this.props
    const selectedResource = this.state.selectedBooking
    const availability = this.state.availabilities[selectedResource];
    console.log("selected availability: " + availability.toString());
    await BTU.approve(RES.address, availability.minDeposit, {from: accounts[0], gas: 120000});
    const response = await RES.requestReservation(selectedResource, { from: accounts[0], gas: 120000 })
    console.log("request reservation: ", response);
  }

  /**
   * View rendering
   */
  render() {
    const styles = new DisplayAvailabilitiesStyles();
    let table = this.service.getAvailabilityTable(this.state.availability);
    return (
      <div >
        <div>
          {table}
        </div>
        <h1>All providers publications</h1>
        <h3>Selected booking: {this.state.selectedBooking}</h3>
        <div>
          <Paper style={styles.paper}>
            <Menu>
              <MenuItem primaryText="Info"  onClick={this.getAvailability}/>
              <MenuItem primaryText="Status" onClick={this.getReservationStatus}/>
              <MenuItem primaryText="Request Reservation" onClick={this.requestReservation}/>
              <MenuItem primaryText="Availability Number" onClick={this.getAvailabilityNumber}/>
            </Menu>
          </Paper>
        </div>
        <MuiThemeProvider>
          <GridList cols={4} style={styles.gridList}>
            {this.state.tiles}
          </GridList>
        </MuiThemeProvider>
      </div>
    )
  }
}
export default DisplayAvailabilities;
