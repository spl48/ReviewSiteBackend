const  db  =  require ( '../../config/db' );

exports . authorize = async function (authToken) {
    try {
        let result = await db.getPool().query('SELECT user_id FROM User WHERE auth_token=?', authToken);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . insert  =  async function (values) {
    try {
        let result = db.getPool().query('INSERT INTO Venue (admin_id, category_id, venue_name, city, short_description, long_description, date_added, address, latitude, longitude) VALUES (?,?,?,?,?,?,?,?,?,?)', values);
        return result;
    } catch (err) {
        throw (err);
    }

};

exports . getOne = async function (venueId) {
    try {
        let result = db.getPool().query('SELECT * FROM Venue WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getCategory = async function (categoryId) {
    try {
        let result = db.getPool().query('SELECT * FROM VenueCategory WHERE category_id=?', categoryId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getUsername = async function (userId) {
    try {
        let result = db.getPool().query('SELECT username FROM User WHERE user_id=?', userId);
        return result;
    } catch (err) {
        throw (err);
    }
}