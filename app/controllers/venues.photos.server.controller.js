const  VenuePhoto  =  require ( '../models/venues.photos.server.model' );
const fs = require('fs');

exports . upload = async function (req , res) {
    let data = {
        "authorization": req.header('X-Authorization'),
        "venue_id": req.params.id,
        "picture": req.files,
        "description": req.body['description'],
        "makePrimary": req.body['makePrimary']
    };

    let authToken = data['authorization'];
    let requestedVenueId = data['venue_id'];
    let buffer = data['picture'];
    let description = data['description'];
    let makePrimary = data['makePrimary'];

    let isPrimary = 0;
    if (makePrimary === "true") {
        makePrimary = true;
        isPrimary = 1;
    } else if (makePrimary === "false") {
        makePrimary = false;
    } else {
        res.status(400).send('Bad Request');
        return;
    }

    if (buffer[0] === undefined || description === undefined || description === "" || description === null) {
        res.status(400).send('Bad Request');
        return;
    }

    let picture = buffer[0]['buffer'];

    if (authToken === null || authToken === undefined || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = null;
    try {
        result = await VenuePhoto.authorize(authToken);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let userId = null;
    if (result.length !== 0) {
        userId = result[0]['user_id'];
    } else {
        res.status(401).send('Unauthorized');
        return;
    }

    let result2 = null;
    try {
        result2 = await VenuePhoto.getVenueAdmin(requestedVenueId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let requestedVenueAdminId = null;
    if (result2.length === 0) {
        res.status(404).send('Not Found');
        return;
    } else {
        requestedVenueAdminId = result2[0]['admin_id']
    }

    if (requestedVenueAdminId.toString() !== userId.toString()) {
        res.status(403).send('Forbidden');
        return;
    }

    let base = 'app/storage/photos/';
    let filename = buffer[0]['originalname'];

    try {
        await fs.writeFileSync(base + filename, picture);
    } catch (err) {
        res.status(500).send('Error');
        return;
    }

    if (makePrimary) {
        try {
            await VenuePhoto.makePrimary(requestedVenueId);
        } catch (err) {
            console.log(err);
            res.status(500).send('Server Error');
            return;
        }
    }

    let values = [
        Number.parseInt(requestedVenueId),
        filename,
        description,
        isPrimary
    ];

    try {
        await VenuePhoto.addVenuePhoto(values);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;
    }

    res.status(201).send('Created');
};

exports . setPrimary = async function (req , res) {
    let data = {
        "authorization": req.header('X-Authorization'),
        "venue_id": req.params.id,
        "filename": req.params.filename,
    };

    let authToken = data['authorization'];
    let requestedVenueId = data['venue_id'];
    let filename = data['filename'];

    if (authToken === null || authToken === undefined || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = null;
    try {
        result = await VenuePhoto.authorize(authToken);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let userId = null;
    if (result.length !== 0) {
        userId = result[0]['user_id'];
    } else {
        res.status(401).send('Unauthorized');
        return;
    }

    let result2 = null;
    try {
        result2 = await VenuePhoto.getVenueAdmin(requestedVenueId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let requestedVenueAdminId = null;
    if (result2.length === 0) {
        res.status(404).send('Not Found');
        return;
    } else {
        requestedVenueAdminId = result2[0]['admin_id']
    }

    if (requestedVenueAdminId.toString() !== userId.toString()) {
        res.status(403).send('Forbidden');
        return;
    }

    let result3 = null;
    try {
        await VenuePhoto.makePrimary(requestedVenueId);
        result3 = await VenuePhoto.makePrimaryWithFilename(filename);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;
    }

    if (result3['affectedRows'] === 0) {
        res.status(404).send('Not Found');
        return;
    }

    res.status(200).send('OK');
};