const  venuePhotos  =  require ( '../controllers/venues.photos.server.controller' );
module . exports  =  function ( app ) {
    app.route(app.rootUrl + '/venues/:id/photos')
        .post(venuePhotos . upload)
        //.get(venuePhotos . retrieve)
    app.route(app.rootUrl + '/venues/:id/photos/:filename/setPrimary')
        .post(venuePhotos . setPrimary)
};