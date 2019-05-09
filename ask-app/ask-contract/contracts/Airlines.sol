pragma solidity 0.5.0;

contract Airlines{
   address public chairPerson;
   mapping(address=>uint) balance;
   uint deposit;
   mapping(address  => User) registeredUsers;
   struct User {
       bytes32 source;
       bytes32 destination;
       uint SeatNo;
       bool exists;
   }

   constructor () public {
        chairPerson = msg.sender;
   }
  
    function Register(address airline) public payable{
        if(registeredUsers[airline].exists == false) { 
        require(airline==msg.sender,"Self Registration");
        registeredUsers[airline].exists = true;
        // balance[airline] = msg.value;
        // deposit=balance[airline]-50000000000000000000;
        // balance[airline]=balance[msg.sender]-50000000000000000000;
        }
        else{
             require(!registeredUsers[airline].exists, "Already registered");
         }
   }
   function UnRegister(address Airline_address) public onlyChairperson {
        // balance[Airline_address]=balance[msg.sender]+50e18;
        registeredUsers[Airline_address].exists = false;
       
   }
   function Request(bytes32 source,bytes32 destination, uint seats) public  isRegisteredAirline {
       registeredUsers[msg.sender].source=source;
       registeredUsers[msg.sender].destination=destination;
       registeredUsers[msg.sender].SeatNo= seats;
       registeredUsers[msg.sender].exists= true;
       
   }
   // function Request(address Airline_address,bytes32 source,bytes32 destination, uint seats) public {
   //     registeredUsers[Airline_address].source=source;
   //     registeredUsers[Airline_address].destination=destination;
   //     registeredUsers[Airline_address].SeatNo= seats;
   //     registeredUsers[Airline_address].exists= true;
       
   // }
   function Response(address Airline_address, bytes32  _source,bytes32  _destination,uint  _seats)public isRegisteredAirline{
       registeredUsers[Airline_address].source=_source;
       registeredUsers[Airline_address].destination=_destination;
       registeredUsers[Airline_address].SeatNo=_seats;
   }
   function settlePayment(address toAirline) public payable{
       balance[msg.sender] -= msg.value;
       balance[toAirline] += msg.value;
   }
 
   function getBalance(address Airline_address) public view returns(uint256){
      return balance[Airline_address];
   }
   modifier isRegisteredAirline{
      require(registeredUsers[msg.sender].exists, "Not registered");
      _;
  }

   modifier onlyChairperson{
       require(msg.sender==chairPerson, "Has to be the chairperson");
       _;
   }
}