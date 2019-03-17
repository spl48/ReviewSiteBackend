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

    let user = "";
    let email = "";
    let password = "";

    if (typeof user_data['username'] == "undefined" && typeof user_data['email'] == "undefined") {
        res.status(400).send('Bad Request');
        return;
    }
    if (typeof user_data['username'] != "undefined" ) {
        user = user_data['username'].toString();
    }
    if (typeof user_data['email'] != "undefined") {
        email = user_data['email'].toString();
    }
    if (typeof user_data['password'] != "undefined") {
        password = user_data['password'].toString();
    } else {
        res.status(400).send('Bad Request'); //No password
        return;
    }

    let values = [
        user, email, password
    ];

    User.verify(values, function (result){
        if (result.length === 0) {
            res.status(400).send('Bad Request');
            return;
        }
        res.status(200);
        res.json({userId: result[0]['user_id'], token: token()});
    });
};