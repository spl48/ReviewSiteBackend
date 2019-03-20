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
        result = await Venues.getOne(venueId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (result.length === 0) {
        res.status(404).send('Not Found')
        return;
    }

    let data = result[0];

    let categoryInfo = null;
    try {
        categoryInfo = await Venues.getCategory(data['venue_id']);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let userInfo = null;
    try {
        userInfo = await Venues.getUsername(data['admin_id']);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let username = userInfo[0];

    res.json({venueName: data['venue_name'],
            admin: {
                userId: data['admin_id'],
                username: username['username']
            },
            category: {
                categoryId: data['category_id'],
                categoryName: categoryInfo[0]['category_name'],
                categoryDescription: categoryInfo[0]['category_description']
            },
            city: data['city'],
            shortDescription: data['short_description'],
            longDescription: data['long_description'],
            dateAdded: data['date_added'],
            address: data['address'],
            latitude: data['latitude'],
            longitude: data['longitude'],
            photos: [
                {
                    photoFilename: "lorem.png",
                    photoDescription: "lorem ipsum",
                    isPrimary: false
                }
            ]
        })
};

exports . update = async function (req , res) {

};