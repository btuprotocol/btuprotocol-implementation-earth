export default class RESService {
    RES = {}
    constructor(RES) {
        this.RES = RES
    }

    getAvailabilityNumberPromise() {
        const self = this
        return new Promise(function (resolve, reject) {
            self.RES.methods.getAvailabilityNumber().call(function (err, count) {
                if (err !== null) {
                    console.log(err)
                    reject(err)
                }
                resolve(count)
            })
        })
    }

    getAvailabilityPromise(i) {
        const self = this
        return new Promise(function (resolve, reject) {
            self.RES.methods.getAvailability(i).call(function (err, sr) {
                if (err !== null) {
                    console.log(err)
                    reject(err)
                }
                resolve(sr)
            })
        })
    }

    getReservationStatusPromise(i) {
        const self = this
        return new Promise(function (resolve, reject) {
            self.RES.methods.getReservationStatus(i).call(function (err, sr) {
                if (err !== null) {
                    console.log(err)
                    reject(err)
                }
                resolve(sr)
            })
        })
    }

    requestReservationPromise(selectedResource, account) {
        const self = this
        return new Promise(function (resolve, reject) {
            self.RES.methods.requestReservation(selectedResource).send({
                from: account,
                gas: 120000
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    acceptReservationPromise(selectedResource, account) {
        const self = this
        return new Promise(function (resolve, reject) {
            self.RES.methods.acceptReservation(selectedResource).send({
                from: account,
                gas: 360000
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    completeReservationPromise(selectedResource, account) {
        const self = this
        return new Promise(function (resolve, reject) {
            self.RES.methods.completeTransaction(selectedResource).send({
                from: account,
                gas: 360000
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            })
        })
    }
}