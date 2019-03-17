const  db  =  require ( '../../config/db' );
exports . insert  =  function (values, done){
    db.getPool().query('INSERT INTO User (username, email, given_name, family_name, password) VALUES (?,?,?,?,?)', values, function(err, result) {
        if (err) return done(err);

        done(result);
    });

};

exports . verify = function(values, done){
    db.getPool().query('SELECT user_id FROM User WHERE (username=? OR email=?) AND BINARY password=?', values, function(err, result) {
        if (err) return done(err);

        done(result);
    });
}