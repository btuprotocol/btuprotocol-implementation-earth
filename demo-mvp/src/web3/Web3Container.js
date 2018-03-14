import React from 'react'
import getWeb3 from './Web3'
import getAccounts from './getAccounts'
import getContract from './getContract'
import RESabstraction from '../RES/RES.json'
import BTUabstraction from '../BTU/BTU.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, RES: null, BTU: null }

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      const accounts = await getAccounts(web3)
      const BTU = await getContract(web3, BTUabstraction)
      const RES = await getContract(web3, RESabstraction)
      try{
        RES.setBTUToken(BTU.address, {from: accounts[0], gas: 120000});
      } catch (error) {
        console.log("Failed to setBTU address");
      }
      this.setState({ web3, accounts, RES, BTU })
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, RES, BTU } = this.state
    return web3 && accounts && RES && BTU
      ? this.props.render({ web3, accounts, RES, BTU })
      : this.props.renderLoading()
  }
}
