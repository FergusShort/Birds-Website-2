const express = require('express');
const pool = require('./db');
const path = require('path');

router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('/birds')
});

router.get('/birds', async (req, res) => {
    try {
        const db = pool.promise();
        
        const status_query = `SELECT * FROM ConservationStatus;`;
        const [status_rows] = await db.query(status_query);
        
        const birds_query = `
        SELECT Bird.*, ConservationStatus.status_name, ConservationStatus.status_colour, Photos.filename
        FROM Bird
        JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
        LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id;
    `;
    
        const [bird_rows] = await db.query(birds_query);

        res.render('index', { title: 'Birds of Aotearoa', birds: bird_rows, status: status_rows });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Internal server error');
    }
});


router.get('/birds/create', async (req, res) => {
    try {
        const db = pool.promise();
        const status_query = `SELECT * FROM ConservationStatus;`;
        const [status_rows] = await db.query(status_query);
        res.render('create-bird', { title: 'Create a New Bird', status: status_rows });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Internal server error');
    }
});

router.get('/birds/:id', async (req, res) => {
    const birdId = req.params.id;
    try {
        const db = pool.promise();
        
        const status_query = `SELECT * FROM ConservationStatus;`;
        const [status_rows] = await db.query(status_query);
        
        const bird_query = `
            SELECT Bird.*, ConservationStatus.status_name, ConservationStatus.status_colour, Photos.filename
            FROM Bird
            JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
            LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id
            WHERE Bird.bird_id = ?;
        `;
        const [bird_rows] = await db.query(bird_query, [birdId]);

        if (bird_rows.length === 0) {
            res.status(404);
            res.render('404-page');
        
        }

        res.render('bird-details', { title: 'Bird Details', bird: bird_rows[0], status: status_rows });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Internal server error');
    }
});







router.get('/birds/:id/update', async (req, res) => {
    const birdId = req.params.id;
    try {
        const db = pool.promise();

        const bird_query = `
            SELECT Bird.*, ConservationStatus.status_name, ConservationStatus.status_colour, Photos.filename, Photos.photographer
            FROM Bird
            JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
            LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id
            WHERE Bird.bird_id = ?;
        `;
        const [bird_rows] = await db.query(bird_query, [birdId]);

        if (bird_rows.length === 0) {
            return res.status(404).send('Bird not found');
        }

        const status_query = `SELECT * FROM ConservationStatus;`;
        const [status_rows] = await db.query(status_query);

        res.render('update-bird', {
            title: 'Update Bird Details',
            bird: bird_rows[0],
            status: status_rows
        });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Internal server error');
    }
});


router.get('/birds/:id/delete', async (req, res) => {
    const birdId = req.params.id;
    try {
        const db = pool.promise();
         await db.query('DELETE FROM Photos WHERE bird_id = ?', [birdId]);
         await db.query('DELETE FROM Bird WHERE bird_id = ?', [birdId]);
        res.redirect('/birds');
    } catch (err) {
        console.error("Error deleting bird:", err);
        res.status(500).send('Internal server error');
    }
});



router.post('/birds/create', async (req, res) => {
    const { bird_id, primary_name, english_name, scientific_name, order_name, family, length, weight, status_id } = req.body;
    const file = req.files.filename;

    if (!bird_id || !primary_name || !english_name || !scientific_name || !order_name || !family || !length || !weight || !status_id || !file) {
        return res.status(400).send('All fields are required');
    }

    const db = pool.promise();
    try {
        const [existingBirds] = await db.query('SELECT * FROM Bird WHERE bird_id = ?', [bird_id]);
        if (existingBirds.length > 0) {
            return res.status(400).send('Bird ID already exists');
        }

        const filename = file.name;
        const uploadPath = path.join(__dirname, 'public/images', filename);
        file.mv(uploadPath, async (err) => {
            if (err) {
                console.error("File upload error:", err);
                return res.status(500).send('File upload failed');
            }

            const insert_query = `
                INSERT INTO Bird (bird_id, primary_name, english_name, scientific_name, order_name, family, length, weight, status_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            await db.query(insert_query, [bird_id, primary_name, english_name, scientific_name, order_name, family, length, weight, status_id]);

            const photo_query = `
                INSERT INTO Photos (filename, photographer, bird_id)
                VALUES (?, ?, ?);
            `;
            await db.query(photo_query, [filename, req.body.photographer, bird_id]);

            res.redirect('/birds');
        });
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Internal server error');
    }
});



router.post('/birds/edit', async (req, res) => {
    const { bird_id, primary_name, english_name, scientific_name, order_name, family, length, weight, status_id, photographer } = req.body;
    const file = req.files?.filename;  

    if (!bird_id || !primary_name || !english_name || !scientific_name || !order_name || !family || !length || !weight || !status_id) {
        return res.status(400).send('All fields are required');
    }

    const db = pool.promise();
    try {
        
        const update_query = `
            UPDATE Bird
            SET primary_name = ?, english_name = ?, scientific_name = ?, order_name = ?, family = ?, length = ?, weight = ?, status_id = ?
            WHERE bird_id = ?;
        `;
        const [update_result] = await db.query(update_query, [primary_name, english_name, scientific_name, order_name, family, length, weight, status_id, bird_id]);
        console.log('Bird update result:', update_result);

        
        if (file) {
            const filename = file.name;
            const uploadPath = path.join(__dirname, 'public/images', filename);

            file.mv(uploadPath, async (err) => {
                if (err) {
                    console.error("File upload error:", err);
                    return res.status(500).send('File upload failed');
                }

                const photo_query = `
                UPDATE Photos
                SET filename = ?, photographer = ?
                WHERE bird_id = ?;
            `;
            
                const [photo_result] = await db.query(photo_query, [filename, photographer, bird_id]);
                console.log('Photo update result:', photo_result);

                res.redirect('/birds');
            });
        } else {
            const [existing_photo] = await db.query(`SELECT * FROM Photos WHERE bird_id = ?`, [bird_id]);
            if (existing_photo.length > 0) {
                const photo_update_query = `
                    UPDATE Photos
                    SET photographer = ?
                    WHERE bird_id = ?;
                `;
                const [photo_update_result] = await db.query(photo_update_query, [photographer, bird_id]);
                console.log('Photo update (no file) result:', photo_update_result);
            }
            res.redirect('/birds');
        }
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send('Internal server error');
    }
});








module.exports = router;