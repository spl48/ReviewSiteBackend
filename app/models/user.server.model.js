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

exports . authorize = async function (authToken) {
    try {
        let result = await db.getPool().query('SELECT user_id FROM User WHERE auth_token=?', authToken);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getUser = async function (values) {
    try {
        let result =  await db.getPool().query('SELECT username, email, given_name, family_name FROM User WHERE user_id=?', values);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . removeToken = async function (userID) {
    try {
        let result = await db.getPool().query('UPDATE User SET auth_token=NULL WHERE user_id=?', userID);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateUsername = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE User SET username=? WHERE user_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateEmail = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE User SET email=? WHERE user_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateGivenName = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE User SET given_name=? WHERE user_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateFamilyName = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE User SET family_name=? WHERE user_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updatePassword = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE User SET password=? WHERE user_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};