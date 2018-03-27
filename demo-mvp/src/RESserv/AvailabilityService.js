import React from 'react';
import Availability from '../RESimpl/Availability';
import {
  Table,
  Card,
  Icon,
  Image,
  Button,
} from 'semantic-ui-react';

export default class AvailabilityService {
    state = {};
    stringStatus = ["AVAILABLE", "REQUESTED", "CONFIRMED"];
    constructor(state) {
        this.state = state;
    }

    /**
     * Compare two list of availabilities
     * return true if a difference exist
     * according to Availability.equalsTo
     */
    needRefresh(availabilities) {
        if (this.state.availabilities.length !== availabilities.length)
            return true;
        for (let i = 0; i < availabilities.length; i++) {
            const a = new Availability(availabilities[i]);
            if (a.equalsTo(this.state.availabilities[i]) <= 0)
                return true;
        }
        return false;
    }

    /**
     * return a jsx Card (semantic) based on availability
     */
    getTileFromAvailability(availability, callback) {
       return typeof availability.providerAddress !== 'undefined' ? <Card>
                <Image  src={availability.metaData} alt={availability.metaData} />
                <Card.Content>
                  <Card.Header>
                    { "Resource " + availability.resourceId }
                    <p>{ "Provided by " + availability.providerAddress.substring(0,8) + "..." }</p>
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
                  <Card.Description>
                      Availibility number { availability.resourceId }
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button onClick={(e) => callback(e, availability.resourceId)} color="teal">
                    <Icon name='pin' />{ <span>Select</span> }
                  </Button>
                  <br/>
                  <p>
                    <Icon name='address book outline' />
                    { <span>Status :<b>{this.stringStatus[availability.status]}</b></span> }
                  </p>
                </Card.Content>
              </Card> : <Card>
                          <Card.Content extra>
                            <p>
                              <Icon name='address book outline' />
                              { <span>Status :<b>COMPLETE</b></span> }
                            </p>
                          </Card.Content>
                        </Card>;
    }

    /**
     * return array displaying availability
     */
    getAvailabilityTable(availability) {
      const header =  <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Provider Address</Table.HeaderCell>
                          <Table.HeaderCell>Type of rent</Table.HeaderCell>
                          <Table.HeaderCell>Minimum Deposit</Table.HeaderCell>
                          <Table.HeaderCell>Commission</Table.HeaderCell>
                          <Table.HeaderCell>Free fees cancellation date</Table.HeaderCell>
                          <Table.HeaderCell>Available from</Table.HeaderCell>
                          <Table.HeaderCell>Available to</Table.HeaderCell>
                          <Table.HeaderCell>Status</Table.HeaderCell>
                          <Table.HeaderCell>metaData</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>;
        if (availability != null ) {
        return <Table celled>
                  {header}
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{availability.providerAddress}</Table.Cell>
                      <Table.Cell>{availability.aType}</Table.Cell>
                      <Table.Cell>{availability.minDeposit}</Table.Cell>
                      <Table.Cell>{availability.commission}</Table.Cell>
                      <Table.Cell>{availability.freeCancelDateTs.toISOString()}</Table.Cell>
                      <Table.Cell>{availability.startDateTs.toISOString()}</Table.Cell>
                      <Table.Cell>{availability.endDateTs.toISOString()}</Table.Cell>
                      <Table.Cell>{availability.status}</Table.Cell>
                      <Table.Cell>{availability.metaData}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
        }  else {
            return <Table celled>
                        {header}
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell colSpan="9">No publication selected</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                   </Table>
        }
    }
}
