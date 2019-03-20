const  venues  =  require ( '../controllers/venues.server.controller' );
module . exports  =  function ( app ){
    app . route ( app.rootUrl + '/venues')
        . post(venues . create);
};