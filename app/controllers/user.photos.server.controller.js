const  UserPhoto  =  require ( '../models/user.photos.server.model' );
const fs = require('fs');

exports . upload = async function (req , res) {
    let data = {
        "user_id": req.params.id,
        "profile_picture": req.body,
        "image_type": req.headers['content-type']
    };
    let userId = data['user_id'];
    let profilePicture = data['profile_picture'];
    let imageType = data['image_type'];

    let type = "jpg";
    if (imageType === "image/png") {
        type = "png";
    }

    let base = 'app/storage/photos/users_' + userId.toString();
    fs.writeFile( base + "." + type, profilePicture, (err) => {
        if (err) throw err;
        res.status(201).send('OK');
    });

    // await fs.readFile('resources', (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    // });
};