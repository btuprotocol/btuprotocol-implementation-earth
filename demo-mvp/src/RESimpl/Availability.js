export default class Availability {
    resourceId
    providerAddress
    aType
    minDeposit
    commission
    freeCancelDateTs
    startDateTs
    endDateTs
    status
    metaData

    constructor(smartResponse) {
        if (smartResponse !== null) {
            this.providerAddress = smartResponse.provider
            this.aType = +smartResponse.aType
            this.minDeposit = +smartResponse.minDeposit
            this.commission = +smartResponse.commission
            this.freeCancelDateTs = new Date(+smartResponse.freeCancelDateTs)
            this.startDateTs = new Date(+smartResponse.startDateTs)
            this.endDateTs = new Date(+smartResponse.endDateTs)
            this.status = +smartResponse.availabilityStatus
            this.metaData = smartResponse.metaDataLink
        }
    }

    responseToAvailability = function (response) {
        if (response === null || this.isNullProvider(response[0]))
            return null
        let a = {}
        a.providerAddress = response[0]
        a.aType = +response[1]
        a.minDeposit = +response[2]
        a.commission = +response[3]
        a.freeCancelDateTs = new Date(+response[4])
        a.startDateTs = new Date(+response[5])
        a.endDateTs = new Date(+response[6])
        const inSt = +response[7]
        a.status = inSt > 2 ? 0 : inSt
        a.metaData = response[8]
        return a
    }

    setId(id) {
        this.resourceId = id
    }

    equalsTo(availability) {
        if (availability === null || typeof availability.resourceId === 'undefined')
            return -1
        let check = true
        check = check && availability.resourceId === this.resourceId
        check = check && availability.providerAddress === this.providerAddress
        check = check && availability.aType === this.aType
        check = check && availability.minDeposit === this.minDeposit
        check = check && availability.commission === this.commission
        check = check && availability.freeCancelDateTs === this.freeCancelDateTs
        check = check && availability.startDateTs === this.startDateTs
        check = check && availability.endDateTs === this.endDateTs
        check = check && availability.availabilityStatus === this.availabilityStatus
        check = check && availability.metaData === this.metaData
        return check
    }

    toString() {
        return "\nProvider node address: " + this.providerAddress +
            "\nResource id: " + this.resourceId +
            "\nResource type: " + this.aType +
            "\nMinimum Deposit: " + this.minDeposit +
            "\nComission: " + this.commission +
            "\nCan cancel for free until: " + this.freeCancelDateTs +
            "\nCan reserve from: " + this.startDateTs.toISOString() +
            "\nUntil: " + this.endDateTs.toISOString() +
            "\nAvailability status: " + this.status +
            "\n Metadata to offchain implementation example: " + this.metaData
    }

    isNullProvider(providerAddress) {
        if (providerAddress === null) {
            providerAddress = this.providerAddress
        }
        let check = (providerAddress === "0x0000000000000000000000000000000000000000")
        check = check || providerAddress === null
        return check
    }
}