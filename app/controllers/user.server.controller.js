const  User  =  require ( '../models/user.server.model' );
exports . create  =  function ( req , res ){

    //Check if username is empty
    if (req.body.username == null || req.body.username == "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if email is empty
    if (req.body.email == null || req.body.email == "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    //Check if email is valid
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (!validateEmail(req.body.email)) {
        res.status(400).send({error: 'Bad email'});
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
        res.json(result);
    });
};