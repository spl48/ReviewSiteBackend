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

    if (photoInfo[0] !== undefined) {
        photoInfo[0]['isPrimary'] = photoInfo[0]['isPrimary'] !== 0;
    }

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

};

function toRad(x) {
    return x * Math.PI / 180;
}

function getDistance(lat1, lat2, lon1, lon2) {

    var R = 6371; // km
//has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = toRad(x1);
    var x2 = lon2-lon1;
    var dLon = toRad(x2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
}


exports . retrieve = async function (req , res) {

    let query = req.query;

    let count = query['count'];
    let start_index = query['startIndex'];
    let city = query['city'];
    let category_id = query['categoryId'];
    let max_cost_rating = query['maxCostRating'];
    let admin_id = query['adminId'];
    let search_term = query['q'];
    let min_star_rating = query['minStarRating'];
    let sort_by = query['sortBy'];
    let reverse_sort = query['reverseSort'];
    let my_latitude = query['myLatitude'];
    let my_longitude = query['myLongitude'];

    if (min_star_rating < 0 || min_star_rating > 5 || category_id < 0 || max_cost_rating > 5 || max_cost_rating < 0) {
        res.status(400).send('Bad request');
        return;
    }

    let and = false;

    let queryValues = [];

    let queryString = 'SELECT venue_id AS venueId, venue_name AS venueName, category_id AS categoryId, city, short_description AS shortDescription, ' +
        'latitude, longitude FROM Venue ';

    if (category_id !== undefined || admin_id !== undefined || search_term !== undefined ) {
        queryString += ' WHERE ';
    }

    //queryString += 'venue_id IN (SELECT reviewed_venue_id FROM (SELECT reviewed_venue_id, AVG(star_rating) as average FROM REVIEW GROUP BY reviewed_venue_id) WHERE average >= 3)';


    let search_params = [city, category_id, admin_id];
    let search_names  = ['city', 'category_id', 'admin_id'];

    for (let i=0; i<search_params.length; i++) {
        if (search_params[i] !== undefined) {
            if (!and) {
                and = true;
            } else {
                queryString += 'AND ';
            }
            queryString += search_names[i] + '=? ';
            queryValues.push(search_params[i]);
        }
    }


    if (search_term !== undefined) {
        if (!and) {
            and = true;
        } else {
            queryString += 'AND ';
        }
        queryString += 'venue_name LIKE ? ';
        search_term = '%' + search_term + '%';
        queryValues.push(search_term);
    }

    //-------------------------------------------------------------------------------------
    let satisfactoryVenueIdsStar = [];
    let satisfactoryVenueIdsCost = [];
    if (min_star_rating !== undefined) {
        let yoza = null;
        try {
            yoza = await Venue.getIdsOverMinStar(min_star_rating);
        } catch (err) {
            console.log(err);
        }


        for (let i = 0; i < yoza.length; i++) {
            satisfactoryVenueIdsStar.push(yoza[i]['reviewed_venue_id']);
        }

    }


    if (max_cost_rating !== undefined) {
        let yoza2 = null;
        try {
            yoza2 = await Venue.getIdsUnderMaxCost(max_cost_rating);
        } catch (err) {
            console.log(err);
        }

        for (let i = 0; i < yoza2.length; i++) {
            satisfactoryVenueIdsCost.push(yoza2[i]['venue_id']);
        }



    }

//--------------------------------------------------------------------------------------



    if (count !== undefined) {
        queryString += ' LIMIT ' + count;
        queryValues.push(count);
    }

    if (start_index !== undefined) {
        queryString += ' OFFSET ' + start_index;
        queryValues.push(start_index);
    }


    let result = null;
    try {
        result = await Venue.getVenues(queryString, queryValues);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;
    }


    if (min_star_rating !== undefined) {
        let i = result.length;
        while (i--) {
            if (satisfactoryVenueIdsStar.includes(result[i]['venueId'])) {
            } else {
                result.splice(i, 1);
            }
        }
    }

    if (max_cost_rating !== undefined) {
        let i = result.length;
        while (i--) {
            if (satisfactoryVenueIdsCost.includes(result[i]['venueId'])) {
            } else {
                result.splice(i, 1);
            }
        }
    }



    for (let i=0; i<result.length; i++) {
        if (my_latitude !== undefined && my_longitude !== undefined) {
            let venueLat = result[i]['latitude'];
            let venueLon = result[i]['longitude'];
            let distance = getDistance(my_latitude, venueLat, my_longitude, venueLon);
            result[i]['distance'] = distance;

        } else if (sort_by === "DISTANCE") {
            res.status(404).send("Not Found");
            return;
        }
    }


    for (let i=0; i<result.length; i++) {
        let result5 = null;
        try {
            result5 = await Venue.getMeanStarRating(result[i]['venueId']);
        } catch (err) {
            console.log(err);
            res.status(500).send('Server Error');
            return;
        }

        if (result5[0]['average'] === null) {
            result[i]['meanStarRating'] = 0;
        } else {
            result[i]['meanStarRating'] = result5[0]['average'];
        }
    }

    for (let i=0; i<result.length; i++) {
        let result6 = null;
        try {
            result6 = await Venue.getPrimaryPhoto(result[i]['venueId']);
        } catch (err) {
            console.log(err);
            res.status(500).send('Server Error');
            return;
        }

        if (result6[0] === undefined) {
            result[i]['primaryPhoto'] = null;
        } else {
            result[i]['primaryPhoto'] = result6[0]['photo_filename'];
        }
    }

    for (let i=0; i<result.length; i++) {
        let result7 = null;
        try {
            result7 = await Venue.getModeCostRating(result[i]['venueId']);
        } catch (err) {
            console.log(err);
            res.status(500).send('Server Error');
            return;
        }

        if (result7[0] === undefined) {
            result[i]['modeCostRating'] = 0;
        } else {
            result[i]['modeCostRating'] = result7[0]['mode_cost_rating'];
        }
    }


    let output = [];

    for (let i=0; i<result.length; i++) {
        output.push({
            "venueId": result[i]['venueId'],
            "venueName": result[i]['venueName'],
            "categoryId": result[i]['categoryId'],
            "city": result[i]['city'],
            "shortDescription": result[i]['shortDescription'],
            "latitude": result[i]['latitude'],
            "longitude": result[i]['longitude'],
            "meanStarRating": result[i]['meanStarRating'],
            "modeCostRating": result[i]['modeCostRating'],
            "primaryPhoto": result[i]['primaryPhoto'],
            "distance": result[i]['distance']
        });
    }




    // //TODO sort by distance
    let asc_dec = null;
    if (sort_by !== undefined) {
        if (sort_by === "DISTANCE" || sort_by === "STAR_RATING") {
            asc_dec = "ASC";
        } else {
            asc_dec = "DESC";
        }
    }

    if (reverse_sort === "true") {
        if (sort_by === "DISTANCE" || sort_by === "STAR_RATING") {
            asc_dec = "DESC";
        } else {
            asc_dec = "ASC";
        }
    }

    if (sort_by === "DISTANCE" && my_longitude === undefined && my_latitude === undefined) {
        res.status(400).send('Bad Request');
        return;
    }

    if (sort_by === "DISTANCE" && asc_dec === "ASC") {
        output.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat((b.distance));
        });
    } else if (sort_by === "DISTANCE" && asc_dec === "DESC") {
        output.sort(function(a, b) {
            return parseFloat((a.distance) - parseFloat((b.distance)))*-1;
        });
    } else if (sort_by === "STAR_RATING" && asc_dec === "DESC") {
        output.sort(function(a, b) {
            return parseFloat(a.meanStarRating) - parseFloat((b.meanStarRating));
        });
    } else if (sort_by === "STAR_RATING" && asc_dec === "ASC") {
        output.sort(function (a, b) {
            return parseFloat((a.meanStarRating) - parseFloat((b.meanStarRating))) * -1;
        });
    } else if (sort_by === "COST_RATING" && asc_dec === "DESC") {
        output.sort(function (a, b) {
            return parseFloat(a.modeCostRating) - parseFloat((b.modeCostRating));
        });
    } else if (sort_by === "COST_RATING" && asc_dec === "ASC") {
        output.sort(function (a, b) {
            return parseFloat((a.modeCostRating) - parseFloat((b.modeCostRating))) * -1;
        });
    }

    res.status(200);
    res.json(output);
};