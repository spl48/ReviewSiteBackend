const  User  =  require ( '../models/user.server.model' );

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

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
        user, email, password
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

exports . logout = function (req , res) {
    let data = {
        "authorization": req.header('X-Authorization')
    };


    let authToken = data['authorization'];

    if (authToken == null || authToken === "") {
        res.status(401).send('Unauthorized');
        return;
    }

    User.authorize(authToken, function (result){
        if (result.length === 0) {
            res.status(401).send({error: 'Unauthorized'});
            return;
        }
        User.removeToken(result[0]['user_id'], function (){
            res.status(200).send('OK');
        });
    })
};

exports . getUserInfo = function (req , res) {
    let authorized = false;
    let requestedUser = null;

    let data = {
        "user_id": req.params.id,
        "authorization": req.header('X-Authorization')
    };

    let userID = data['user_id'];
    let authToken = data['authorization'];

    let values = [
        userID, authToken
    ];

    // User.authorize(authToken, function (result) {
    //     if (result.length !== 0) {
    //         authorized = true;
    //         requestedUser = result[0]['user_id'];
    //     } else {
    //         res.status(404).send({error: 'Not Found'});
    //     }
    // });

    // User.getUser(values, function (result) {
    //     if (authorized && userID.toString() === requestedUser.toString()) {
    //         res.status(200);
    //         res.json({
    //             username: result[0]['username'],
    //             email: result[0]['email'],
    //             givenName: result[0]['given_name'],
    //             familyName: result[0]['family_name']
    //         });
    //     } else if (authorized && userID.toString() !== requestedUser.toString()) {
    //         res.status(200);
    //         res.json({
    //             username: result[0]['username'],
    //             givenName: result[0]['given_name'],
    //             familyName: result[0]['family_name']
    //         });
    //     }
    // })
};