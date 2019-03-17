const  User  =  require ( '../models/user.server.model' );
exports . create  =  function ( req , res ){

    if (req.body.username == null || req.body.username == "") {
        res.status(400).send({error: 'Bad Request'});
        return;
    }

    if (req.body.email == null || req.body.email == "") {
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
        res.json(result);
    });
};