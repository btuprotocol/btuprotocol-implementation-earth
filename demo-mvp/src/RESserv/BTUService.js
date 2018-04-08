export default class BTUService {
    BTU = {}
    owner = "0xe538EFAEc69E48fBa53F7f567C56A303B0d925C3"
    constructor(BTU) {
        this.BTU = BTU
    }

    approvePromise(RES, availability, account) {
        const self = this
        return new Promise(function(resolve, reject) {
            self.BTU.methods.approve(RES.address, availability.minDeposit).send( { from: account, gas: 120000 }, function(err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    balanceOfPromise(account) {
        const self = this
        return new Promise(function(resolve, reject) {
            self.BTU.methods.balanceOf(account).call(function(err, data){
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    provideFiveBTUPromise(destAccount) {
        const self = this
        return new Promise(function(resolve, reject) {
            self.BTU.methods.approve(self.owner, 5).send( { from: destAccount, gas: 120000 }, function(err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                self.BTU.methods.transferFrom(self.owner, destAccount, 5).send({ from: destAccount, gas: 120000 }, function(err, data) {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
                resolve(data)
            })
        })
    }
}
