import React from 'react'
import getWeb3 from './Web3'
import getAccounts from './getAccounts'
import getContract from './getContract'
import RESabstraction from '../RES/RES.json'
import BTUabstraction from '../BTU/BTU.json'
import BTUTokenSaleabstraction from '../BTU/BTUTokenSale.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, RES: null, BTU: null }

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      console.log(web3)
      const accounts = await getAccounts(web3)
      const BTUTokenSale = await getContract(web3, BTUTokenSaleabstraction);
      const RES = await getContract(web3, RESabstraction);
      const btuAddress = await BTUTokenSale.btuToken.call();
      console.log('BTUAddr = ' + btuAddress);
      const BTU = new web3.eth.Contract(BTUabstraction.abi, btuAddress);
      BTU.methods.balanceOf(accounts[0]).call(function(err, res) {
          console.log("balance = " + res);
      });
      this.setState({ web3, accounts, RES, BTU });
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
