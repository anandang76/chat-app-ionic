angular.module('starter.services', [])

.factory('Chats', function($http,chatappdb,$rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
 

  return {
  

     all: function() {
             //return the promise directly.

			var flag=window.localStorage.getItem("friend_lists");
			var login_user= encodeURI(window.localStorage.getItem("_id"));
			var result={};
		        result._id=login_user;
			
             return $http({
				method: "POST",	
	     			 url: 'https://vchatapp.herokuapp.com/getfriendlists',
				data:result
	    })
		.then(function(res){
		     //resolve the promise as the datavar 
		    // handle errors in processing or in error.
			    var data=JSON.stringify(res.data);
				chatappdb.add_friends(res.data);
				window.localStorage.setItem("friend_lists","1");
				
				   return res.data;
		
		}).catch(function(e){

			return chatappdb.get_friends();
			 
		});
			

        },
    history: function() {
             //return the promise directly.
             return $http.get('http://chatapp.verifiedwork.com/webservices/userlist.php')
                       .then(function(result) {
                            //resolve the promise as the data
			    var history = JSON.stringify(result.data);
                            return history;
                        });
        },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },

	adduser: function(postdata){

		 return $http({
				method: "POST",	
	      url: 'https://vchatapp.herokuapp.com/signup',
				data:postdata
	    })
		.then(function(result){
		     //resolve the promise as the datavar 
		    // handle errors in processing or in error.
				var code=result.data.code;
				console.log(code);
				   if(code=='400')
					{
					return '400';
					}
				    else
					{
					return '200';
					}
				  
		
		}).catch(function(e){

			return '400';
			 
		});

	},

    get: function(chatId) {
    
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id == parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));	

    }
    return output;
  }

 self.getAllhistory = function(result,name) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
  	var obj={};
	if(result.rows.item(i).from_address!='me')
	{
        obj.from_address=name;
        obj.to_address=result.rows.item(i).to_address;
	obj.message=result.rows.item(i).message;
	obj.time=result.rows.item(i).time;
	result.rows.item(i).from_address=name;
	output.push(obj);	

	}
         else
	{
output.push(result.rows.item(i));	
	}
     

    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})



.factory('chatappdb', function($cordovaSQLite, DBA ,$q, $ionicPlatform) {
  var self = this;

  self.get_user = function() {
    return DBA.query("SELECT _id,data FROM user")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  
  self.get_user_byid = function(id) {
  
    return DBA.query("SELECT * FROM friend_lists where _id=? ",[id])
      .then(function(result){
        return DBA.getById(result);
      });
  }
  

self.get_user_byemail = function(email) {
  
    return DBA.query("SELECT * FROM friend_lists where email=? ",[email])
      .then(function(result){
        return DBA.getById(result);
      });
  }
  
 self.user_add = function(token,data) {
    var parameters = [token,data];
    
    return DBA.query("INSERT INTO user (_id, data) VALUES (?,?)", parameters);
  }


self.pushmessage = function(from, to , message , time) {
    var parameters = [from, to , message , time];
    return DBA.query("INSERT INTO messages (from_address , to_address , message , time ) VALUES (?,?,?,?)", parameters);
  }

self.gethistory = function(id,name) {
     //DBA.query("DROP TABLE messages");
    //DBA.query("CREATE TABLE IF NOT EXISTS messages (from_address text, to_address  text, message text, time text,unread_flag integer)"); 
    //DBA.query("DELETE FROM messages");

    return DBA.query("SELECT * FROM messages where from_address=? or to_address=?",[id,id])
      .then(function(result){
        return DBA.getAllhistory(result,name);
      });
  }
 self.remove_user = function() {
   
    return DBA.query("DELETE FROM user");
  }
  
 
   self.add_friends = function(data) {
    var fulldata = '';
   //DBA.query("DROP TABLE friend_lists");
  // DBA.query("CREATE TABLE IF NOT EXISTS friend_lists (_id text, name text,email text,pic text ,status text)");
    DBA.query("DELETE FROM friend_lists");
	var json =data;
	var len=json.length;
	for(var i = 0; i < json.length; i++) {
	   	var obj = json[i];
		var user_id=obj._id;
		var user_name=obj.display_name;
		var user_email=obj.email;
		var user_face=obj.pic;
		var status=obj.status;
		DBA.query("INSERT INTO friend_lists ('_id', 'name','email','pic','status') VALUES (?,?,?,?,?)",[user_id,user_name,user_email,user_face,status]).then(function (res) {
		console.log('inserted');
		});

}

	}
  
  self.get_friends = function() {
    return DBA.query("SELECT * FROM friend_lists")
      .then(function(result){
	var data=DBA.getAll(result);
        return data;
      });
  }
  



  return self;
})


.factory('socket', function socket($rootScope) {
  var timeout = 100;
  var socket = io.connect('https://vchatapp.herokuapp.com', {
	
	'reconnect': true,
	'reconnection delay':100,
	'max reconnection attempts': Infinity,
	'force new connection':true
});
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
 
  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
        if(ionic.Platform.isWebView()){
 
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
          });
 
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
          });
 
        }
        else {
 
          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);    
 
          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);  
        }       
    }
  }
})
.filter('nl2br', ['$sce', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
    };
}]);

