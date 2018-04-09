import React from 'react'
import _ from 'lodash'
import {
  Menu,
  Grid,
  Button,
  Message,
  Image
} from 'semantic-ui-react'
import gif from '../img/load.gif'
import Availability from './Availability'
import AvailabilityService from '../RESserv/AvailabilityService'

/**
 * Class providing functions to display all
 * availabilies in RES contract
*/
class ProviderPanel extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      info: 'Information panel',
      possess: '',
      statusEnum: ["AVAILABLE", "REQUESTED", "CONFIRMED"],
      selectedBooking: 0,
      availability: null,
      availabilities: [],
      tiles: []
    }
    this.service = new AvailabilityService(this.state)
    this.focusAvailability = this.focusAvailability.bind(this)
  }

  /**
   * Focus an availability and display it
   */
  focusAvailability(value, e) {
    this.setState({ selectedBooking: e })
    this.getAvailability()
  }

  /**
   * Basic owner availabilities display
   * based on number of publications
   * in RES contract.
   */
  displayOwnerAvailabilities = async () => {
    const { accounts, RES } = this.props
    const service = new AvailabilityService(this.state)
    let tmpAvailabilities = []
    const AvailabilityNumber = await RES.getAvailabilityNumber.call()
    var tiles = []
    for (var i = 0; i < AvailabilityNumber.c[0]; i++) {
      let it = i
      const smartResponse = await RES.getAvailability(it)
      const availability = new Availability(smartResponse)
      availability.setId(it)
      if (availability.providerAddress == accounts[0]) {
        tmpAvailabilities.push(availability)
        const toPush = service.getTileFromAvailability(availability, this.focusAvailability)
        tiles.push(toPush)
      }
    }
    this.setState({ possess: tiles.length })
    if (service.needRefresh(tmpAvailabilities)) {
      this.setState({ loaded: true })
      this.setState({ availabilities: tmpAvailabilities })
      this.setState({ tiles: tiles })
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
    const { accounts, RES } = this.props
    const selectedResource = this.state.selectedBooking
    const smartResponse = await RES.getAvailability.call(selectedResource, { from: accounts[0] })
    const availability = new Availability(smartResponse)
    availability.setId(selectedResource)
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
    const { accounts, RES } = this.props
    const response = await RES.getReservationStatus(localStorage.getItem('ressourceId'), { from: accounts[0] })
    this.setState({ info: "Selected availability status: " + this.state.statusEnum[response.c[0]] })
  }

  /**
   * The owner of the availability can
   * accept a reservation and switch status
   * to Confirmed
   */
  acceptReservation = async () => {
    const selectedResource = this.state.selectedBooking
    const { accounts, RES } = this.props
    const smartResponse = await RES.getAvailability.call(selectedResource, { from: accounts[0] })
    const availability = new Availability(smartResponse)
    availability.setId(selectedResource)
    if (availability.status !== 1) {
      this.setState({ info: "This availability isn't waiting acceptation" })
      return
    }
    await RES.acceptReservation(selectedResource, { from: accounts[0], gas: 360000  })
    this.setState({ info: "Reservation accepted" })
  }

  /**
   * The owner of the availability can complete a valid transaction
   */
  completeTransaction = async () => {
    const selectedResource = this.state.selectedBooking
    const { accounts, RES } = this.props
    const smartResponse = await RES.getAvailability.call(selectedResource, { from: accounts[0] })
    const availability = new Availability(smartResponse)
    availability.setId(selectedResource)
    if (availability.status !== 2) {
      this.setState({ info: "No reservation to complete" })
      return
    }
    const response = await RES.completeTransaction(selectedResource, { from: accounts[0], gas: 360000 })
    this.setState({ info: "Reservation finalized" + response })
  }

  /**
   * View rendering
   */
  render() {
    const { accounts } = this.props
    let tilesCount = this.state.tiles.length
    let rows = 1
    const tilesByRow = 2
    if (tilesCount >= tilesByRow) {
      rows = (tilesCount % tilesByRow) === 0 ? tilesCount / tilesByRow : (tilesCount / tilesByRow) + 1
    }
    const tileGrid = _.times(rows, i => (
      <Grid.Row key={i}>
        <Grid.Column textAlign="center">{this.state.tiles[i * tilesByRow]}</Grid.Column>
        <Grid.Column textAlign="center">{this.state.tiles[i * tilesByRow + 1]}</Grid.Column>
      </Grid.Row>
    ))
    let displayer = <Image alt="loading..." src={gif} size='mini' />
    if (this.state.loaded) {
      displayer = <Message>
                    <Message.Header>{this.state.info}</Message.Header>
                    <Message.Item>Connected account: {accounts[0]}</Message.Item>
                    <Message.Item>
                      {(this.state.possess > 0) ? "You have " + this.state.possess + " availabilities published on network" : "You don't have any availability published on network"}
                    </Message.Item>
                  </Message>
    }
    return (
      <div>
        <div>
          {displayer}
        </div>
        <Grid columns={1}>
          <Grid.Row>
            <Grid.Column width={16}>
              <Menu vertical secondary>
                <Menu.Item header>My resources</Menu.Item>
                <Menu.Item>
                  <Button fluid color="violet" onClick={this.acceptReservation} disabled={this.state.availability === null}>Accept Reservation</Button>
                </Menu.Item>
                <Menu.Item>
                  <Button fluid color="purple" onClick={this.completeTransaction} disabled={this.state.availability === null}>Complete Transaction</Button>
                </Menu.Item>
              </Menu>
              <h3>Selected resource: {this.state.availability === null ? "-" : this.state.selectedBooking}</h3>
              <Grid columns={tilesByRow} divided>
                {tileGrid}
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
export default ProviderPanel
