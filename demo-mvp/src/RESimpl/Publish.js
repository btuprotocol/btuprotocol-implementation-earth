import React from 'react';
import { Grid, Segment, Form, Label, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import ProviderPanel from './ProviderPanel';

class Publish extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            aType: 0,
            minDeposit: 2,
            commission: 1,
            freeCancelDateTs: new Date().getTime(),
            freeCancelDate: moment(),
            startDateTs: new Date().getTime(),
            startDate: moment(),
            endDateTs: new Date().getTime(),
            endDate: moment(),
            status: 0,
            metaData: "https://image.ibb.co/kqVvX7/logo.jpg",
        };
        this.publish = this.publish.bind(this);
        this.handleATypeChange = this.handleATypeChange.bind(this);
        this.handleMinDepositChange = this.handleMinDepositChange.bind(this);
        this.handleCommissionChange = this.handleCommissionChange.bind(this);
        this.handleFreeCancelDateTsChange = this.handleFreeCancelDateTsChange.bind(this);
        this.handleStartDateTsChange = this.handleStartDateTsChange.bind(this);
        this.handleEndDateTsChange = this.handleEndDateTsChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handlemetaDataChange = this.handlemetaDataChange.bind(this);
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
    handleFreeCancelDateTsChange(date) {
        this.setState({freeCancelDateTs: date.valueOf()});
        this.setState({freeCancelDate: date});
    }
    handleStartDateTsChange(date) {
        this.setState({startDateTs: date.valueOf()});
        this.setState({startDate: date});
    }
    handleEndDateTsChange(date) {
        this.setState({endDateTs: date.valueOf()});
        this.setState({endDate: date});
    }
    handleStatusChange(event) {
        this.setState({status: event.target.value});
    }
    handlemetaDataChange(event) {
        this.setState({metaData: event.target.value});
    }

    /**
     * Transaction to RES contract
     */
    publish = async () => {
        console.log('form submitted');
        const { accounts, RES } = this.props
        const response = await RES.publishAvailability(
            this.state.aType,
            this.state.minDeposit * Math.pow(10, 18),
            this.state.commission,
            this.state.freeCancelDateTs,
            this.state.startDateTs,
            this.state.endDateTs,
            this.state.metaData, {
            from: accounts[0]
        });
        console.log("publish availability: ", this.state, " blockchain response: ", response);
    }

    /**
     * View rendering
     */
    render() {
        const { accounts, RES, BTU } = this.props
        return (
            <Grid stackable columns={16}>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Segment>
                            <Form onSubmit={this.publish} width='equals' size='large'>
                                <Form.Input
                                    id="aType"
                                    name="aType"
                                    type="number"
                                    value={this.state.aType}
                                    onChange={this.handleATypeChange}
                                    label="Type of rent"
                                    />
                                <Form.Input
                                    id="minDeposit"
                                    name="minDeposit"
                                    type="number"
                                    value={this.state.minDeposit}
                                    onChange={this.handleMinDepositChange}
                                    label="Minimum Deposit"
                                />
                                <Form.Input
                                    id="commission"
                                    name="commission"
                                    type="number"
                                    value={this.state.commission}
                                    onChange={this.handleCommissionChange}
                                    label="Commission"
                                />
                                <Form.Field>
                                {/*
                                    react-datepicker style fix from https://github.com/Hacker0x01/react-datepicker/issues/1116
                                */}
                                    <style>
                                        {`.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
                                        padding-left: 0;
                                        padding-right: 0;
                                        }`}
                                    </style>
                                    <Label>Free cancellation deadline
                                    <DatePicker
                                        id="freeCancelDateTs"
                                        name="freeCancelDateTs"
                                        dateFormat="LLL"
                                        showTimeSelect
                                        selected={this.state.freeCancelDate}
                                        onChange={this.handleFreeCancelDateTsChange}
                                    />
                                    </Label>
                                    <Label>Available from
                                    <DatePicker
                                        id="startDateTs"
                                        name="startDateTs"
                                        dateFormat="LLL"
                                        selected={this.state.startDate}
                                        onChange={this.handleStartDateTsChange}
                                    />
                                    </Label>
                                    <Label>Available to
                                    <DatePicker
                                        id="endDateTs"
                                        name="endDateTs"
                                        dateFormat="LLL"
                                        selected={this.state.endDate}
                                        onChange={this.handleEndDateTsChange}
                                    /></Label>
                                </Form.Field>
                                <Form.Input
                                    id="metaData"
                                    name="metaData"
                                    type="text"
                                    value={this.state.metaData}
                                    onChange={this.handlemetaDataChange}
                                    label="Offchain Metadata"
                                />
                            <Button type="submit" color="olive">Publish</Button>
                        </Form>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Segment>
                        <div>
                            <ProviderPanel accounts={accounts} RES={RES} BTU={BTU} />
                        </div>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
}
export default Publish;
