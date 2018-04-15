/*
 * File: BTUService.js
 * Project: Angular Golang Api Server/Dive Cruise Calendar
 * File Created: Sunday, 15th April 2018 5:23:53 pm
 * Author: Aurélien Castellarnau (castellarnau.a@gmail.com)
 * -----
 * Last Modified: Sunday, 15th April 2018 5:24:14 pm
 * Modified By: Aurélien Castellarnau (castellarnau.a@gmail.com>)
 * -----
 * Copyright © 2018 - 2018 WebFace, WebFace
 */

export default class BTUService {
    BTU = {}
    owner = "0xe538EFAEc69E48fBa53F7f567C56A303B0d925C3"
    constructor(BTU) {
        this.BTU = BTU
    }

    approvePromise(RES, availability, account) {
        const self = this
        return new Promise(function(resolve, reject) {
            self.BTU.methods.approve(RES.address, availability.minDeposit).send( { from: account, gas: 1200000 }, function(err, data) {
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

    /*
    provideFiveBTUPromise(destAccount) {
        const self = this
        return new Promise(function(resolve, reject) {
            self.BTU.methods.approve(self.owner, 5).send( { from: destAccount, gas: 1200000 }, function(err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                self.BTU.methods.transferFrom(self.owner, destAccount, 5).send({ from: destAccount, gas: 1200000 }, function(err, data) {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
                resolve(data)
            })
        })
    }
    */
}
