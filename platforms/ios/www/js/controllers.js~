

angular.module('starter.controllers', [])


.controller('SignupCtrl',function($scope, $http,$ionicLoading,$ionicPopup,$cordovaSQLite,Chats,socket) {

$ionicLoading.hide();

$scope.showAlert = function(msg) {

   var alertPopup = $ionicPopup.alert({

      title:'Signup Errors!',
      template: msg,

   });

   alertPopup.then(function(res) {


   });

};


$scope.showmesaage=function(msg) {

   var alertPopup = $ionicPopup.alert({

      title:'Sign up!',
      template: msg,

   });

   alertPopup.then(function(res) {
	
	window.location.href="#/";

   });

};

$scope.signupform=function(){

$ionicLoading.show({
                template: 'Signing Up...'
            });

var result={};
		result.email=$scope.email.trim();
		result.password=$scope.password.trim();
		result.first_name=$scope.fname.trim();
		result.last_name=$scope.lname.trim();
		result.display_name=$scope.displayname.trim();
		result.pic='';
		result.status='online';

	Chats.adduser(result).then(function(res){
        

	if(res=='400')
	{
	$scope.showAlert('Email Already Exist');
	}
	else if(res=='200')
	{
	$scope.showmesaage('You may login now');
	}
	else
	{
	$scope.showAlert('Network Error');
	}
	
	$ionicLoading.hide();

 	 });


};

})
.controller('SigninCtrl',function($scope, $http,$ionicLoading,$ionicPopup,$cordovaSQLite,chatappdb,socket) {

$ionicLoading.hide();
 var token = window.localStorage.getItem("_id");
 var userdata = window.localStorage.getItem("userdata");
console.log(userdata);
 if(token!=null && userdata!=null )
	{
	var data=JSON.parse(userdata);
	
 	window.localStorage.setItem("loginuser",data['email']);

	
    	socket.emit('join', data['email']);

 
	window.location.href='#/tab/chats';

	}
// Alert popup code

$scope.showAlert = function(msg) {

   var alertPopup = $ionicPopup.alert({

      title:'Login Errors!',
      template: msg,

   });

   alertPopup.then(function(res) {


   });

};




$scope.signin = function() {

  $scope.tabcontain=true;
    var email =$scope.email;
    var password=$scope.password;
 $ionicLoading.show({
                template: 'Signing In...'
            });
    if(email && password && email!='' && password!='')
    {


var result={};
result.email=email;
result.password=password;
			 $http({
				method: "POST",	
	      url: 'https://vchatapp.herokuapp.com/signin',
				data: result
	    }).success(function(result) {
				
				var obj_data=result[0];
				var userdata=JSON.stringify(obj_data);
				if(result.length>0)
				{
				var user_data={};
				user_data._id=obj_data._id;	
				user_data.email=obj_data.email;				
				chatappdb.user_add(obj_data._id,obj_data);
				window.localStorage.setItem("loginuser",obj_data.email);
			    	socket.emit('join', obj_data.email);
 				window.localStorage.setItem("_id", obj_data._id);
				window.localStorage.setItem("email", obj_data._email);
               			window.localStorage.setItem("userdata", userdata);
				window.location.href='#/tab/chats';

				
				}
				else 
				{
		
 				$scope.showAlert('Invalid Email or Password');
				
				
				}	
				 $ionicLoading.hide();	
	    }).error(function(data, status, headers, config) {
					$scope.showAlert('Network Error');
					$ionicLoading.hide();
	    });





   	 }
    	else
   	 {

	 $scope.showAlert('Both email and password needed');
 	 $ionicLoading.hide();
    	 }
	
  }


})





.controller('ChatsCtrl', function($scope,$ionicLoading, Chats , socket , chatappdb , $cordovaLocalNotification) {


		
$ionicLoading.show({
                template: 'loading...'
            });
 Chats.all().then(function(data) {
		$scope.chats= data;
		$ionicLoading.hide();
    });


  //$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})



.controller('ChatDetailCtrl', function($scope, $stateParams,$ionicLoading,chatappdb,socket, $rootScope, $ionicPlatform, $cordovaLocalNotification , $ionicScrollDelegate) {

 
$scope.$on('updatechat', function(event,data) {

   $scope.historys.push({
		     from_address: data.name,
		      message:data.message,
		      time : data.time
		   });

   });
 

$ionicLoading.show({
                template: 'loading...'
            });
 $scope.historys = [];
  
  chatappdb.get_user_byid($stateParams.chatId).then(function(data){
  $scope.username=data.name;
  window.localStorage.setItem("current_room",data.email);
 chatappdb.gethistory(data.email,data.name).then(function(result) {
	
        $scope.historys=result;
        $ionicLoading.hide();
	$ionicScrollDelegate.scrollBottom();
    });
   
  });
  
  

   
   
	$scope.sendMessage = function (data) {
var textMessage=$scope.input.message;
$scope.input.message = ''
if(textMessage!=null){
    $scope.historys.push({
      from_address: 'me',
      message: textMessage,
      time : getDateTime()
   });
      $scope.textMessage=null;
	var userdata = window.localStorage.getItem("userdata");
	var data=JSON.parse(userdata);
	var from=data['email'];
   	var roomId=window.localStorage.getItem("current_room");
	var time=getDateTime();
	chatappdb.pushmessage('me',roomId,textMessage, time);
	var data ={};
	data={"to" : roomId, "from" : from,"message" : textMessage,"time":time};
 	$ionicScrollDelegate.scrollBottom();
 	socket.emit('send-message', data);
    }
}

})







.controller('AccountCtrl', function($scope,$cordovaSQLite,chatappdb,socket,$cordovaLocalNotification,$ionicLoading) {

 

$scope.logout = function() {

	$ionicLoading.show({
                template: 'Logging Out...'
            });
	var userdata = window.localStorage.getItem("userdata");
	var data=JSON.parse(userdata);
 socket.emit('leave', data['email']);
 window.localStorage.removeItem("_id");
 window.localStorage.removeItem("userdata");
 $scope.remove_user();
 
}

$scope.remove_user = function() {
    chatappdb.remove_user().then(function(){
     console.log('user data cleared');
     window.location.href='#/';
     window.location.reload(true);
    });
  }

  

  
})

.controller('SearchCtrl', function($scope,$cordovaSQLite,chatappdb,socket,$cordovaLocalNotification,$stateParams) {



})

.directive('wjValidationError', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctl) {
      scope.$watch(attrs['wjValidationError'], function (errorMsg) {
        elm[0].setCustomValidity(errorMsg);
        ctl.$setValidity('wjValidationError', errorMsg ? false : true);
      });
    }
  };
});

