const  db  =  require ( '../../config/db' );

exports . insert = async function (filename) {
    try {
        let result = await db.getPool().query('INSERT into User profile_photo_filename VALUES ?', filename);
        return result;
    } catch (err) {
        throw (err);
    }
};