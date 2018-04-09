import React from 'react';
import _ from 'lodash';
import { Grid, Segment, Menu, Button } from 'semantic-ui-react';
import Availability from './Availability';
import AvailabilityService from '../RESserv/AvailabilityService';

/**
 * Main class to provide functions to display all
 * availabilies in RES contract
 */
class BookerPanel extends React.Component {
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
      if (availability.isNullProvider() === false) {
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
    setInterval(this.displayAvailabilities.bind(this), 7000)
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
    let tilesCount = this.state.tiles.length;
    let rows = 1;
    const tilesByRow = 3;
    if (tilesCount >= tilesByRow) {
      rows = (tilesCount % tilesByRow) === 0 ? tilesCount / tilesByRow : (tilesCount / tilesByRow) + 1;
    }
    const tileGrid = _.times(rows, i => (
      <Grid.Row key={i}>
        <Grid.Column><Segment>{this.state.tiles[i*tilesByRow]}</Segment></Grid.Column>
        <Grid.Column><Segment>{this.state.tiles[i*tilesByRow+1]}</Segment></Grid.Column>
        <Grid.Column><Segment>{this.state.tiles[i*tilesByRow+2]}</Segment></Grid.Column>
      </Grid.Row>
    ))
    return (
      <div>
        <h1>All providers publications</h1>
        <h3>Selected booking: {this.state.availability === null ? "-" : this.state.selectedBooking}</h3>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment>
                <Menu vertical secondary>
                  {/*
                  <Menu.Item as="button" name='Info' active={this.state.slideIndex === 0} onClick={this.getAvailability} />
                  <Menu.Item name='Status' active={this.state.slideIndex === 1} onClick={this.getReservationStatus} />
                  */}
                    <Menu.Item>
                      <Button color="violet" onClick={this.requestReservation} disabled={this.state.availability === null}>Request Reservation</Button>
                    </Menu.Item>
                </Menu>
              </Segment>
            </Grid.Column>
            <Grid.Column width={12}>
              <Segment>
                <Grid stackable columns={tilesByRow}>
                  {tileGrid}
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
export default BookerPanel;
