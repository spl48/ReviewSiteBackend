const  Venue  =  require ( '../models/venues.server.model' );

exports . create = async function (req, res) {

    let data = {
        "authorization": req.header('X-Authorization'),
        "venueName": req.body.venueName,
        "categoryId": req.body.categoryId,
        "city": req.body.city,
        "shortDescription": req.body.shortDescription,
        "longDescription": req.body.longDescription,
        "address": req.body.address,
        "latitude": req.body.latitude,
        "longitude": req.body.longitude
    };

    let authToken = data['authorization'];
    let venueName = data['venueName'];
    let categoryId = data['categoryId'];
    let city = data['city'];
    let shortDescription = data['shortDescription'];
    let longDescription = data['longDescription'];
    let address = data['address'];
    let latitude = data['latitude'];
    let longitude = data['longitude'];

    if (authToken == null || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = await Venue.authorize(authToken);

    let userId = null;
    if (result.length === 0) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    } else {
        userId = result[0]['user_id'];
    }

    if (venueName == null || venueName === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (categoryId == null || !Number.isInteger(categoryId) || categoryId < 1 || categoryId > 5) {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (city == null || city === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (shortDescription == null || shortDescription === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (longDescription == null || longDescription === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (address == null || address === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (latitude == null || latitude > 90 || latitude < -90) {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (longitude == null || longitude > 180 || longitude < -180) {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    let date_added = new Date();

    let values = [
        userId, categoryId, venueName, city, shortDescription, longDescription, date_added, address, latitude, longitude
    ];

    let result1 = null;
    try {
        result1 = await Venue.insert(values);
        res.status(201)
        res.json({venueId: result1['insertId']})
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

};

exports . read = async function (req , res) {
    let venueId = req.params.id;
    let result = null;
    try {
        result = await Venue.getOne(venueId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (result.length === 0) {
        res.status(404).send('Not Found');
        return;
    }

    let data = result[0];

    let categoryInfo = null;
    try {
        categoryInfo = await Venue.getCategoryInfo(data['category_id']);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let userInfo = null;
    try {
        userInfo = await Venue.getUsername(data['admin_id']);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }
    let username = userInfo[0];

    let photoInfo = null;
    try {
        photoInfo = await Venue.getVenuePhoto(venueId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    photoInfo[0]['isPrimary'] = photoInfo[0]['isPrimary'] !== 0;
    res.json({venueName: data['venue_name'],
            admin: {
                userId: data['admin_id'],
                username: username['username']
            },
            category: categoryInfo[0],
            city: data['city'],
            shortDescription: data['short_description'],
            longDescription: data['long_description'],
            dateAdded: data['date_added'],
            address: data['address'],
            latitude: data['latitude'],
            longitude: data['longitude'],
            photos: photoInfo
        })
};

exports . update = async function (req , res) {
    let authorized = false;

    let data = {
        "venue_id": req.params.id,
        "authorization": req.header('X-Authorization'),
        "venueName": req.body.venueName,
        "categoryId": req.body.categoryId,
        "city": req.body.city,
        "shortDescription": req.body.shortDescription,
        "longDescription": req.body.longDescription,
        "address": req.body.address,
        "latitude": req.body.latitude,
        "longitude": req.body.longitude
    };

    let requestedVenue = data['venue_id'];
    let authToken = data['authorization'];
    let venueName = data['venueName'];
    let categoryId = data['categoryId'];
    let city = data['city'];
    let shortDescription = data['shortDescription'];
    let longDescription = data['longDescription'];
    let address = data['address'];
    let latitude = data['latitude'];
    let longitude = data['longitude'];

    let result = null;
    try {
        result = await Venue.getOne(requestedVenue);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (result.length === 0) {
        res.status(404).send('Not Found');
        return;
    }


    let adminId = result[0]['admin_id'];


    if (authToken === null || authToken === undefined || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result1 = null;
    try {
        result1 = await Venue.authorize(authToken);
    } catch (err) {
        res.status(500).send('Server Error');
        return;

    }

    let userId = null;
    if (result1.length !== 0) {
        authorized = true;
        userId = result1[0]['user_id'];
    } else {
        res.status(401).send('Unauthorized');
        return;
    }

    if (typeof venueName == "undefined" && typeof categoryId == "undefined" && typeof city == "undefined" && typeof shortDescription == "undefined"
        && typeof longDescription == "undefined" && typeof address == "undefined" && typeof latitude == "undefined" && typeof longitude == "undefined") {
        res.status(400).send('Bad Request');
        return;
    }

    if (venueName === "" || typeof venueName == "number" || categoryId === "" || typeof categoryId == "string" ||
        city === "" || typeof city == "number" || shortDescription === "" || typeof shortDescription == "number"
        || longDescription === "" || typeof longDescription == "number" || address === "" || typeof address == "number"
    || latitude === "" || typeof latitude == "string" || longitude === "" || typeof longitude == "string") {
        res.status(400).send('Bad Request');
        return;
    }

    // console.log(userId);
    // console.log(adminId);
    if (userId.toString() !== adminId.toString()) {
        res.status(403).send('Forbidden');
        return;
    }


    if (typeof categoryId != "undefined") {
        if (!Number.isInteger(categoryId) || categoryId < 1 || categoryId > 5) {
            res.status(400).send('Bad Request');
            return;
        } else {
            await Venue.updateCategoryId([categoryId, requestedVenue]);
        }
    }

    if (typeof venueName != "undefined" ) {
        await Venue.updateName([venueName, requestedVenue]);
    }


    if (typeof city != "undefined" ) {
        await Venue.updateCity([city, requestedVenue]);
    }

    if (typeof shortDescription != "undefined" ) {
        await Venue.updateShDescription([shortDescription, requestedVenue]);
    }

    if (typeof longDescription != "undefined" ) {
        await Venue.updateLoDescription([longDescription, requestedVenue]);
    }

    if (typeof address != "undefined" ) {
        await Venue.updateAddress([address, requestedVenue]);
    }

    if (typeof latitude != "undefined" ) {
        if (latitude == null || latitude > 90 || latitude < -90) {
            res.status(400).send('Bad Request');
            return;
        }
        await Venue.updateLatitude([latitude, requestedVenue]);
    }

    if (typeof longitude != "undefined" ) {
        if (longitude == null || longitude > 180 || longitude < -180) {
            res.status(400).send('Bad Request');
            return;
        }
        await Venue.updateLongitude([longitude, requestedVenue]);
    }

    res.status(200).send('OK');
};

exports . readAll = async function (req , res) {

    let result = null;
    try {
        result = await Venue.getCategories();
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    res.json(result);

}