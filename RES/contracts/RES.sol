pragma solidity ^0.4.19;

import "./BTU.sol";

contract RES {
    // Booking status
    enum AvailabilityStatus { AVAILABLE, REQUESTED, CONFIRMED }

    // Booking structure
    struct Availability {
        address                 _provider;
        address                 _booker;
        uint                    _type;                  // Type of Availability
        uint                    _minDeposit;            // minimum BTU deposit for booking this resource
        uint                    _commission;            // commission amount paid to booker in BTU
        uint                    _freeCancelDateTs;      // Limit date for a reservation cancellation
        uint                    _startDateTs;           // availability start date timestamps
        uint                    _endDateTs;             // availability end date timestamps
        AvailabilityStatus      _availabilityStatus;    // reservation status
        string                  _metaDataLink;          // Link to Meta Data of the bookable resource
    }

    // resourceID is the current id of the Availability. It is incremented as a new one is published
    uint private resourceID;
    mapping (uint => Availability) private availabilities;
    // Availabilities is a map where the key is the reourceID

    BTU private token;

    function RES(address btuAddress) public {
        token = BTU(btuAddress);
    }

    function setBTUToken(address btuAddress) external {
        require (btuAddress != address(0) && token == address(0));
        token = BTU(btuAddress);
    }

    event NewAvailabilityEvent(uint id);

    function publishAvailability(uint aType, uint minDeposit, uint commission, uint freeCancelDateTs,
                                 uint startDateTs, uint endDateTs, string metaDataLink)
    public returns (uint _resourceID) {

        var availability = availabilities[resourceID];
        availability._provider = msg.sender;
        availability._type = aType;
        availability._minDeposit = minDeposit;
        availability._commission = commission;
        availability._freeCancelDateTs = freeCancelDateTs;
        availability._startDateTs = startDateTs;
        availability._endDateTs = endDateTs;
        availability._availabilityStatus = AvailabilityStatus.AVAILABLE;
        availability._metaDataLink = metaDataLink;
        _resourceID = resourceID;
        NewAvailabilityEvent(resourceID++);
    }

    function getAvailabilityNumber() public view
    returns (uint number) {
        number = resourceID;
    }

    function getAvailability(uint _resourceID) public view
    returns (address provider, uint aType, uint minDeposit, uint commission,
             uint freeCancelDateTs, uint startDateTs, uint endDateTs,
             uint availabilityStatus, string metaDataLink) {

        provider = availabilities[_resourceID]._provider;
        aType = availabilities[_resourceID]._type;
        minDeposit = availabilities[_resourceID]._minDeposit;
        commission = availabilities[_resourceID]._commission;
        freeCancelDateTs = availabilities[_resourceID]._freeCancelDateTs;
        startDateTs = availabilities[_resourceID]._startDateTs;
        endDateTs = availabilities[_resourceID]._endDateTs;
        availabilityStatus = uint(availabilities[_resourceID]._availabilityStatus);
        metaDataLink = availabilities[_resourceID]._metaDataLink;
    }

    function requestReservation(uint _resourceID) public payable
    returns (bool status) {

        require(token.balanceOf(msg.sender) >= availabilities[_resourceID]._minDeposit);
        availabilities[_resourceID]._availabilityStatus = AvailabilityStatus.REQUESTED;
        availabilities[_resourceID]._booker = msg.sender;
        token.transferFrom(msg.sender, this, availabilities[_resourceID]._minDeposit);
        status = true;
    }

    function acceptReservation(uint _resourceID) public {
        require(msg.sender == availabilities[_resourceID]._provider);
        availabilities[_resourceID]._availabilityStatus = AvailabilityStatus.CONFIRMED;
    }

    function cancelReservation(uint _resourceID) public {
        // Check that msg.sender is the booker
        if (msg.sender == availabilities[_resourceID]._provider) {
            token.approve(this, availabilities[_resourceID]._minDeposit);
            token.transferFrom(this, availabilities[_resourceID]._booker, availabilities[_resourceID]._minDeposit);
            delete availabilities[_resourceID];
        } else if (msg.sender == availabilities[_resourceID]._booker) {
            token.approve(this, availabilities[_resourceID]._minDeposit);

            if (availabilities[_resourceID]._freeCancelDateTs > now) {
                token.transferFrom(this, availabilities[_resourceID]._provider, availabilities[_resourceID]._minDeposit);
            } else {
                token.transferFrom(this, availabilities[_resourceID]._booker, availabilities[_resourceID]._minDeposit);
            }
            availabilities[_resourceID]._availabilityStatus = AvailabilityStatus.AVAILABLE;
        }
    }

    function completeTransaction(uint _resourceID) public {
        require(msg.sender == availabilities[_resourceID]._provider);
        token.approve(this, availabilities[_resourceID]._minDeposit);
        token.transferFrom(this, availabilities[_resourceID]._booker, availabilities[_resourceID]._minDeposit);
        delete availabilities[_resourceID];
    }

    function rejectTransaction(uint _resourceID) public {
        require(msg.sender == availabilities[_resourceID]._provider);
        token.approve(this, availabilities[_resourceID]._minDeposit);
        token.transferFrom(this, availabilities[_resourceID]._booker, availabilities[_resourceID]._minDeposit);
        availabilities[_resourceID]._availabilityStatus = AvailabilityStatus.AVAILABLE;
    }

    function getReservationStatus(uint _resourceID) public view
    returns (uint status) {

        status = uint(availabilities[_resourceID]._availabilityStatus);
    }
}
