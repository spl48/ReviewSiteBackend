const  users  =  require ( '../controllers/user.photos.server.controller' );
module . exports  =  function ( app ){
    app . route (app.rootUrl + '/users/:id/photo')
        . put(users . upload);
};