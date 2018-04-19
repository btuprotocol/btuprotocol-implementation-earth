import React from "react"
import {
  Accordion,
  Icon,
  Grid,
  Image,
  Message,
  Divider
 } from 'semantic-ui-react'
import metamaskLogo from '../img/metamask_icon.png'
import metaToRopsten from '../img/metamask_to_ropsten.png'
import metaCopyClip from '../img/metamask_copy_to_clipboard.png'
import metaAddToken from '../img/metamask_add_token.png'
import btuLogo from '../img/logo.png'
import assign from '../img/assign.png'
import publish from '../img/publish.png'
import availabilityDisplay from '../img/availabilities_display.png'
import bookerAction from '../img/booker_action.png'
import available from '../img/availability_available.png'
import fiveTokens from '../img/accountWithFive.png'
import requested from '../img/requested.png'
import providerRequested from '../img/provider_requested.png'
import BTUts from '../img/btuTokenSaleAddr.png'

class Tutorial extends React.Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }
  render() {
    const { activeIndex } = this.state
    return (<Accordion>
                  <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                    <Icon name='dropdown' />
                    Connect <a target="_blank" rel="noopener noreferrer" href="https://metamask.io">Metamask</a> to ropsten and get some ether
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 0}>
                    <Grid columns={16} verticalAlign="middle" padded="horizontally" centered divided>
                      <Grid.Row divided>
                        <Grid.Column width={2}>
                          <Image src={metamaskLogo} alt='metamask logo' size='medium' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={6}>
                          <Message  attached="bottom" color="grey" size="large">
                            <Message.Header>Setup <a rel="noopener noreferrer" target="_blank" href="https://metamask.io/">Metamask</a></Message.Header>
                            <p>
                              Welcome on this demo application implementing BTU protocol.<br/>
                              The first step to enjoy the workflow is to configure your ethereum client
                            </p>
                          </Message>
                        </Grid.Column>
                        <Grid.Column width={2}>
                          <Image src={metaToRopsten} alt='metamask connect to ropsten' size='medium' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={6}>
                          <Message color="blue" size="large">
                            <Message.Header>Connect to ropsten</Message.Header>
                            <p>Click on the top left corner to select the Ropsten network</p>
                          </Message>
                        </Grid.Column>
                      </Grid.Row>
                      <Divider section />
                      <Grid.Row divided>
                        <Grid.Column width={2}>
                          <Image src={metaCopyClip} alt='Copy address to clipboard' size='medium' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={6}>
                          <Message color="grey" size="large">
                            <Message.Header>
                              Obtain ether
                            </Message.Header>
                            <p>
                              Copy your account address and go to _ <a target="_blank" rel="noopener noreferrer" href="http://faucet.ropsten.be:3001/">ropsten faucet</a> _ to obtain some ether
                            </p>
                          </Message>
                        </Grid.Column>
                        <Grid.Column width={2}>
                          <Image src={metaAddToken} alt='Add BTU token to metamask' size='medium' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={6}>
                          <Message color="blue" size="large">
                            <Message.Header>
                              Add BTU token to metamask
                            </Message.Header>
                            <p>
                              To properly follow token movements, click on metamask 'token' panel and add the following address: <br/>
                            </p>
                            <pre>0x141227d8fcc34fd830553cf6a3a3078de8d97e25</pre>
                          </Message>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row divided textAlign="center">
                        <Grid.Column width={16}>
                          <h3>If you are testing alone, repeat the operation with another account.</h3>
                        </Grid.Column>
                      </Grid.Row>
                      </Grid>
                      </Accordion.Content>
                      <Accordion.Title  active={activeIndex === 1} index={1} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Get some BTU
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 1}>
                      <Grid columns={16} verticalAlign="middle" padded="horizontally" centered divided>
                        <Grid.Row divided>
                          <Grid.Column width={2}>
                            <Image src={btuLogo} alt='BTU logo' size='medium' floated='left' wrapped />
                          </Grid.Column>
                          <Grid.Column width={5}>
                            <Message color="grey" size="large">
                              <Message.Header>Get some BTU on ropsten</Message.Header>
                              <p>
                                This is the tricky part.. <br/>If you are testing alone, you need at list two accounts with BTU.<br/>
                              </p>
                            </Message>
                          </Grid.Column>
                          <Grid.Column width={9} textAlign="center" verticalAlign="middle">
                            <Image src={assign} alt='assign' size='huge' centered/>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row divided>
                          <Grid.Column width={4}>
                            <Image src={BTUts} alt='BTUTokenSale addr' size='medium' floated='left' wrapped />
                          </Grid.Column>
                          <Grid.Column width={4}>
                            <Message color="grey" size="large">
                              <Message.Header>Get some BTU on custom RPC</Message.Header>
                              <p>
                                You must copy the BTUTokenSale address
                                (should appear on booker and provider information panels, logged during build and in browser console)
                                And call ./local.sh [BTUTokenSale address] in demo-mvp folder.
                                It will provide all local accounts.
                              </p>
                            </Message>
                          </Grid.Column>
                          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
                            <Image src={assign} alt='assign' size='huge' centered/>
                          </Grid.Column>
                        </Grid.Row>
                        </Grid>
                      </Accordion.Content>
                      {/*
                      WORKFLOW
                      */}
                      <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Workflow
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 2}>
                        {/*
                        PUBLISH / CONSULT
                      */}
                       <Grid columns={16} verticalAlign="middle" padded="horizontally" centered divided>
                        <Grid.Row>
                          <Grid.Column width={3}>
                            <Image src={publish} alt='publish availability' size='medium' floated='left' wrapped />
                          </Grid.Column>
                          <Grid.Column width={5}>
                            <Message color="blue" size="large">
                              <Message.Header>
                                As provider, publish an availability
                              </Message.Header>
                              <p>
                                On the provider panel, you can publish an availability on blockchain.
                                By submitting the form, metamask will ask you to confirm the transaction.
                                After a few time, you'll see the changement reflecting on both, booker and provider panels.
                              </p>
                            </Message>
                          </Grid.Column>
                          <Grid.Column width={3}>
                            <Image src={availabilityDisplay} alt='availability display' size='large' floated='left' wrapped />
                          </Grid.Column>
                          <Grid.Column width={5}>
                            <Message color="grey" size="large">
                              <Message.Header>
                                See and select new availability
                              </Message.Header>
                              <p>
                                Switch account, refresh the page to load your account change
                                and watch in booker panel the newly created availability.
                                You'll find the provider's ethereum address, the period of availibility,
                                the date and time until cancellation is fees free, the deposit amount, the type
                                of availability (symbolized by a number). The picture is render from an url also registered
                                in blockchain but it could be a link to an offchain implementation on IPFS for example...
                              </p>
                            </Message>
                          </Grid.Column>
                        </Grid.Row>
                        {/*
                          RESERVE / CONSTAT
                        */}
                      <Grid.Row divided>
                        <Grid.Column width={2}>
                          <Image src={fiveTokens} alt='metamask profile with five BTUs' size='large' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={2}>
                          <Image src={available} alt='concerned availability' size='large' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Message color="blue" size="large">
                            <Message.Header>
                              Watch details
                            </Message.Header>
                            <p>
                              We see that the deposit amount reach 2 BTUs, we own 5, so we can ask for a reservation.
                            </p>
                          </Message>
                        </Grid.Column>
                        <Grid.Column width={3}>
                          <Image src={bookerAction} alt='booker actions' size='large' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={5}>
                          <Message color="grey" size="large">
                            <Message.Header>
                              Select an availability
                            </Message.Header>
                            <p>
                              Booker's actions aren't disabled anymore.
                              You can ask on blockchain the status of the availability or send a resevation request.
                            </p>
                          </Message>
                        </Grid.Column>
                      </Grid.Row>
                      {/*
                      REQUEST / PROVIDER
                      */}
                      <Grid.Row divided>
                        <Grid.Column width={3}>
                          <Image src={requested} alt='requested image' size='large' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={5}>
                          <Message color="blue" size="large">
                            <Message.Header>
                              Request an availability
                            </Message.Header>
                            <p>
                              The RES contract will play the escrow and keep your tokens.
                              Not implemented on this current version, but if you honor the reservation,
                              you should receive the commission amount in addition to your deposit.
                              Both mechanisms incentive good behavior.
                            </p>
                          </Message>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Image src={providerRequested} alt='provider requested' size='huge' floated='left' wrapped />
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Message color="grey" size="large">
                            <Message.Header>
                              Come back on provider account
                            </Message.Header>
                            <p>
                              You can switch again to your previous account on metamask.
                              Don't forget to refresh the page to let the app being aware of your account change.
                              Try accepting then confirming the reservation through metamask.
                              Nothing prevent to complete before accepting. Accept switch the status.
                              Complete give back the deposit and delete reservation informations.
                            </p>
                          </Message>
                        </Grid.Column>
                      </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                  </Accordion>
      )
    }
  }
  export default Tutorial
