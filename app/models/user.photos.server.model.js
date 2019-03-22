const  db  =  require ( '../../config/db' );

exports . insert = async function (filename) {
    try {
        let result = await db.getPool().query('INSERT into User profile_photo_filename VALUES ?', filename);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . authorize = async function (authToken) {
    try {
        let result = await db.getPool().query('SELECT user_id FROM User WHERE auth_token=?', authToken);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . updatePic = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE User SET profile_photo_filename=? where user_id=?', values);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getUser = async function (userId) {
    try {
        let result =  await db.getPool().query('SELECT * FROM User WHERE user_id=?', userId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getPicture = async function (userId) {
    try {
        let result = await db.getPool().query('SELECT profile_photo_filename FROM User WHERE user_id=?', userId);
        return result;
    } catch (err) {
        throw (err);
    }
}