var db=null;
//var host='https://vchatapp.herokuapp.com';
var host='https://vchatapp.herokuapp.com';
window.isOnline = false;
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngRoute','ngCordova'])


.directive('inputFocus', function () {

var FOCUS_CLASS = 'input-focused';
return {
  restrict: 'A',
  priority: 1,
  require: 'ngModel',
  link: function (scope, element, attrs, ctrl) {
    element.bind('focus',function () {
      element.parent().addClass(FOCUS_CLASS);    
    }).bind('blur', function () {
      element.parent().removeClass(FOCUS_CLASS);
    }).bind('keydown', function(e) {
        if (e.which == 13) {
         element.parent().removeClass(FOCUS_CLASS);
          }
      });
  }
};
})

.run(function($http, $timeout , $ionicPlatform,$cordovaSQLite,chatappdb,socket,$stateParams, $rootScope, $ionicPlatform, $cordovaLocalNotification ,$ionicScrollDelegate,$ionicLoading,$templateCache,$timeout) {

$ionicLoading.show({
                template: 'Loading...'
            });


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


	

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    //ionic.Platform.isFullScreen = true;
      if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("chatapp.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("chatapp.db", "1.0", "My app", -1);
    }
     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id integer primary key, data text, _id text)");
     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS friend_lists (_id text, display_name text,email text,pic text ,status text)");
     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS messages (from_address text, to_address text, message text, time text , unread_flag integer)");

 /*window.plugin.notification.local.onadd = function (id, state, json) {
            var notification = {
                id: id,
                state: state,
                json: json
            };
            $timeout(function() {
                $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
            });
        };*/

$ionicPlatform.registerBackButtonAction(function(e) {
            e.preventDefault();
        }, 1000);   

window.addEventListener("resume", function() {
              
       
            }, false);
  });

window.addEventListener('native.keyboardshow',function(e){
   
alert('Keyboard height is: ' + e.keyboardHeight);    
});
window.addEventListener('native.keyboardhide',function(e){
   
alert('Keyboard height is: ' + e.keyboardHeight);    
});

$rootScope.add = function(chatid,message,title) {

        $cordovaLocalNotification.add({
            id: chatid,
            message: message,
            title:title,
            autoCancel: true,
            sound: null
        }).then(function () {
            console.log("The notification has been set");
        });
    };


socket.on('update-status', function(data) {




chatappdb.update_user_byemail(data.email,data.status).then(function(result){
$rootScope.$broadcast('updatestatus',data);
});


});


 
socket.on('deliver-message', function(data) {
 var message =data.message;
chatappdb.get_user_byemail(data.from).then(function(result){

  var username=result.name;
  
  console.log(message);
  if($stateParams.chatId==result._id)
	{  

		var time=getDateTime();
		var m_data={};
		m_data.name=result.name;
		m_data.message=message;
		m_data.time=time;
		$rootScope.$broadcast('updatechat',m_data);
		/* $rootScope.historys.push({
		     from_address: result.name,
		      message:message,
		      time : time
		   });  */
		var userdata = window.localStorage.getItem("userdata");
		var data=JSON.parse(userdata);
		var to=data['email'];
		chatappdb.pushmessage(result.email,to,message, time);
		$ionicScrollDelegate.scrollBottom();
	}
   else
  	{

		
                var time=getDateTime();
		var userdata = window.localStorage.getItem("userdata");
		var data=JSON.parse(userdata);
		var to=data['email'];
		chatappdb.pushmessage(result.email,to,message, time);
                var title=username;
                $rootScope.add(result.id,message,title);
                

  	}

  });
  
   }); 

socket.on("connect", function(){
    window.isOnline = true;
	console.log('connected');
});
socket.on("connecting", function(){
    window.isOnline = false;
	console.log('disconnected');
});
socket.on("connect_failed", function(){
    window.isOnline = false;
	console.log('disconnected');

});
socket.on("close", function(){
    window.isOnline = false;
	console.log('disconnected');

});
socket.on("disconnect", function(){
    window.isOnline = false;
	console.log('disconnected');
});
socket.on("reconnect", function(){
    window.isOnline = true;
	console.log('reconnected');
});
socket.on("reconnecting", function(){
    window.isOnline = false;
	console.log('disconnected');
});
socket.on("reconnect_failed", function(){
    window.isOnline = false;
	console.log('disconnected');
});
socket.on("error", function(){
    window.isOnline = false;
	console.log('disconnected');
});

})

.config(function($stateProvider, $routeProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:




  .state('tab.chats', {
      url: '/chats',
      cache: false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

.state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $routeProvider
    .when('/signup',{
	templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
	})
   .when('/', {
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
      })

  

});


 function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    

    var amPM = (hour > 11) ? "pm" : "am";
  if(hour > 12) {
    hour -= 12;
  } else if(hour == 0) {
    hour = "12";
  }
  if(minute < 10) {
    minute = "0" + minute;
  }


    var dateTime = day+'/'+month+'/'+year+' '+hour + ":" + minute + amPM;   
     return dateTime;
}

function isset ( strVariableName ) { 

    try { 
        eval( strVariableName );
    } catch( err ) { 
        if ( err instanceof ReferenceError ) 
           return false;
    }

    return true;

 } 
