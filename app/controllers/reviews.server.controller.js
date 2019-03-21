const  Review  =  require ( '../models/reviews.server.model' );

exports . create  = async function (req , res) {
    let data = {
        "venue_id": req.params.id,
        "authorization": req.header('X-Authorization'),
        "reviewBody": req.body.reviewBody,
        "starRating": req.body.starRating,
        "costRating": req.body.costRating
    };

    let venueId = data['venue_id'];
    let authToken = data['authorization'];
    let reviewBody = data['reviewBody'];
    let starRating = data['starRating'];
    let costRating = data['costRating'];

    if (authToken == null || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = null;
    try {
        result = await Review.authorize(authToken);
    } catch (err) {
        res.status(501).send('Server Error');
        return;
    }

    let userIdFromToken = null;
    if (result.length === 0) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    } else {
        userIdFromToken = result[0]['user_id'];
    }

    let result2 = null;
    try {
        result2 = await Review.getVenueAdmin(venueId);
    } catch (err) {
        console.log(err);
        res.status(502).send('Server Error');
        return;
    }

    let venueAdmin = null;
    if (result2.length === 0) {
        res.status(400).send({error: 'Bad Request'});
        return;
    } else {
        venueAdmin = result2[0]['admin_id'];
    }

    if (typeof reviewBody == "undefined" || typeof starRating == "undefined" || typeof costRating == "undefined") { //Not all required fields are given
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (reviewBody === "" || typeof reviewBody != "string" || starRating === "" || typeof starRating != "number"
        || costRating === "" || typeof costRating != "number") {  //Empty fields or incorrect object types
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (!Number.isInteger(starRating) || !Number.isInteger(costRating) || starRating < 0 || starRating > 5 || costRating < 0 || costRating > 5) {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (venueAdmin === userIdFromToken) {  //Trying to review venue they are admin of
        res.status(403).send('Forbidden');
        return;
    }

    let result3 = null;
    try {
        result3 = await Review.checkUsersReviews([venueId, userIdFromToken]);
    } catch (err) {
        res.status(503).send('Server Error');
        return;
    }

    if (result3.length > 0) { //Trying to review
        res.status(403).send('Forbidden');
        return;
    }

    //reviewed_venue_id, review_author_id, review_body, star_rating, cost_rating, time_posted

    let time = new Date();

    let values = [
        venueId,
        userIdFromToken,
        reviewBody,
        starRating,
        costRating,
        time
    ];

    try {
        await Review.insert(values);
    } catch (err) {
        res.status(504).send('Server Error');
        return;
    }

    res.status(201).send('Created');

};