const  venues  =  require ( '../controllers/venues.server.controller' );
module . exports  =  function ( app ){
    app . route ( app.rootUrl + '/venues')
        . post(venues . create);
    app . route ( app.rootUrl + '/venues/:id')
        . get(venues . read)
        . patch(venues . update);
};