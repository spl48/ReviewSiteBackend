const  User  =  require ( '../models/user.server.model' );

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

String.prototype.hash = function () {
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

exports . create  =  function ( req , res ){

    //Check if username is empty
    if (req.body.username == null || req.body.username === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if email is empty
    if (req.body.email == null || req.body.email === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if givenName is empty
    if (req.body.givenName == null || req.body.givenName === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if familyName is empty
    if (req.body.familyName == null || req.body.familyName === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if password is empty
    if (req.body.password == null || req.body.password === "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if email is valid

    if (!validateEmail(req.body.email)) {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    let user_data = {
        "username": req.body.username,
        "email": req.body.email,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "password": req.body.password
    };

    let user = user_data['username'].toString();
    let email = user_data['email'].toString();
    let givenName = user_data['givenName'].toString();
    let familyName = user_data['familyName'].toString();
    let password = user_data['password'].toString();


    password = password.hash();
    console.log(password);

    let values = [
        user, email, givenName, familyName, password
    ];

    User.insert(values, function(result){
        if (result['code'] === 'ER_DUP_ENTRY') {
            res.status(400).send({error: 'Username already taken'});
            return;
        }
        res.status(201);
        res.json({userId: result['insertId']});
    });
};

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};


exports . login = function (req , res) {
    let user_data = {
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password
    };

    let user = user_data['username'];
    let email = user_data['email'];
    let password = user_data['password'] ;

    if (typeof user == "undefined" && typeof email == "undefined") {
        res.status(400).send('Bad Request');
        return;
    }
    if (typeof user != "undefined" ) {
        user.toString();
    }
    if (typeof email != "undefined") {
        email.toString();
    }
    if (typeof password != "undefined") {
        password.toString();
    } else {
        res.status(400).send('Bad Request'); //No password
        return;
    }

    let values = [
        user, email, password.hash()
    ];

    let authToken = token();

    User.verify(values, authToken, function (result){
        if (result.length === 0) {
            res.status(400).send('Bad Request');
            return;
        }
        res.status(200);
        res.json({userId: result[0]['user_id'], token: authToken});
    });
};

exports . logout = async function (req , res) {
    let data = {
        "authorization": req.header('X-Authorization')
    };


    let authToken = data['authorization'];

    if (authToken == null || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    let result = await User.authorize(authToken);

    if (result.length === 0) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    }

    await User.removeToken(result[0]['user_id']);
    res.status(200).send('OK');

};

exports . getUserInfo = async function (req , res) {
    let authorized = false;
    let requestedUser = null;

    let data = {
        "user_id": req.params.id,
        "authorization": req.header('X-Authorization')
    };

    let userID = data['user_id'];
    let authToken = data['authorization'];

    if (authToken === null || authToken === undefined || authToken === "") {
        authToken = -1;
    }

    let values = [
        userID, authToken
    ];

    let result1 = null;


    try {
        result1 = await User.authorize(authToken);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;

    }

    if (result1.length !== 0) {
        authorized = true;
        requestedUser = result1[0]['user_id'];
    } else {
        requestedUser = "-1";
    }

    let result2 = null;
    try {
        result2 = await User.getUser(values);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;
    }

    if (result2.length === 0) {
        res.status(404).send({error: 'Not Found'});
    } else if (authorized && userID.toString() === requestedUser.toString()) {
        res.status(200);
        res.json({
            username: result2[0]['username'],
            email: result2[0]['email'],
            givenName: result2[0]['given_name'],
            familyName: result2[0]['family_name']
        });
    } else if ((authorized && userID.toString() !== requestedUser.toString()) || !authorized) {
        res.status(200);
        res.json({
            username: result2[0]['username'],
            givenName: result2[0]['given_name'],
            familyName: result2[0]['family_name']
        });
    }
};

exports . updateUser = async function (req , res) {
    let authorized = false;
    let requestedUser = null;

    let data = {
        "user_id": req.params.id,
        "authorization": req.header('X-Authorization'),
        "username": req.body.username,
        "email": req.body.email,
        "given_name": req.body.givenName,
        "family_name": req.body.familyName,
        "password": req.body.password
    };

    requestedUser = data['user_id'];
    let authToken = data['authorization'];

    let username = data['username'];
    let email = data['email'];
    let givenName = data['given_name'];
    let familyName = data['family_name'];
    let password = data['password'];

    if (authToken === null || authToken === undefined || authToken === "") {
        authToken = -1;
    }

    let result1 = null;

    try {
        result1 = await User.authorize(authToken);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;

    }

    let userId = null;
    if (result1.length !== 0) {
        authorized = true;
        userId = result1[0]['user_id'];
    } else {
        //userId = "-1";
        res.status(401).send('Unauthorized');
        return;
    }

    if (typeof username == "undefined" && typeof email == "undefined" && typeof givenName == "undefined" && typeof familyName == "undefined" && typeof password == "undefined") {
        res.status(400).send('Bad Request');
        return;
    }


    if (username === "" || typeof username == "number" || validateEmail(email) || givenName === "" || typeof givenName == "number" ||
    familyName === "" || typeof familyName == "number" || password === "" || typeof password == "number") {
        res.status(400).send('Bad Request');
        return;
    }
    if (userId.toString() !== requestedUser.toString()) {
        res.status(403).send('Forbidden');
        return;
    }

    if (typeof username != "undefined" ) {
        await User.updateUsername([username, userId]);
    }

    if (typeof email != "undefined" ) {
        await User.updateEmail([email, userId]);
    }

    if (typeof givenName != "undefined" ) {
        await User.updateGivenName([givenName, userId]);
    }

    if (typeof familyName != "undefined" ) {
        await User.updateFamilyName([familyName, userId]);
    }

    if (typeof password != "undefined" ) {
        await User.updatePassword([password, userId]);
    }

    res.status(200).send('OK');
};