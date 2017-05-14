angular.module('starter.services', ['ngResource'])
.constant("baseURL","http://localhost:3000/")
.factory('userFactory', ['$resource', 'baseURL', function($resource,baseURL) {
      return $resource(baseURL + "users/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
  }])

.factory('registerFactory', ['$resource', 'baseURL', function($resource,baseURL) {
      return $resource(baseURL + "users/:id");
  }])
.factory('registerFactoryEmail', ['$resource', 'baseURL', function($resource,baseURL) {
      return $resource(baseURL + "users/:id", {email:'@email'});
  }])


.factory('noteFactory', ['$resource', 'baseURL', function($resource,baseURL) {
     return $resource(baseURL + "notes/:id");
 }])
.factory('noteFactoryRegister', ['$resource', 'baseURL', function($resource,baseURL) {
     return $resource(baseURL + "notes/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
 }])
.factory('noteFactoryIdUser', ['$resource', 'baseURL', function($resource,baseURL) {
     return $resource(baseURL + "notes/:id", {id:'@idUser'});
 }])


.factory('favoriteFactoryIdNote', ['$resource', 'baseURL', function($resource,baseURL) {
     return $resource(baseURL + "favorites/:id", {id:'@idNote'});
 }])
.factory('favoriteFactoryIdUser', ['$resource', 'baseURL', function($resource,baseURL) {
     return $resource(baseURL + "favorites/:id", {id:'@idUser'});
 }])
.factory('favoriteFactory', ['$resource', 'baseURL', function($resource,baseURL) {
     return $resource(baseURL + "favorites/:id");
 }])


.factory('sessionService', ['$http', function($http){
    return{
        set:function(key,value){
            return sessionStorage.setItem(key,value);
        },
        get:function(key){
            return sessionStorage.getItem(key);
        },
        destroy:function(key){
            return sessionStorage.removeItem(key);
        }
    }
  }])
;
