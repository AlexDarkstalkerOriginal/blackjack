var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1eti1yuZuSh2hGqHVdLXoeCNqZbrJz6UF2";

var vm = new Vue({
  el: '#app',
  data: {   
    current: 0,
    bet_1: false,
    bet_2: true,
    bet_3: false,
    value_bet: 0,
    win: false,
    draw: false,
    lose: false,
    disabled_double: false,
    disabled_hit: false,
    disabled_stand: false,
    dealer_result: '',
    player_result: ''    
  },
  methods: {  	
  	double(current) {  		
  		vm.disabled_double = true;
  		var to = dappAddress;
		var value = vm.current;
		var callFunction = "dd";
		var callArgs = "[]";		
		nebPay.call(to, value, callFunction, callArgs, { 
		    listener: cbSearch	            
		});	 
  	},
  	hit() {  		    		
  		var to = dappAddress;
		var value = "0";
		var callFunction = "g";
		var callArgs = "[]";		
		nebPay.call(to, value, callFunction, callArgs, { 
		    listener: cbSearch	            
		});	        	
  	},
  	stand() {
  		var to = dappAddress;
		var value = "0";
		var callFunction = "f";
		var callArgs = "[]";		
		nebPay.call(to, value, callFunction, callArgs, { 
		    listener: cbSearch	            
		});	 
  	},
  	play() {
  		vm.disabled_double = false;
  		$('.new_card').fadeOut(500);  		
  		setTimeout(function remove() {  			
  			$('.new_card').remove();
  		}, 5000);
  		vm.value_bet = $('.active_bet').val();  		
  		$('.cards').css('opacity', '1');	
  		var to = dappAddress;
		var value = vm.value_bet;
		var callFunction = "i";
		var callArgs = "[]";		
		nebPay.call(to, value, callFunction, callArgs, { 
		    listener: cbSearch	            
		});	        		
  	}
  }
})

view_dealer_rank_one = 0;
view_dealer_rank_two = 0;
view_player_rank_one = 0;
view_player_rank_two = 0;
view_player_back_one = 0;
view_player_back_two = 0;
view_dealer_back_one = 0;
view_dealer_back_two = 0;

$(document).ready(function(){				  
	var to = dappAddress;
	var value = "0";
	var callFunction = "r";
	var callArgs = "";
	nebPay.simulateCall(to, value, callFunction, callArgs, { 
	    listener: cbSearch	            
	});	       	
})

setInterval(function reload() {		
	var to = dappAddress;
	var value = "0";
	var callFunction = "r";
	var callArgs = "";
	nebPay.simulateCall(to, value, callFunction, callArgs, { 
    	listener: cbSearch	            
	});
} , 2000);

function cbSearch(resp) {    
	var result = resp.result;			
    console.log("return of rpc call: " + JSON.stringify(result))
    if (result === ''){	        	
        $(".errNetwork").show();	  
    	$(".content").hide();
    } else{	            
	    try{
		    result = JSON.parse(result)
	    }catch (err){	    	
	    }

	    if (!!result){ 
	    	var last_index = result.length - 1;
        vm.current = (result[last_index].b/1000000000000000000);
	    	vm.dealer_result = result[last_index].CSC;
	    	vm.player_result = result[last_index].GSC;

	    	$('.dealer .cards .card').css('background','unset');
	    	$('.player .cards .card').css('background','unset');
	    	$('.dealer .cards .card').addClass('empty');
	    	$('.player .cards .card').addClass('empty');
	    	$.each(result[last_index].arrE,function(index,value){													
	    		getDealerCardRank(value);
	    		var suit = (value % 4);
	    		cardsuit = 0;
	    		if ( suit == 0 ) {
	    			cardsuit == 0;
	    		} else if ( suit == 1 ) {
	    			cardsuit = 57;
	    		} else if ( suit == 1 ) {
	    			cardsuit = 114;
	    		} else {
	    			cardsuit = 171;
	    		};
				$('.dealer .cards .card:nth-child(' +  (index + 1) + ')').css({'background':'url("img/cardrank.png") ' + dealer_rank + 'px ' + 0 + 'px, url("img/cardbase.png") ' + cardsuit + 'px 0px','background-size':'cover'});
				$('.dealer .cards .card:nth-child(' +  (index + 1) + ')').removeClass('empty');								
			})	    	
	    	$.each(result[last_index].arrG,function(index,value){
	    		getPlayerCardRank(value);	 
	    		var suit = (value % 4);
	    		var cardsuit = 0;
	    		if ( suit == 0 ) {
	    			cardsuit = 0;
	    		} else if ( suit == 1 ) {
	    			cardsuit = 71;
	    		} else if ( suit == 1 ) {
	    			cardsuit = 142;
	    		} else {
	    			cardsuit = 213;
	    		};			
				$('.player .cards .card:nth-child(' +  (index + 1) + ')').css({'background':'url("img/cardrank.png") ' + player_rank + 'px ' + 0 + 'px, url("img/cardbase.png") ' + cardsuit + 'px 0px','background-size':'cover'});
				$('.player .cards .card:nth-child(' +  (index + 1) + ')').removeClass('empty');
			})  	    

	    	if (result[last_index].game == 1 ) {	    		
	    		if (result[last_index].res == 'L') {
	    			vm.lose = true;
	    		} else if (result[last_index].res == 'W') {
	    			vm.win = true
	    		} else {
	    			vm.draw = true;
	    		};
	    		vm.disabled_double = true;
    			vm.disabled_hit = true;
    			vm.disabled_stand = true;
	    	} else {
	    		vm.disabled_double = false;
    			vm.disabled_hit = false;
    			vm.disabled_stand = false;	 
    			vm.draw = false;   	
    			vm.win = false;
    			vm.lose = false;
	    	}	    		    	
	    }
	}    
}

