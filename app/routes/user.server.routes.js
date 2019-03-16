const  users  =  require ( '../controllers/user.server.controller' );
module . exports  =  function ( app ){
    app . route ( app.rootUrl + '/users')
        . post(users . create)
};