angular.module('starter.controllers', ['ngCordova'])

.controller('FavoriteCtrl', function($scope, $state, $ionicPopup, $window, sessionService, favoriteFactory, favoriteFactoryIdUser) {
  var myIdUser = parseInt(sessionService.get('id'), 10);
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.favorites = favoriteFactory.query({idUser:myIdUser});
    $scope.favorites.$promise.then(function(data) {
         $scope.favorites = data;
     });

      console.log("Before Enter favorites");
  });

  $scope.deleteFavorite = function (index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.remove({id:index});
                $window.location.reload(true);
            } else {
                console.log('Canceled delete');
            }
        });
    };
})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, userFactory, sessionService) {
    $scope.name = sessionService.get('name');
    if($scope.name != null && $scope.name != ''){
      $state.go('tab.favorites');
    }

    $scope.data = {};
    var flag = 1;

    $scope.login = function() {
      var users = userFactory.query();
      users.$promise.then(function(data) {
        users = data;
        //console.log("credentials: "+$scope.data.email + " "+$scope.data.password)
        for (var i = 0; i < users.length; i++) {
        
          if (users[i].email === $scope.data.email && users[i].password === $scope.data.password) {
              sessionService.set('id',users[i].id);
              sessionService.set('email',users[i].email);
              sessionService.set('name',users[i].name);
              flag = 0
              $state.go('tab.favorites');
          }
        }
        if(flag){
            var alertPopup = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
            });
          }
        }, function(error){
        if(flag){
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        }
      }); 
    } //end login
})

.controller('RegisterCtrl', function($scope, $ionicPopup, $state, registerFactory) {
  $scope.registration = {};

    $scope.doRegister = function() {
      var test = registerFactory.query({email: $scope.registration.email});
      test.$promise.then(function (data) {
          try {
              console.log(data[0].email);
              $ionicPopup.show({
                title: 'Email already exists',
                buttons: [{
                  text: 'Ok',
                  type: 'button-assertive'
                }]
              });
          } catch(err) {
              if(registerFactory.save($scope.registration) ){
                var alertPopup = $ionicPopup.alert({
                  title: 'Register done!'
                });
                $state.reload();
                $state.go('tab2.login', {reload: true});
              }
            }
      }, function (error) {
        if(registerFactory.save($scope.registration) ){
          var alertPopup = $ionicPopup.alert({
            title: 'Register done!'
          });
          $state.reload();
          $state.go('tab2.login', {reload: true});
        }
      });   
    }
})

.controller('NotesCtrl', function($scope, $ionicPopup, $window, $state, noteFactory, noteFactoryIdUser, favoriteFactory, favoriteFactoryIdNote, sessionService) {
  var myIdUser = parseInt(sessionService.get('id'), 10);
    $scope.notes = noteFactoryIdUser.query({idUser:myIdUser});
        $scope.notes.$promise.then(function(data) {
        $scope.notes = data;
      });

    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.notes = noteFactoryIdUser.query({idUser:myIdUser});
        $scope.notes.$promise.then(function(data) {
        $scope.notes = data;
      });
        console.log("Before Enter Notes");
    });  

  $scope.createNote = function(){
    $state.go('tab.note-detail', {reload: true});
  };

  $scope.remove = function(myId) {
    $ionicPopup.confirm({
              title: 'Are you sure?',
              subTitle: 'You can not undo'
       }).then(function(res) {
          if(res !== false){
              noteFactory.remove({id:myId});
              favoriteFactoryIdNote.remove({id:myId});
              $window.location.reload(true);
          }
    });   
  };

  $scope.addFavorite = function (index) {
      console.log("Favorite: "+index);
      var test = favoriteFactoryIdNote.query({idNote:index});
      test.$promise.then(function (data) {
          try {
              console.log(data[0].idNote);
              $ionicPopup.show({
                title: 'Favorite already exists',
                buttons: [{
                  text: 'Ok',
                  type: 'button-assertive'
                }]
              });
          } catch(err) {
             var favorite = noteFactory.get({id:index});  
              favorite.$promise.then(function(data) {
                
              var myFavorite =  [{ 
                idNote: data.id,
                idUser: parseInt(sessionService.get('id'), 10),
                title: data.title,
                content: data.content,
                dateModification: data.dateModification
              }];
              favoriteFactory.save(myFavorite[0]);
              $ionicPopup.show({
                title: 'Favorite added',
                buttons: [{
                  text: 'Ok',
                  type: 'button-positive'
                }]
              });
            });
          }
      }, function (error) {
            var favorite = noteFactory.get({id:index});  
            favorite.$promise.then(function(data) {
              var myFavorite =  [{ 
                idNote: data.id,
                idUser: parseInt(sessionService.get('id'), 10),
                title: data.title,
                content: data.content,
                dateModification: data.dateModification
              }];
              favoriteFactory.save(myFavorite[0]);
              $ionicPopup.show({
                title: 'Favorite added',
                buttons: [{
                  text: 'Ok',
                  type: 'button-positive'
                }]
              });
            });
      });   
  }
})