function getDealerCardRank(index) {
	var index = parseInt(index);
	dealer_rank = -1;

	if (index > 0 && 4 >= index) {
        dealer_rank = 0;  
    } 
    if ( index > 4 && 8 >= index ) {
        dealer_rank = -57;     
    }    
    if ( index > 8 && 12 >= index ) {
        dealer_rank = -114;        
    }    
    if ( index > 12 && 16 >= index ) {
        dealer_rank = -171;        
    }    
    if ( index > 16 && 20 >= index ) {
        dealer_rank = -228;        
    }    
    if ( index > 20 && 24 >= index ) {
        dealer_rank = -285;        
    }    
    if ( index > 24 && 28 >= index ) {
        dealer_rank = -342;        
    }    
    if ( index > 28 && 32 >= index ) {
        dealer_rank = -399;        
    }    
    if ( index > 32 && 36 >= index ) {
        dealer_rank = -456;        
    }    
    if ( index > 36 && 40 >= index ) {
        dealer_rank = -513;        
    }    
    if ( index > 40 && 44 >= index ) {
        dealer_rank = -570;        
    }    
    if ( index > 44 && 48 >= index ) {
        dealer_rank = -625;        
    }    
    if ( index > 48 && 52 >= index ) {
        dealer_rank = -683;    
    }
    return dealer_rank;
}

function getPlayerCardRank(index) {
	var index = parseInt(index);
	player_rank = -1;

	if (index > 0 && 4 >= index) {
        player_rank = 0;        
    } 
    if ( index > 4 && 8 >= index ) {
        player_rank = -71;        
    }    
    if ( index > 8 && 12 >= index ) {
        player_rank = -142;        
    }    
    if ( index > 12 && 16 >= index ) {
        player_rank = -213;        
    }    
    if ( index > 16 && 20 >= index ) {
        player_rank = -284;        
    }    
    if ( index > 20 && 24 >= index ) {
        player_rank = -355;        
    }    
    if ( index > 24 && 28 >= index ) {
        player_rank = -426;        
    }    
    if ( index > 28 && 32 >= index ) {
        player_rank = -497;        
    }    
    if ( index > 32 && 36 >= index ) {
        player_rank = -568;        
    }    
    if ( index > 36 && 40 >= index ) {
        player_rank = -639;        
    }    
    if ( index > 40 && 44 >= index ) {
        player_rank = -710;        
    }    
    if ( index > 44 && 48 >= index ) {
        player_rank = -781;        
    }    
    if ( index > 48 && 52 >= index ) {
        player_rank = -852;        
    }    
    
	return player_rank;	
}


$('.bet').click(function(){
	if ($(this).hasClass('active_bet')){ 		 				
	} else { 				
		$('.bet').removeClass('active_bet');
		$(this).addClass('active_bet');	 			
	};
})

window.onload = function(){					
	if(typeof(webExtensionWallet) === "undefined"){	    
        $(".noExtension").show();	  
        $(".content").hide();
    }else{
    }
};	
