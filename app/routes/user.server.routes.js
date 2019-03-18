const  users  =  require ( '../controllers/user.server.controller' );
module . exports  =  function ( app ){
    app . route ( app.rootUrl + '/users')
        . post(users . create);
    app . route (app.rootUrl + '/users/login')
        . post(users . login);
    app . route (app.rootUrl + '/users/logout')
        . post(users . logout);
};