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
 * Class providing functions to display all
 * availabilies in RES contract
*/
class DisplayOwnerAvailabilities extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedBooking: 0,
      availability: null,
      availabilities: [],
      tiles: []
    };
    this.service = new AvailabilityService(this.state);
    this.focusAvailability = this.focusAvailability.bind(this);
  }
   
  /**
   * Focus an availability and display it
   */
  focusAvailability(value, e) {
    this.setState({ selectedBooking: e })
    this.getAvailability();
  }

  /**
   * Basic owner availabilities display
   * based on number of publications
   * in RES contract. 
   */
  displayOwnerAvailabilities = async () => {
    const { accounts, RES } = this.props;
    const service = new AvailabilityService(this.state);
    let tmpAvailabilities = [];
    const AvailabilityNumber = await RES.getAvailabilityNumber.call();
    var tiles = [];
    for (var i = 0; i < AvailabilityNumber.c[0]; i++) {
      let it = i;
      const smartResponse = await RES.getAvailability(it);
      const availability = new Availability(smartResponse);
      availability.setId(it);
      if (availability.providerAddress === accounts[0]) {
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
   */
  componentDidMount = async () => {
    setInterval(this.displayOwnerAvailabilities.bind(this), 6000)
  }

  /**
   * alert focused availability
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
   * Display the status int in console (0, 1 or 2)
   */
  getReservationStatus = async () => {
    const { accounts, RES } = this.props
    const response = await RES.getReservationStatus(localStorage.getItem('ressourceId'), { from: accounts[0] })
    console.log("getReservationStatus: ", response.c[0]);
  }

  /**
   * The owner of the availability can
   * accept a reservation and switch status
   * to Confirmed
   */
  acceptReservation = async () => {
    const selectedResource = this.state.selectedBooking
    const { accounts, RES } = this.props
    const response = await RES.acceptReservation(selectedResource, { from: accounts[0], gas: 360000  })
    console.log("accept Reservation: ", response);
  }

  /**
   * The owner of the availability can complete a valid transaction
   */
  completeTransaction = async () => {
    const selectedResource = this.state.selectedBooking
    const { accounts, RES } = this.props
    const response = await RES.completeTransaction(selectedResource, { from: accounts[0], gas: 360000 })
    console.log("completeTransaction: ", response);
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
        <h1>My publications</h1>
        <div>
          <Paper style={styles.paper}>
            <Menu>
              <MenuItem primaryText="Info"  onClick={this.getAvailability}/>
              <MenuItem primaryText="Status" onClick={this.getReservationStatus}/>
              <MenuItem primaryText="Accept Reservation" onClick={this.acceptReservation}/>
              <MenuItem primaryText="Complete Transaction" onClick={this.completeTransaction}/>
            </Menu>
          </Paper>
        </div>
        <h3>Selected booking: {this.state.selectedBooking}</h3>
        <MuiThemeProvider>
          <GridList cols={4} style={styles.gridList}>
            {this.state.tiles}
          </GridList>
        </MuiThemeProvider>
      </div>
    )
  }
}
export default DisplayOwnerAvailabilities;
