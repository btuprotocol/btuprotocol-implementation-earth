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
      const accounts = await getAccounts(web3)
      if (typeof accounts[0] === 'undefined' || accounts[0] === null) {
        throw new Error('Ethreum account not found. Connect throught metamask, see tutorial', 'Web3Container.js', 16);
      }
      const BTUTokenSale = await getContract(web3, BTUTokenSaleabstraction);
      const RES = await getContract(web3, RESabstraction);
      const btuAddress = await BTUTokenSale.btuToken.call();
      console.log('BTU address = ' + btuAddress);
      const BTU = new web3.eth.Contract(BTUabstraction.abi, btuAddress);
      BTU.methods.balanceOf(accounts[0]).call(function(err, res) {
          console.log("You BTU balance = " + res);
      });
      BTU.BTUts = BTUTokenSale.address
      this.setState({ web3, accounts, RES, BTU });
    } catch (error) {
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
