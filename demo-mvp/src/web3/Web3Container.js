import React from 'react'
import getWeb3 from './Web3'
import getAccounts from './getAccounts'
import RESabstraction from '../RES//RES.json'
import BTUabstraction from '../BTU/BTU.json'
import BTUTokenSaleabstraction from '../BTU/BTUTokenSale.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, RES: null, BTU: null }

  async componentDidMount () {
    const self = this
    try {
      const web3 = await getWeb3()
      const accounts = await getAccounts(web3)
      const BTUTokenSale = new web3.eth.Contract(BTUTokenSaleabstraction.abi, "0x3d69590c84b6395939fc153a064951f391c8bf18")
      const RES =  new web3.eth.Contract(RESabstraction.abi, "0x1d57c7e7dd9f1b35b2625a35a697ac1c4b114cd5")
      BTUTokenSale.methods.btuToken().call(function(err, addr){
        if (err != null) {
          console.log(err)
          return
        }
        const btuAddress = addr
        console.log('BTUAddr = ' + btuAddress + " web3: ", web3)
        const BTU = new web3.eth.Contract(BTUabstraction.abi, btuAddress)
        self.setState({ web3, accounts, RES, BTU })
      })
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
