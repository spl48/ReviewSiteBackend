const  db  =  require ( '../../config/db' );

exports . authorize = async function (authToken) {
    try {
        let result = await db.getPool().query('SELECT user_id FROM User WHERE auth_token=?', authToken);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getVenueAdmin = async function (venueId) {
    try {
        let result =  await db.getPool().query('SELECT admin_id FROM Venue WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . addVenuePhoto = async function (values) {
    try {
        let result =  await db.getPool().query('INSERT INTO VenuePhoto (venue_id, photo_filename, photo_description, is_primary) VALUES (?,?,?,?)', values);
        return result;
    } catch (err) {
        throw (err);
    }
}