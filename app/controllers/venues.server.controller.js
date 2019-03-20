//import * as User from "../models/user.server.model";

const  Venues  =  require ( '../models/venues.server.model' );

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
    let venueName = data['venueName'].toString();
    let categoryId = data['categoryId'];
    let city = data['city'].toString();
    let shortDescription = data['shortDescription'].toString();
    let longDescription = data['longDescription'].toString();
    let address = data['address'].toString();
    let latitude = data['latitude'];
    let longitude = data['longitude'];

    if (authToken == null || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = await Venues.authorize(authToken);

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
        result1 = await Venues.insert(values);
        console.log(result);
        res.status(201)
        res.json({venueId: result1['insertId']})
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

}