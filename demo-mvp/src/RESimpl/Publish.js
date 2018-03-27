import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import { Form, Label, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PublishStyles from '../styles/PublishStyles';
import DisplayOwnerAvailabilities from './DisplayOwnerAvailabilities';
import moment from 'moment';

class Publish extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            aType: 0,
            minDeposit: 1,
            commission: 2,
            freeCancelDateTs: new Date().getTime(),
            freeCancelDate: new Date(),
            startDateTs: new Date().getTime(),
            startDate: new Date(),
            endDateTs: new Date().getTime(),
            endDate: new Date(),
            status: 0,
            metaDataLink: "http://www.apartmentsdowntown.net.au/wp-content/uploads/2016/02/hub-apartments-08-570x380.jpg",
        };
        this.publish = this.publish.bind(this);
        this.handleATypeChange = this.handleATypeChange.bind(this);
        this.handleMinDepositChange = this.handleMinDepositChange.bind(this);
        this.handleCommissionChange = this.handleCommissionChange.bind(this);
        this.handleFreeCancelDateTsChange = this.handleFreeCancelDateTsChange.bind(this);
        this.handleStartDateTsChange = this.handleStartDateTsChange.bind(this);
        this.handleEndDateTsChange = this.handleEndDateTsChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleMetaDataLinkChange = this.handleMetaDataLinkChange.bind(this);
    }

    /**
     * view input / state mutator 
     */
    handleATypeChange(event) {
        this.setState({aType: event.target.value});
    }
    handleMinDepositChange(event) {
        this.setState({minDeposit: event.target.value});
    }
    handleCommissionChange(event) {
        this.setState({commission: event.target.value});
    }
    handleFreeCancelDateTsChange(event, date) {
        this.setState({freeCancelDateTs:  new Date().getTime()});
        this.setState({freeCancelDate: date});
    }
    handleStartDateTsChange(event, date) {
        this.setState({startDateTs: new Date().getTime()});
        this.setState({startDate: date});
    }
    handleEndDateTsChange(event, date) {
        this.setState({endDateTs: new Date().getTime()});
        this.setState({endDate: date});
    }
    handleStatusChange(event) {
        this.setState({status: event.target.value});
    }
    handleMetaDataLinkChange(event) {
        this.setState({metaDataLink: event.target.value});
    }

    /**
     * Transaction to RES contract
     */
    publish = async () => {
        const { accounts, RES } = this.props
        const response = await RES.publishAvailability(
            this.state.aType,
            this.state.minDeposit,
            this.state.commission,
            this.state.freeCancelDateTs,
            this.state.startDateTs,
            this.state.endDateTs,
            this.state.metaDataLink, {
            from: accounts[0]
        });
        console.log("publish availability: ", this.state, " blockchain response: ", response);
    }

    /**
     * View rendering
     */
    render() {
        const { accounts, RES, BTU } = this.props
        const styles = new PublishStyles();
        return (
            <div style={styles.div}>
              <div style={styles.leftDiv}>
                <form onSubmit={this.publish}>
                    <TextField 
                        id="aType" 
                        name="aType" 
                        type="number"
                        inputStyle={styles.input}
                        value={this.state.aType} 
                        onChange={this.handleATypeChange} 
                        floatingLabelText="Type of rent"
                        floatingLabelFixed={true}    
                    />
                    <br />
                    <TextField
                        id="minDeposit"
                        name="minDeposit"
                        type="number"
                        inputStyle={styles.input}
                        value={this.state.minDeposit}
                        onChange={this.handleMinDepositChange}
                        floatingLabelText="Minimum Deposit"
                        floatingLabelFixed={true}   
                    />
                    <br />
                    <TextField
                        id="commission"
                        name="commission"
                        type="number"
                        inputStyle={styles.input}
                        value={this.state.commission}
                        onChange={this.handleCommissionChange}
                        floatingLabelText="Commission"
                        floatingLabelFixed={true}   
                    />
                    <br />
                    <DatePicker 
                    hintText="Free cancellation deadline" 
                    id="freeCancelDateTs"
                    name="freeCancelDateTs"
                    value={this.state.freeCancelDate}
                    onChange={this.handleFreeCancelDateTsChange}
                    floatingLabelText="Free cancellation deadline"
                    floatingLabelFixed={true}  
                    />
                    <br />
                    <DatePicker 
                    hintText="Available from" 
                    id="startDateTs"
                    name="startDateTs"
                    value={this.state.startDate}
                    onChange={this.handleStartDateTsChange}
                    floatingLabelText="Available from"
                    floatingLabelFixed={true}  
                    />
                    <br />
                    <DatePicker 
                    hintText="Available to" 
                    id="endDateTs"
                    name="endDateTs"
                    value={this.state.endDate}
                    onChange={this.handleEndDateTsChange}
                    floatingLabelText="Available to"
                    floatingLabelFixed={true}  
                    />
                    <br />
                    <TextField
                        id="metaDataLink"
                        name="metaDataLink"
                        type="text"
                        inputStyle={styles.input}
                        value={this.state.metaDataLink}
                        onChange={this.handleMetaDataLinkChange}
                        floatingLabelText="Offchain Metadata"
                        floatingLabelFixed={true}   
                    />
                    <br />
                <RaisedButton label="Publish" onClick={this.publish}></RaisedButton>
              </form>
            </div>
            <div style={styles.rightDiv}>
			    <div>
					<DisplayOwnerAvailabilities accounts={accounts} RES={RES} BTU={BTU} />
				</div>
            </div>
        </div>
        )
    }
}
export default Publish;
