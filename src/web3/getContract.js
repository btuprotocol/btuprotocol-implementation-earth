import init from 'truffle-contract'

const getContract = async (web3, contractDefinition) => {
  const contract = init(contractDefinition)
  contract.setProvider(web3.currentProvider)
  const instance = await contract.deployed()
  return instance
}
export default getContract
