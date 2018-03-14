import React from 'react';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Availability from '../RESimpl/Availability';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

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
     *  
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
     * return a jsx GridTile based on availability
     */
    getTileFromAvailability(availability, callback) {
       return <GridTile
        key={ availability.resourceId }
        title={ "Booking " + availability.resourceId }
        subtitle={ <span>Status :<b>{this.stringStatus[availability.status]}</b></span> }
        actionIcon={
            <IconButton onClick={(e) => callback(e, availability.resourceId)}>
                <StarBorder color="white" />
            </IconButton>
        }
        >
        <img src={availability.metaDataLink} alt={availability.metaDataLink} />
        </GridTile>
    }

    /**
     * return the array displaying
     * the focused availability  
     */
    getAvailabilityTable(availability) {
        const styles = {
          paper: {
            display: 'inline-block',
            margin: '16px 32px 16px 0',
            float: "left",
          }
        };
        if (availability != null ) {
        return <Paper style={styles.paper}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderColumn>Provider Address</TableHeaderColumn>
                      <TableHeaderColumn>Type of rent</TableHeaderColumn>
                      <TableHeaderColumn>Minimum Deposit</TableHeaderColumn>
                      <TableHeaderColumn>Commission</TableHeaderColumn>
                      <TableHeaderColumn>Free fees cancellation date</TableHeaderColumn>
                      <TableHeaderColumn>Available from</TableHeaderColumn>
                      <TableHeaderColumn>Available to</TableHeaderColumn>
                      <TableHeaderColumn>Status</TableHeaderColumn>
                      <TableHeaderColumn>MetaDataLink</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow> 
                      <TableRowColumn>{availability.providerAddress}</TableRowColumn>
                      <TableRowColumn>{availability.aType}</TableRowColumn>
                      <TableRowColumn>{availability.minDeposit}</TableRowColumn>
                      <TableRowColumn>{availability.commission}</TableRowColumn>
                      <TableRowColumn>{availability.freeCancelDateTs.toISOString()}</TableRowColumn>
                      <TableRowColumn>{availability.startDateTs.toISOString()}</TableRowColumn>
                      <TableRowColumn>{availability.endDateTs.toISOString()}</TableRowColumn>
                      <TableRowColumn>{availability.status}</TableRowColumn>
                      <TableRowColumn>{availability.metaDataLink}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>  
        }  else {
            return <Paper style={styles.paper}>
                      <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHeaderColumn>Provider Address</TableHeaderColumn>
                            <TableHeaderColumn>Type of rent</TableHeaderColumn>
                            <TableHeaderColumn>Minimum Deposit</TableHeaderColumn>
                            <TableHeaderColumn>Commission</TableHeaderColumn>
                            <TableHeaderColumn>Free fees cancellation date</TableHeaderColumn>
                            <TableHeaderColumn>Available from</TableHeaderColumn>
                            <TableHeaderColumn>Available to</TableHeaderColumn>
                            <TableHeaderColumn>Status</TableHeaderColumn>
                            <TableHeaderColumn>MetaDataLink</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableRowColumn colSpan="9">No publication selected</TableRowColumn>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </Paper>
        }      
    }
}
