const  UserPhoto  =  require ( '../models/user.photos.server.model' );
const fs = require('fs');

exports . upload = async function (req , res) {
    let data = {
        "authorization": req.header('X-Authorization'),
        "user_id": req.params.id,
        "profile_picture": req.body,
        "image_type": req.headers['content-type']
    };

    let authToken = data['authorization'];
    let requestedUserId = data['user_id'];
    let profilePicture = data['profile_picture'];
    let imageType = data['image_type'];

    let type = null;
    if (imageType === "image/png") {
        type = "png";
    } else if (imageType === "image/png") {
        type = "jpg";
    } else {
        res.status(400).send('Bad Request');
        return;
    }

    if (authToken === null || authToken === undefined || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = null;
    try {
        result = await UserPhoto.authorize(authToken);
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

    if (requestedUserId.toString() !== userId.toString()) {
        res.status(403).send('Forbidden');
        return;
    }

    let filename = 'app/storage/photos/users_' + userId.toString() + "." + type;
    fs.writeFile( filename, profilePicture, function (err) {
        if (err) {
            res.status(800).send('Error'); //TODO maybe error means file doesn't exist??
            return;
        }
    });

    let result1 = null;
    try {
        result1 = await UserPhoto.updatePic([filename, userId]);
    } catch (err) {
        res.status(500).send('Server Error');
        return;

    }

    if (type === "jpg") {
        res.status(201).send('Created');
        return;
    } else {
        res.status(200).send('OK');
        return;
    }

    // await fs.readFile('resources', (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    // });
};