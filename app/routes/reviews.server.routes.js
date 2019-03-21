const  reviews  =  require ( '../controllers/reviews.server.controller' );
module . exports = function ( app ){
    app . route ( app.rootUrl + '/venues/:id/reviews')
        . post(reviews . create)
}