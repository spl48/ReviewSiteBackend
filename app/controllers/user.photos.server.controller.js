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

    if (profilePicture.length === 0) {
        res.status(400).send('Bad Request');
        return;
    }

    let type = null;
    if (imageType === "image/png") {
        type = "png";
    } else if (imageType === "image/jpeg") {
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

    let result2 = null;
    try {
        result2 = await UserPhoto.getUser(requestedUserId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (result2.length === 0) {
        res.status(404).send('Not Found');
        return;
    }

    if (requestedUserId.toString() !== userId.toString()) {
        res.status(403).send('Forbidden');
        return;
    }

    let filename = 'app/storage/photos/users_' + userId.toString() + "." + type;

    try {
        await fs.writeFileSync(filename, profilePicture)
    } catch (err) {
        res.status(500).send('Error');
        return;
    }

    let dbPicture = null;
    try {
        dbPicture = await UserPhoto.getPicture(userId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let result1 = null;
    try {
        result1 = await UserPhoto.updatePic([filename, userId]);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (dbPicture[0]['profile_photo_filename'] === null) {
        res.status(201).send('Created');
        return;
    } else {
        res.status(200).send('OK');
        return;
    }

    // console.log(result1);
    // if (result1['changedRows'] === 1) {
    //     res.status(201).send('Created');
    //     return;
    // } else {
    //     res.status(200).send('OK');
    //     return;
    // }

    // await fs.readFile('resources', (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    // });

};

exports . retrieve = async function (req , res) {

    let requestedUserId = req.params.id;

    let result2 = null;
    try {
        result2 = await UserPhoto.getUser(requestedUserId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (result2.length === 0) {
        res.status(404).send('Not Found');
        return;
    }

    let dbPicture = null;
    try {
        dbPicture = await UserPhoto.getPicture(requestedUserId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let filename = dbPicture[0]['profile_photo_filename'];

    if (filename === null) {
        res.status(404).send('Not Found');
        return;
    }

    let picture = null;
    try {
        picture = await fs.readFileSync(filename)
    } catch (err) {
        res.status(500).send('Error');
        return;
    }

    let fileType = filename.slice(-3);
    if (fileType === "png") {
        fileType = "image/png";
    } else if (fileType === "jpg") {
        fileType = "image/jpeg";
    } else {
        res.status(400).send('Bad Request');
        return;
    }

    res.append('content-type', fileType);
    res.status(200).send(picture);
};

exports . delete = async function (req , res) {
    let data = {
        "authorization": req.header('X-Authorization'),
        "user_id": req.params.id
    };

    let authToken = data['authorization'];
    let requestedUserId = data['user_id'];

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

    let result2 = null;
    try {
        result2 = await UserPhoto.getUser(requestedUserId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    if (result2.length === 0) {
        res.status(404).send('Not Found');
        return;
    }

    if (requestedUserId.toString() !== userId.toString()) {
        res.status(403).send('Forbidden');
        return;
    }

    let dbPicture = null;
    try {
        dbPicture = await UserPhoto.getPicture(requestedUserId);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    let filename = dbPicture[0]['profile_photo_filename'];

    if (filename == null) {
        res.status(404).send('Not Found');
        return;
    }

    try {
        await UserPhoto.updatePic([null, userId]);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    try {
        await fs.unlinkSync(filename);
    } catch (err) {
        res.status(500).send('Server Error');
        return;
    }

    res.status(200).send('OK');

};