import React from 'react'
import _ from 'lodash'
import Availability from '../RESimpl/Availability'
import {
  List,
  Card,
  Icon,
  Image,
  Button,
} from 'semantic-ui-react'

export default class AvailabilityService {
    state = {}
    stringStatus = ["AVAILABLE", "REQUESTED", "CONFIRMED"]
    constructor(state) {
        this.state = state
    }

    /**
     * Compare two list of availabilities
     * return true if a difference exist
     * according to Availability.equalsTo
     */
    needRefresh(availabilities) {
        if (this.state.availabilities.length !== availabilities.length)
            return true
        for (let i = 0; i < availabilities.length; i++) {
            const a = new Availability(availabilities[i])
            if (a.equalsTo(this.state.availabilities[i]) <= 0)
                return true
        }
        return false
    }

    /**
     * return a jsx Card (semantic) based on availability
     */
    getTileFromAvailability(availability, callback) {
      return !availability.isCompleted() ? <Card fluid>
                <Image  src={availability.metaData} alt={availability.metaData} />
                <Card.Content>
                  <Card.Header>
                    { "Resource " + availability.resourceId }
                    <p>{ "Provided by " + availability.provider.substring(0,8) + "..." }</p>
                    <p>{ "Deposit " + availability.minDeposit + (availability.minDeposit > 1 ? " BTUs" : " BTU")}</p>
                  </Card.Header>
                  <Card.Meta>
                    <h3>Available from:</h3>
                    <p className='date'>{ availability.startDateTs.toDateString() }</p>
                    <h3>To: </h3>
                    <p className='date'>{ availability.endDateTs.toDateString() }</p>
                    <h3>Can be cancel until: </h3>
                    <p className='date'>{ availability.freeCancelDateTs.toDateString() }</p>
                    <h3>at</h3>
                    <p className='date'>{ availability.freeCancelDateTs.toTimeString() }</p>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <p>
                    <Icon name='address book outline' />
                    { <span>Status :<b>{this.stringStatus[availability.status]}</b></span> }
                  </p>
                  <Button onClick={(e) => callback(e, availability.resourceId)} color="teal">
                    <Icon name='pin' />{ <span>Select</span> }
                  </Button>
                </Card.Content>
              </Card> : <Card>
                          <Card.Content extra>
                            <p>
                              <Icon name='address book outline' />
                              { <span>Status :<b>COMPLETE</b></span> }
                            </p>
                          </Card.Content>
                        </Card>
    }

    /**
     * return List displaying availabilities
     */
    getAvailabilityList(tiles) {
      console.log("availabilies used to generate list: ", tiles)
      console.log("Display the first availabily: ", tiles[0])
      const items = _.times(tiles.length, i => (
          <List.Item key={i}>{tiles[i]}</List.Item>
        )
      )
      return <List>{items}</List>
    }
}
