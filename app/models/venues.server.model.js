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

exports . getUsername = async function (userId) {
    try {
        let result = db.getPool().query('SELECT username FROM User WHERE user_id=?', userId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . updateCategoryId = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET category_id=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateName = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET venue_name=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateCity = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET city=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateShDescription = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET short_description=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateLoDescription = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET long_description=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateDateAdded = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET date_added=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateAddress = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET address=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateLatitude = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET latitude=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . updateLongitude = async function (values) {
    try {
        let result = await db.getPool().query('UPDATE Venue SET longitude=? WHERE venue_id=?', values);
        return result;
    } catch (err) {
        return 500;
    }
};

exports . getCategoryInfo = async function (categoryId) {
    try {
        let result = await db.getPool().query('SELECT category_id AS categoryId, category_name AS categoryName, category_description AS categoryDescription' +
            ' FROM VenueCategory WHERE category_id=?', categoryId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getCategories = async function () {
    try {
        let result = await db.getPool().query('SELECT category_id AS categoryId, category_name AS categoryName, category_description AS categoryDescription' +
            ' FROM VenueCategory');
        return result;
    } catch (err) {
        throw (err);
    }
};


exports . getVenuePhoto = async function (venueId) {
    try {
        let result = await db.getPool().query('SELECT photo_filename AS photoFilename, photo_description AS photoDescription, is_primary AS isPrimary FROM VenuePhoto WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getVenues = async function (queryString, queryValues) {
    try {
        let result = await db.getPool().query(queryString, queryValues);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getIdsOverMinStar = async function (min_star_rating) {
    try {
        let result = await db.getPool().query('SELECT reviewed_venue_id FROM (SELECT reviewed_venue_id, AVG(star_rating) as average FROM Review GROUP BY reviewed_venue_id) AS NAME WHERE average >= ?', min_star_rating);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getIdsUnderMaxCost = async function (max_cost_rating) {
    try {
        let result = await db.getPool().query('SELECT venue_id FROM ModeCostRating WHERE mode_cost_rating <= ?', max_cost_rating);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getMeanStarRating = async function (venueId) {
    try {
        let result = await db.getPool().query('SELECT AVG(star_rating) as average FROM Review WHERE reviewed_venue_id=? ', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getPrimaryPhoto = async function (venueId) {
    try {
        let result = await db.getPool().query('SELECT photo_filename FROM VenuePhoto WHERE venue_id=? AND is_primary=1', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};

exports . getModeCostRating = async function (venueId) {
    try {
        let result = db.getPool().query('SELECT mode_cost_rating FROM ModeCostRating WHERE venue_id=?', venueId);
        return result;
    } catch (err) {
        throw (err);
    }
};
