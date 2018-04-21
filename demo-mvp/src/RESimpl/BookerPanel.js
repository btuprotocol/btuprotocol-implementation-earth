import React from 'react'
import {
  Grid,
  Tab,
  Menu,
  Button,
  Message,
  Image,
  Transition
} from 'semantic-ui-react'
import gif from '../img/load.gif'
import Availability from './Availability'
import AvailabilityDisplay from './AvailabilityDisplay'
import AvailabilityService from '../RESserv/AvailabilityService'
import BTUService from '../RESserv/BTUService'
import Style from '../styles/IndexStyles'

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
      statusEnum: Availability.STATUS,
      selectedBooking: 0,
      count: 0,
      availability: null,
      availabilities: {
        "available": [],
        "requested": [],
        "accepted": [],
        "completed": []
      },
      tiles: {
        "available": [],
        "requested": [],
        "accepted": [],
        "completed": []
      }
    }
    this.availabilityService = new AvailabilityService(this.state)
    this.BTUService = new BTUService(props.BTU)
    this.focusAvailability = this.focusAvailability.bind(this)
    this.getAvailability = this.getAvailability.bind(this)
    this.displayAvailabilities = this.displayAvailabilities.bind(this)
    this.requestReservation = this.requestReservation.bind(this)
    this.getReservationStatus = this.getReservationStatus.bind(this)
  }

  /**
   * Focus an availability and display it
   */
  focusAvailability(value, e) {
    this.setState({ selectedBooking: e })
    setTimeout(this.getAvailability.bind(this), 1000)
  }

  /**
   * Basic availabilities display
   * based on number of publications
   * in RES contract.
   */
  displayAvailabilities = async () => {
    const { RES } = this.props
    const count = await RES.getAvailabilityNumber.call()
    if (count !== this.state.count) {
      this.setState({ count: count.c[0] })
      let tmpAvailabilities = {}
      let tmpAvailables = []
      let tmpRequested = []
      let tmpAccepted = []
      let tmpCompleted = []
      let tiles = {}
      let availableTiles = []
      let requestedTiles = []
      let acceptedTiles = []
      let completedTiles = []
      for (var i = 0; i < this.state.count; i++) {
        const sr = await RES.getAvailability(i)
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
      tmpAvailabilities.available = tmpAvailables
      tmpAvailabilities.requested = tmpRequested
      tmpAvailabilities.accepted = tmpAccepted
      tmpAvailabilities.completed = tmpCompleted
      tiles.available = availableTiles
      tiles.requested = requestedTiles
      tiles.accepted = acceptedTiles
      tiles.completed = completedTiles
      if (this.availabilityService.needRefresh(tmpAvailabilities)) {
        if (!this.state.loaded) { this.setState({ loaded: true }) }
        this.setState({
          availabilities: tmpAvailabilities,
          tiles: tiles
        })
      }
    }
  }

  /**
   * invoked immediately after a component is mounted
   * will refresh the view
   */
  componentDidMount = async () => {
    setInterval(this.displayAvailabilities.bind(this), 3000)
  }

  /**
   * Display the focused availability
   */
  getAvailability = async () => {
    const { RES } = this.props;
    // must be affected to avoid unexpected behaviour
    const i = this.state.selectedBooking
    const sr = await RES.getAvailability(i)
    const availability = new Availability(sr)
    availability.setId(i)
    console.log("selected availability: ", availability)
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
    const st = await RES.getReservationStatus.call(this.state.selectedBooking, { from: accounts[0] })
    this.setState({ info: "Selected availability status: " + this.state.statusEnum[st.c[0]] })
 }

  /**
   * Rely on BTU contract to allow the required BTU minDeposit amount
   * in RES transaction.
   * Send a option on the focused availability from the
   * connected address to RES contract.
   */
  requestReservation = async () => {
    const { accounts, RES } = this.props
    if (this.state.availability === null) {
      this.setState({ info: "You must select an availability"})
      return
    }
    const i = this.state.selectedBooking
    console.log("selected availability: " + this.state.availability.toString())
    const cost = this.state.availability.minDeposit * Math.pow(10, 18)
    const bookerBalance = await this.BTUService.balanceOfPromise(accounts[0])
    console.log("booker balance: ", bookerBalance, " min deposit: ", this.state.availability.minDeposit, " cost: ", cost)
    if (bookerBalance < cost) {
      this.setState({ info: "Not enought BTU funds for deposit, for demo we will let you do..." })
      // return
    }
    await this.BTUService.approvePromise(RES, this.state.availability, accounts[0])
    const response = await RES.requestReservation(i, { from: accounts[0], gas: 120000 })
    console.log("requestReservation response: ", response)
    this.setState({ info: "request reservation transaction hash: " + response.tx })
  }

  /**
   * View rendering
   */
  render() {
    const style = new Style()
    const { accounts, BTU, RES } = this.props
    const infoDisplayer = <div>
                      <Transition visible={!this.state.loaded} animation='slide up' duration={200}>
                        <div style={style.slide}>
                          <Image centered alt="loading..." src={gif} size='mini' />
                        </div>
                      </Transition>
                      <Transition visible={this.state.loaded} animation='slide up' duration={200}>
                      <Message color="grey">
                        <Message.Header>Information panel</Message.Header>
                        <Message.Item>Your ethereum account: {accounts[0]}</Message.Item>
                        <Message.Item>BTU address: {BTU.address}</Message.Item>
                        <Message.Item>RES address: {RES.address}</Message.Item>
                        <Message.Item>BTUTokenSale address: {BTU.BTUts}</Message.Item>
                        <Message.Item>There is {this.state.count} availabilities on the network</Message.Item>
                        <Message.Item>{this.state.info}</Message.Item>
                      </Message>
                    </Transition>
                    </div>
    const availableDisplay = <AvailabilityDisplay tiles={this.state.tiles.available} availabilities={this.state.availabilities.available}></AvailabilityDisplay>
    const requestedDisplay = <AvailabilityDisplay tiles={this.state.tiles.requested} availabilities={this.state.availabilities.requested}></AvailabilityDisplay>
    const acceptedDisplay = <AvailabilityDisplay tiles={this.state.tiles.accepted} availabilities={this.state.availabilities.accepted}></AvailabilityDisplay>
    const completedList = this.availabilityService.getAvailabilityList(this.state.tiles.completed)
    const panes = [
      { menuItem: 'Availables', render: () => <Tab.Pane as="div">{availableDisplay}</Tab.Pane> },
      { menuItem: 'Requested', render: () => <Tab.Pane as="div">{requestedDisplay}</Tab.Pane> },
      { menuItem: 'Accepted', render: () => <Tab.Pane as="div">{acceptedDisplay}</Tab.Pane> },
      { menuItem: 'Completed', render: () => <Tab.Pane as="div">{completedList}</Tab.Pane> },
    ]
    return (
      <div>
        <h1>All providers availability offers</h1>
        <h3>Selected availability: {this.state.availability === null ? "-" : this.state.selectedBooking}</h3>
        <div>
          {infoDisplayer}
        </div>
        <Grid stackable columns={1}>
          <Grid.Row>
            <Grid.Column width={4}>
                <Menu vertical secondary>
                  <Menu.Item fitted='vertically'>
                    <Button fluid color="violet" onClick={this.requestReservation} disabled={this.state.availability === null}>Reserve</Button>
                  </Menu.Item>
                  <Menu.Item fitted='vertically'>
                    <Button fluid color="purple" onClick={this.getReservationStatus} disabled={this.state.availability === null}>See Status</Button>
                  </Menu.Item>
                </Menu>
            </Grid.Column>
            <Grid.Column width={12}>
                <Tab menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
export default BookerPanel
