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
        let result = db.getPool().query('SELECT admin_id FROM Venue WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . checkUsersReviews = async function (values) {
    try {
        let result = db.getPool().query('SELECT * FROM Review WHERE reviewed_venue_id=? AND review_author_id=?', values);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . insert  =  async function (values) {
    try {
        let result = db.getPool().query('INSERT INTO Review (reviewed_venue_id, review_author_id, review_body, star_rating, cost_rating, time_posted) VALUES (?,?,?,?,?,?)', values);
        return result;
    } catch (err) {
        throw (err);
    }
};