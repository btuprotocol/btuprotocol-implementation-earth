export default class Availability {
    resourceId;
    providerAddress;
    aType;
    minDeposit;
    commission;
    freeCancelDateTs;
    startDateTs;
    endDateTs;
    status;
    metaDataLink;

    constructor(smartResponse) {
        if (smartResponse !== null) {
            const availability = (typeof smartResponse[1] !== 'undefined' && typeof smartResponse[1].c !== 'undefined') ?
                this.responseToAvailability(smartResponse) : smartResponse;
            if (availability != null) {
                this.providerAddress = availability.providerAddress;
                this.aType = availability.aType;
                this.minDeposit = availability.minDeposit;
                this.commission = availability.commission;
                this.freeCancelDateTs = availability.freeCancelDateTs;
                this.startDateTs = availability.startDateTs;
                this.endDateTs = availability.endDateTs;
                this.status = availability.status;
                this.metaDataLink = availability.metaDataLink;
            }
        }
    }

    responseToAvailability = function (response) {
        if (response === null || this.isNullProvider(response[0]))
            return null;
        let a = {};
        a.providerAddress = response[0];
        a.aType = response[1].c[0];
        a.minDeposit = response[2].c[0];
        a.commission = response[3].c[0];
        a.freeCancelDateTs = new Date(response[4].c[0]);
        a.startDateTs = new Date(response[5].c[0]);
        a.endDateTs = new Date(response[6].c[0]);
        const inSt = response[7].c[0];
        a.status = inSt > 2 ? 0 : inSt;
        a.metaDataLink = response[8];
        return a;
    }

    setId(id) {
        this.resourceId = id;
    }

    equalsTo(availability) {
        if (availability === null || typeof availability.resourceId === 'undefined')
            return -1;
        let check = true;
        check = check && availability.resourceId === this.resourceId;
        check = check && availability.providerAddress === this.providerAddress;
        check = check && availability.aType === this.aType;
        check = check && availability.minDeposit === this.minDeposit;
        check = check && availability.commission === this.commission;
        check = check && availability.freeCancelDateTs === this.freeCancelDateTs;
        check = check && availability.startDateTs === this.startDateTs;
        check = check && availability.endDateTs === this.endDateTs;
        check = check && availability.availabilityStatus === this.availabilityStatus;
        check = check && availability.metaDataLink === this.metaDataLink;
        return check;
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
            "\n Metadata to offchain implementation example: " + this.metaDataLink
    }

    isNullProvider(provider) {
        let check = provider === "0x0000000000000000000000000000000000000000";
        check = check && provider == null;
        check = check && typeof provider === 'undefined';
        return check;
    }
}
