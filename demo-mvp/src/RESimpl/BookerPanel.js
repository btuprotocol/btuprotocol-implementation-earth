import React from 'react'
import _ from 'lodash'
import {
  Grid,
  Segment,
  Menu,
  Button,
  Message,
  Image
} from 'semantic-ui-react'
import gif from '../img/load.gif'
import Availability from './Availability'
import AvailabilityService from '../RESserv/AvailabilityService'
import RESService from '../RESserv/RESService';
import BTUService from '../RESserv/BTUService';

/**
 * Main class to provide functions to display all
 * availabilies in RES contract
 */
class BookerPanel extends React.Component {
  constructor(props, context) {
    super(props, context)
    console.log("Blockchain Booking Protocol: ", props)
    const { BTU, RES } = props
    this.state = {
      loaded: false,
      info: 'Information panel',
      statusEnum: ["AVAILABLE", "REQUESTED", "CONFIRMED"],
      selectedBooking: 0,
      countAvailabilities: 0,
      availability: null,
      availabilities: [],
      tiles: [],
    }
    this.resService = new RESService(RES)
    this.btuService = new BTUService(BTU)
    this.availabilityService = new AvailabilityService(this.state)
    this.focusAvailability = this.focusAvailability.bind(this)
    this.displayAvailabilities = this.displayAvailabilities.bind(this)
    this.requestReservation = this.requestReservation.bind(this)
  }

  /**
   * Focus an availability and display it
   */
  focusAvailability(value, e) {
    this.setState({ selectedBooking: e })
    this.getAvailability()
  }


  /**
   * Basic availabilities display
   * based on number of publications
   * in RES contract.
   */
  displayAvailabilities = async () => {
    let tmpAvailabilities = []
    const count = await this.resService.getAvailabilityNumberPromise()
    this.setState({ countAvailabilities: count })
    var tiles = []
    for (var i = 0; i < count; i++) {
      let sr = await this.resService.getAvailabilityPromise(i)
      const availability = new Availability(sr)
      if (availability.isNullProvider() === false) {
        availability.setId(i)
        tmpAvailabilities.push(availability)
        const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
        tiles.push(toPush)
      }
    }
    if (this.availabilityService.needRefresh(tmpAvailabilities)) {
        if (!this.state.loaded) { this.setState({ loaded: true }) }
        this.setState({ availabilities: tmpAvailabilities })
        this.setState({ tiles: tiles })
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
    let smartResponse = await this.resService.getAvailabilityPromise(this.state.selectedBooking)
    const availability = new Availability(smartResponse)
    availability.setId(this.state.selectedBooking);
    if (availability !== null) {
      this.setState({ availability: availability })
      this.setState({ info: "Availability selected" })
    } else {
      this.setState({ info: "Availability is empty. A problem occurred." })
    }
  }

  /**
   * Print the actual availability status in info
   */
  getReservationStatus = async () => {
    const st = await this.resService.getReservationStatusPromise(this.state.selectedBooking)
    this.setState({ info: "Selected availability status: " + this.state.statusEnum[st] })
  }

  /**
   * Rely on BTU contract to allow the required BTU minDeposit amount
   * in RES transaction.
   * Send a option on the focused availability from the
   * connected address to RES contract.
   */
  requestReservation = async () => {
    const { accounts, RES } = this.props
    const selectedResource = this.state.selectedBooking
    const availability = this.state.availabilities[selectedResource]
    const bookerBalance = await this.btuService.balanceOfPromise(accounts[0])
    if (bookerBalance < availability.minDeposit) {
      this.setState({ info: "Not enought BTU funds for deposit, for demo we will let you do..." })
      // return
    }
    await this.btuService.approvePromise(RES, availability, accounts[0])
    const data = await this.resService.requestReservationPromise(selectedResource, accounts[0])
    this.setState({ info: "request reservation: " + data })
  }

  provideBTU = async () => {
    const { accounts } = this.props
    await this.btuService.provideFiveBTUPromise(accounts[0])
  }

  /**
   * View rendering
   */
  render() {
    const { accounts } = this.props
    let tilesCount = this.state.tiles.length
    let rows = 1
    const tilesByRow = 3
    if (tilesCount >= tilesByRow) {
      rows = (tilesCount % tilesByRow) === 0 ? tilesCount / tilesByRow : (tilesCount / tilesByRow) + 1
    }
    const tileGrid = _.times(rows, i => (
      <Grid.Row key={i}>
          <Grid.Column textAlign="center"><Segment>{this.state.tiles[i*tilesByRow]}</Segment></Grid.Column>
          <Grid.Column textAlign="center"><Segment>{this.state.tiles[i*tilesByRow+1]}</Segment></Grid.Column>
          <Grid.Column textAlign="center"><Segment>{this.state.tiles[i*tilesByRow+2]}</Segment></Grid.Column>
      </Grid.Row>
    ))
    let displayer = <Image alt="loading..." src={gif} size='mini' />
    if (this.state.loaded) {
      displayer = <Message>
                    <Message.Header>{this.state.info}</Message.Header>
                    <Message.Item>Connected account: {accounts[0]}</Message.Item>
                    <Message.Item>There is {this.state.countAvailabilities} availabilities on the network</Message.Item>
                  </Message>
    }
    return (
      <div>
        <h1>All providers availabilities</h1>
        <h3>Selected availability: {this.state.availability === null ? "-" : this.state.selectedBooking}</h3>
        <div>
          {displayer}
        </div>
        <Grid stackable columns={1}>
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment>
                <Menu vertical secondary>
                  <Menu.Item fitted='vertically'>
                    <Button fluid color="violet" onClick={this.requestReservation} disabled={this.state.availability === null}>Reserve</Button>
                  </Menu.Item>
                  <Menu.Item fitted='vertically'>
                    <Button fluid color="purple" onClick={this.getReservationStatus} disabled={this.state.availability === null}>See Status</Button>
                  </Menu.Item>
                  <Menu.Item fitted='vertically'>
                    <Button fluid color="green" onClick={this.provideBTU}>Get 5 BTU</Button>
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
export default BookerPanel
