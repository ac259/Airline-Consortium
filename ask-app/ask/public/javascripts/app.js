// <<<<<<< HEAD
App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Airlines.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var askArtifact = data;
    console.log(askArtifact);
    console.log('Inside the initContract');
    App.contracts.ask = TruffleContract(askArtifact);

    // Set the provider for our contract
    App.contracts.ask.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '#register', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad); });
    $(document).on('click', '#unregister', function(){ var ad = $('#enter_address').val(); App.handleUnregister(ad); });
    $(document).on('click', '#Request_check', App.handleRequest); 
    $(document).on('click', '#Response', App.handleResponse);
    $(document).on('click', '#payment', App.handlePayment);
    $(document).on('click', '#balance', function(){ var ad = $('#enter_address').val(); App.handleBalance(ad); });
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        //if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        //}
      });
    });
  },

  getChairperson : function(){
    App.contracts.ask.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      if(App.chairPerson != App.currentAccount){
        jQuery('#address_div').css('display','none');
        jQuery('#register_div').css('display','none');
      }else{
        jQuery('#address_div').css('display','block');
        jQuery('#register_div').css('display','block');
      }
    })
  },
  
  handleRegister: function(addr){
    console.log(addr);
    console.log('Inside the register function!');
    var askInstance;
    App.contracts.ask.deployed().then(function(instance) {
      askInstance = instance;
      return askInstance.Register(addr);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " registration done successfully")
            else
            alert(addr + " registration not done successfully due to revert")
        } else {
            alert(addr + " registration failed")
        }   
    });
},

handleUnregister: function(addr){
    console.log(addr);
    console.log('Inside the unregister function!');
    var askInstance;
    App.contracts.ask.deployed().then(function(instance) {
      askInstance = instance;
      return askInstance.UnRegister(addr);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " unregistration done successfully")
            else
            alert(addr + " unregistration not done successfully due to revert")
        } else {
            alert(addr + " unregistration failed")
        }   
    });
},
handleResponse: function(){
    console.log("Inside Handle Response");
    var fromCity = $("#fromCityR").val();
    var toCity = $("#toCityR").val();
    var seats = $("#seatsR").val();
    seats = parseInt(seats);
    var fromCityASCII = web3.fromAscii(fromCity);
    var toCityASCII = web3.fromAscii(toCity);
    console.log(fromCity);
    console.log(toCity);
    console.log(seats);
    console.log(fromCityASCII);
    var askInstance;
    App.contracts.ask.deployed().then(function(instance) {
      askInstance = instance;
      var address = "0x88658926d321E24A1E9055787CE482083D6498F2";
      return askInstance.Response(address, fromCityASCII,toCityASCII,seats);
      //return askInstance.methods.Request(fromCity, toCity, seats).call();
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(" Response done successfully")
            else
            alert(" Response not done successfully due to revert")
        } else {
            alert(" Response failed")
        }   
    });
    // ,{from: addr, value: 100},function(err,result){});
// });
},

handlePayment: function(){
    console.log("Inside Handle payment");
    var msgValue = $("#message-value").val();
    msgValue = parseInt(msgValue);
    var askInstance;
    App.contracts.ask.deployed().then(function(instance) {
      askInstance = instance;
      var address = "0x88658926d321E24A1E9055787CE482083D6498F2";
      return askInstance.settlePayment(address,{value:web3.toWei(msgValue, "ether")});
      //return askInstance.methods.Request(fromCity, toCity, seats).call();
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(" Payment done successfully")
            else
            alert(" Payment not done successfully due to revert")
        } else {
            alert(" Payment failed")
        }   
    });
    // ,{from: addr, value: 100},function(err,result){});
// });
},

handleBalance: function(addr){
    console.log("Inside balance");
    // var msgValue = $("#message-value").val();
    // msgValue = parseInt(msgValue);
    var askInstance;
    App.contracts.ask.deployed().then(function(instance) {
      askInstance = instance;
      var address = "0x88658926d321E24A1E9055787CE482083D6498F2";
      var address1 = "0xED57c5915847182672033DEc76A5d0F95A50e388"
      return askInstance.getBalance(addr);
      //return askInstance.methods.Request(fromCity, toCity, seats).call();
    }).then(function(result, err){
        if(result){
            console.log(result.c[0]);
            alert("balance is"+ result.c[0])
        //     if(parseInt(result.receipt.status) == 1)
        //     alert(" Payment done successfully")
        //     else
        //     alert(" Payment not done successfully due to revert")
        // } else {
        //     alert(" Payment failed")
        }   
    });
    // ,{from: addr, value: 100},function(err,result){});
// });
},

handleRequest: function(){
    console.log("Inside Handle Request");
    var fromCity = $("#fromCity").val();
    var toCity = $("#toCity").val();
    var seats = $("#seats").val();
    seats = parseInt(seats);
    var fromCityASCII = web3.fromAscii(fromCity);
    var toCityASCII = web3.fromAscii(toCity);
    console.log(typeof(fromCityASCII));
    console.log(typeof(toCity));
    console.log(typeof(seats));
    console.log(fromCityASCII);
    var askInstance;
    App.contracts.ask.deployed().then(function(instance) {
      askInstance = instance;
      var address = "0xED57c5915847182672033DEc76A5d0F95A50e388";
      return askInstance.Request(fromCityASCII,toCityASCII,seats);
      //return askInstance.methods.Request(fromCity, toCity, seats).call();
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(" Request done successfully")
            else
            alert(" Request not done successfully due to revert")
        } else {
            alert(" Request failed")
        }   
    });
    // ,{from: addr, value: 100},function(err,result){});
// });
}
};




$(function() {
  $.ready.then(function(){
    App.init();
  })
    
  
});