.controller('NoteDetailCtrl', function($scope, $stateParams, $state, $window, $ionicPopup,
  noteFactory, noteFactoryRegister, sessionService) {

  $scope.note = {};
  try{
    var newId = $stateParams.noteId;
    if(newId != null && newId != ''){
      $scope.note = noteFactory.get({id:newId});
      $scope.note.$promise.then(function(data) {
           $scope.note = data;
       });
    } else{
      console.log('ok2');
    }
  }catch (e){
    console.log('ok');
     // handle errors in processing or in error.
  }

  $scope.back = function() {
      $state.go('tab.notes');
  }

  $scope.saveNote = function() {
    if(angular.isDefined($scope.note.id)){
      var myNote =  { 
            id: parseInt($scope.note.id, 10),
            idUser: parseInt(sessionService.get('id'), 10),
            title: $scope.note.title,
            content: $scope.note.content,
            dateModification: new Date().toISOString()
          };
      console.log(myNote);
      noteFactory.remove({id:$scope.note.id});
      noteFactory.save(myNote);
      var alertPopup = $ionicPopup.alert({
          title: 'Yaay!',
          template: 'Note updated!'
        });
    } else{
        var myNote =  { 
            idUser: parseInt(sessionService.get('id'), 10),
            title: $scope.note.title,
            content: $scope.note.content,
            dateModification: new Date().toISOString()
        };
        noteFactory.save(myNote);
        var alertPopup = $ionicPopup.alert({
          title: 'Yaay!',
          template: 'Note saved!'
        });
    }
    
    $state.go($state.current, {reload: true});
  }

 // $scope.htmlContent = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>'
})

.controller('AccountCtrl', function($scope, $ionicPopup, $state, $window, sessionService, 
  userFactory, registerFactory) {
  $scope.account = {};

  $scope.account.name = sessionService.get('name');
  $scope.account.email = sessionService.get('email');
  $scope.account.id = sessionService.get('id');

  $scope.logout = function() {
    //console.log(sessionService.get('name') + " " + sessionService.get('email') + "  " +  sessionService.get('id'))
    sessionService.destroy('name');
    sessionService.destroy('id');
    sessionService.destroy('email');
    //console.log(sessionService.get('name') + " " + sessionService.get('email') + "  " +  sessionService.get('id'))
    $window.location.reload(true);
    $state.go('tab2.login');
  }

  $scope.saveAccount = function() {
    if($scope.account.password != $scope.account.repassword){
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Passwords are different!'
      });
    } else{
      var myUser =  { 
          id: parseInt($scope.account.id, 10),
          name: $scope.account.name,
          email: $scope.account.email,
          password: $scope.account.password
        };

      //console.log($scope.account);
      if(userFactory.remove({id:$scope.account.id})){
        //delete $scope.account.id;
        delete $scope.account.repassword;
        //console.log($scope.account);
        registerFactory.save(myUser);
        
        sessionService.destroy('name');
        sessionService.set('name',$scope.account.name);
        var alertPopup = $ionicPopup.alert({
          title: 'Yaay',
          template: 'Your information has been updated!'
        });
        //$ionicHistory.clearCache();
        $state.go('tab.favorites', {reload: true});
        //$window.location.reload(true);

        
      } else{
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Error modifying your information!'
        });
      }
      
    }
  }
})

;
