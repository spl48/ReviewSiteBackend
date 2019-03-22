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
};

exports . makePrimary = async function (venueId) {
    try {
        let result =  await db.getPool().query('UPDATE VenuePhoto SET is_primary=0 WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . makePrimaryWithFilename = async function (filename) {
    try {
        await db.getPool().query('UPDATE VenuePhoto SET is_primary=1 WHERE photo_filename=?', filename);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getPicture = async function (venueId, filename) {
    try {
        let result = await db.getPool().query('SELECT * FROM VenuePhoto WHERE venue_id=? AND photo_filename=?', [venueId, filename]);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getVenue = async function (venueId) {
    try {
        let result = db.getPool().query('SELECT * FROM Venue WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . yoza = async function () {
    try {
        let result = await db.getPool().query('SELECT * FROM VenuePhoto');
        return result;
    } catch (err) {
        throw (err);
    }
};