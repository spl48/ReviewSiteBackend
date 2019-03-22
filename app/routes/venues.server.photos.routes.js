const  venuePhotos  =  require ( '../controllers/venues.photos.server.controller' );
module . exports  =  function ( app ) {
    app.route(app.rootUrl + '/venues/:id/photos')
        .post(venuePhotos . upload)
};