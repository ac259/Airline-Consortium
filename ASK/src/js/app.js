App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  
  init: function() {
    $.getJSON('http://localhost:3000/getProposals', function(data) {

      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');
      proposalLength = data.length;
      for (i = 0; i < data.length; i ++) {
        
        proposalTemplate.find('.panel-title').text(data[i].name);
        proposalTemplate.find('img').attr('src', data[i].image);

        proposalsRow.append(proposalTemplate.html());
        App.names.push(data[i].name);
      }
    });
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
}
};



$(function() {
  $(window).load(function() {
    App.init();
  });
});
