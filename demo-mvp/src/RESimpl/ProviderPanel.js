import React from 'react'
// import _ from 'lodash'
import {
  Menu,
  Grid,
  Button,
  Message,
  Image,
  Tab,
  Segment,
  Transition
} from 'semantic-ui-react'
import gif from '../img/load.gif'
import Availability from './Availability'
import AvailabilityDisplay from './AvailabilityDisplay'
import AvailabilityService from '../RESserv/AvailabilityService'
import Style from '../styles/IndexStyles'

/**
 * Class providing functions to display all
 * availabilies in RES contract
*/
class ProviderPanel extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      info: '',
      statusEnum: Availability.STATUS,
      selectedBooking: 0,
      count: 0,
      possess: 0,
      availability: null,
      availabilities: {
        "available": [],
        "requested": [],
        "accepted": [],
      },
      tiles: {
        "available": [],
        "requested": [],
        "accepted": [],
      }
    };
    this.availabilityService = new AvailabilityService(this.state)
    this.focusAvailability = this.focusAvailability.bind(this)
    this.acceptReservation = this.acceptReservation.bind(this)
    this.completeTransaction = this.completeTransaction.bind(this)
    this.displayOwnerAvailabilities = this.displayOwnerAvailabilities.bind(this)
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
    const { accounts, RES } = this.props
    const count = await RES.getAvailabilityNumber.call()
    if (count !== this.state.count) {
      this.setState({ count: count.c[0] })
      let tmpAvailabilities = {}
      let tmpAvailables = []
      let tmpRequested = []
      let tmpAccepted = []
      let tiles = {}
      let availableTiles = []
      let requestedTiles = []
      let acceptedTiles = []
      for (var i = 0; i < this.state.count; i++) {
        const sr = await RES.getAvailability(i)
        const availability = new Availability(sr)
        if (availability.provider.toUpperCase() === accounts[0].toUpperCase()) {
          availability.setId(i)
          if (availability.isRequested()) {
            tmpRequested.push(availability)
            const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
            requestedTiles.push(toPush)
          } else if (availability.isAccepted()) {
            tmpAccepted.push(availability)
            const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
            acceptedTiles.push(toPush)
          }  else {
            tmpAvailables.push(availability)
            const toPush = this.availabilityService.getTileFromAvailability(availability, this.focusAvailability)
            availableTiles.push(toPush)
          }
        }
      }
      tmpAvailabilities.available = tmpAvailables
      tmpAvailabilities.requested = tmpRequested
      tmpAvailabilities.accepted = tmpAccepted
      tiles.available = availableTiles
      tiles.requested = requestedTiles
      tiles.accepted = acceptedTiles
      if (this.availabilityService.needRefresh(tmpAvailabilities)) {
        if (!this.state.loaded) { this.setState({ loaded: true }) }
        this.setState({
          availabilities: tmpAvailabilities,
          tiles: tiles,
          possess: tmpAvailables.length + tmpRequested.length + tmpAccepted.length
        })
      } else if (!this.availabilities || this.availabilities.length === 0) {
        if (!this.state.loaded) { this.setState({ loaded: true }) }
        this.setState({
          possess: 0
        })
      }
    }
  }

  /**
   * invoked immediately after a component is mounted
   */
  componentDidMount = async () => {
    setInterval(this.displayOwnerAvailabilities.bind(this), 7000)
  }

  /**
   * Display the focused availability
   */
  getAvailability = async () => {
    const { accounts, RES } = this.props;
    // must be affected to avoid unexpected behaviour
    const i = this.state.selectedBooking
    const sr = await RES.getAvailability.call(i, { from: accounts[0] })
    const availability = new Availability(sr)
    availability.setId(i)
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
    const i = this.state.selectedBooking
    const st = await RES.getReservationStatus.call(i, { from: accounts[0] })
    this.setState({ info: "Selected availability status: " + this.state.statusEnum[st.c[0]] })
 }

  /**
   * The owner of the availability can
   * accept a reservation and switch status
   * to Confirmed
   */
  acceptReservation = async () => {
    const { accounts, RES } = this.props
    const i = this.state.selectedBooking
    const response = await RES.acceptReservation(i, { from: accounts[0], gas: 360000  })
    this.setState({ info: "accept reservation transaction hash: " + response.tx });
  }

  /**
   * The owner of the availability can complete a valid transaction
   */
  completeTransaction = async () => {
    const { accounts, RES } = this.props
    const i = this.state.selectedBooking
    const response = await RES.completeTransaction(i, { from: accounts[0], gas: 360000 })
    this.setState({ info: "complete transaction hash: " + response.tx })
  }

  /**
   * View rendering
   */
  render() {
    const { accounts, BTU, RES } = this.props
    const style = new Style()
    const infoDisplayer = <div>
                      <Transition visible={!this.state.loaded} animation='scale' duration={500}>
                        <div style={style.slide}>
                          <Image centered alt="loading..." src={gif} size='mini' />
                        </div>
                      </Transition>
                      <Transition visible={this.state.loaded} animation='scale' duration={500}>
                      <Message color="grey">
                        <Message.Header>Information panel</Message.Header>
                        <Message.Item>Connected account: {accounts[0]}</Message.Item>
                        <Message.Item>BTU address: {BTU.address}</Message.Item>
                        <Message.Item>RES address: {RES.address}</Message.Item>
                        <Message.Item>BTUTokenSale address: {BTU.BTUts}</Message.Item>
                        <Message.Item>
                          {(this.state.possess > 0) ? "You have " + this.state.possess + " availabilities published on network" : "You don't have any availability published on network"}
                        </Message.Item>
                        <Message.Item>
                          {this.state.info}
                        </Message.Item>
                      </Message>
                    </Transition>
                  </div>
    const availableDisplay = <AvailabilityDisplay tiles={this.state.tiles.available} availabilities={this.state.availabilities.available}></AvailabilityDisplay>
    const requestedDisplay = <AvailabilityDisplay tiles={this.state.tiles.requested} availabilities={this.state.availabilities.requested}></AvailabilityDisplay>
    const acceptedDisplay = <AvailabilityDisplay tiles={this.state.tiles.accepted} availabilities={this.state.availabilities.accepted}></AvailabilityDisplay>
    const panes = [
      { menuItem: 'Availables', render: () => <Tab.Pane as="div">{availableDisplay}</Tab.Pane> },
      { menuItem: 'Requested', render: () => <Tab.Pane as="div">{requestedDisplay}</Tab.Pane> },
      { menuItem: 'Accepted', render: () => <Tab.Pane as="div">{acceptedDisplay}</Tab.Pane> },
    ]
    return (
      <div>
        <div>
          {infoDisplayer}
        </div>
        <Grid divided columns={1}>
          <Grid.Row>
            <Grid.Column>
              <Menu vertical secondary>
                <Menu.Item header>My resources</Menu.Item>
                <Menu.Item>
                  <Button fluid color="violet" onClick={this.acceptReservation} disabled={this.state.availability === null}>Accept Reservation</Button>
                </Menu.Item>
                <Menu.Item>
                  <Button fluid color="purple" onClick={this.completeTransaction} disabled={this.state.availability === null}>Complete Transaction</Button>
                </Menu.Item>
              </Menu>
             </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <h3>Selected resource: {this.state.availability === null ? "-" : this.state.selectedBooking}</h3>
            <Grid.Column>
              <Tab menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
export default ProviderPanel;
