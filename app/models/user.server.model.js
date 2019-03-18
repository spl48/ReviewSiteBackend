const  db  =  require ( '../../config/db' );
exports . insert  =  function (values, done){
    db.getPool().query('INSERT INTO User (username, email, given_name, family_name, password) VALUES (?,?,?,?,?)', values, function(err, result) {
        if (err) return done(err);

        done(result);
    });

};

exports . verify = function(values, authToken, done){
    db.getPool().query('SELECT user_id FROM User WHERE (username=? OR email=?) AND BINARY password=?', values, function(err, result) {
        if (err) return done(err);

        done(result);
    });
    db.getPool().query('UPDATE User SET auth_token=? WHERE username=?', [authToken, values[0]]);
};

exports . authorize = function (authToken, done) {
    db.getPool().query('SELECT user_id FROM User WHERE auth_token=?', authToken, function(err, result) {
        if (err) return done(err);

        done(result);
    });
};

exports . removeToken = function (userID, done) {
    db.getPool().query('UPDATE User SET auth_token=NULL WHERE user_id=?', userID, function (err, result) {
        if (err) return done(err);

        done(result);
    });
};