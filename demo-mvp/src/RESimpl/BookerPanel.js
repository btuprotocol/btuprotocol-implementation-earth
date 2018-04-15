import React from 'react'
import _ from 'lodash'
import {
  Grid,
  Segment,
  Tab,
  Menu,
  Button,
  Message,
  Image
} from 'semantic-ui-react'
import gif from '../img/load.gif'
import Availability from './Availability'
import AvailabilityService from '../RESserv/AvailabilityService'
import BTUService from '../RESserv/BTUService'

/**
 * Booker Panel
 * This class control interaction with RES contract
 * from a booker point of view.
 */
class BookerPanel extends React.Component {
  constructor(props, context) {
    super(props, context)
    console.log("Blockchain Booking Protocol: ", props)
    this.state = {
      loaded: false,
      info: '',
      statusEnum: ["AVAILABLE", "REQUESTED", "CONFIRMED"],
      selectedBooking: 0,
      count: 0,
      availability: null,
      availables: [],
      requested: [],
      completed: [],
      availablesTiles: [],
      requestedTiles: [],
      completedTiles: []
    }
    this.service = new AvailabilityService(this.state)
    this.BTUService = new BTUService()
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
    const { RES } = this.props
    let tmpAvailables = []
    let tmpRequested = []
    let tmpCompleted = []
    const count = await RES.getAvailabilityNumber.call()
    console.log("OnNetwork number of availabilities: ", count)
    if (count !== this.state.count)
      console.log("number of availabilities is now different: oldCount ", this.state.count, " new count: ", count)
    else {
      console.log("no need to update")
      return
    }
    this.setState({ count: count })
    var completedTiles = []
    var availableTiles = []
    var requestedTiles = []
    for (var i = 0; i < count; i++) {
      const sr = RES.getAvailability(i)
      const availability = new Availability(sr)
      availability.setId(i)
      if (availability.isCompleted()) {
        tmpCompleted.push(availability)
        const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
        completedTiles.push(toPush)
      } else if (availability.isRequested()) {
        tmpRequested.push(availability)
        const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
        requestedTiles.push(toPush)
      } else {
        tmpAvailables.push(availability)
        const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
        availableTiles.push(toPush)
      }
    }
    // if (this.availabilityService.needRefresh(tmpAvailabilities)) {
    if (!this.state.loaded) { this.setState({ loaded: true }) }
    this.setState({ availables: tmpAvailables })
    this.setState({ availableTiles: availableTiles })
    this.setState({ requested: tmpRequested })
    this.setState({ requestedTiles: requestedTiles })
    this.setState({ completed: tmpCompleted })
    this.setState({ completedTiles: completedTiles })
    // }
    console.log("availables: ", this.state.availables, " correspondant tiles: ", this.state.availablesTiles)
    console.log("requested: ", this.state.requested, " correspondant tiles: ", this.state.requestedTiles)
    console.log("completed: ", this.state.completed, " correspondant tiles: ", this.state.completedTiles)
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
    const smartResponse = await RES.getAvailability.call(this.state.selectedBooking, { from: accounts[0] })
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
   * Print the actual availability status in console
   */
  getReservationStatus = async () => {
    const { accounts, RES } = this.props
    const st = await RES.getReservationStatus().call(this.state.selectedBooking, { from: accounts[0] })
    this.setState({ info: "Selected availability status: " + this.state.statusEnum[st] })
 }

  /**
   * Rely on BTU contract to allow the required BTU minDeposit amount
   * in RES transaction.
   * Send a option on the focused availability from the
   * connected address to RES contract.
   */
  requestReservation = async () => {
    const { accounts, RES, BTU } = this.props
    const availability = this.state.availabilities[this.state.selectedBooking]
    console.log("selected availability: " + availability.toString())
    const bookerBalance = await this.BTUService.balanceOfPromise(accounts[0])
    if (bookerBalance < availability.minDeposit) {
      this.setState({ info: "Not enought BTU funds for deposit, for demo we will let you do..." })
      // return
    }
    await this.BTUService.approvePromise(RES, availability, accounts[0])
    const response = await RES.requestReservation(this.state.selectedBooking, { from: accounts[0], gas: 120000 })
    this.setState({ info: "request reservation: " + response })
  }

  /**
   * View rendering
   */
  render() {
    const { accounts } = this.props
    let displayer = <Image alt="loading..." src={gif} size='mini' />
    if (this.state.loaded) {
      displayer = <Message>
                    <Message.Header>Information panel</Message.Header>
                    <Message.Item>Your ethereum account: {accounts[0]}</Message.Item>
                    <Message.Item>There is {this.state.count} availabilities on the network</Message.Item>
                    <Message.Item>{this.state.info}</Message.Item>
                  </Message>
    }
    const availablesList = this.availabilityService.getAvailabilityList(this.state.availablesTiles)
    const requestedList = this.availabilityService.getAvailabilityList(this.state.requestedTiles)
    const completedList = this.availabilityService.getAvailabilityList(this.state.completedTiles)
    console.log("Generated list: ", requestedList)
    const panes = [
      { menuItem: 'Availables', render: () => <Tab.Pane>{availablesList}</Tab.Pane> },
      { menuItem: 'Requested', render: () => <Tab.Pane>{requestedList}</Tab.Pane> },
      { menuItem: 'Completed', render: () => <Tab.Pane>{completedList}</Tab.Pane> },
    ]

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
                <Tab panes={panes} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
export default BookerPanel
