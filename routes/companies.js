const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

//**GET /companies :** Returns list of companies, like `{companies: [{code, name}, ...]}`

router.get('/companies', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM companies`);
        return res.json({companies: result.rows});
    } catch (e) {
        return next(e);
    }
});

//**GET /companies/[code] :** Return obj of company: `{company: {code, name, description}}`
//If the company given cannot be found, this should return a 404 status response.

router.get('/companies/:code', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM companies WHERE code = $1`, [req.params.code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found`, 404);
        }
        return res.json({company: result.rows[0]});
    } catch (e) {
        return next(e);
    }
});

//**POST /companies :** Adds a company. Needs to be given JSON like: `{code, name, description}` Returns obj of new company:  `{company: {code, name, description}}`

router.post('/companies', async (req, res, next) => {
    try {
        // Generate company code using slugify
        const code = slugify(req.body.name, { lower: true });
        
        const result = await db.query(`
            INSERT INTO companies
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description
        `, [code, req.body.name, req.body.description]);
        
        return res.status(201).json({ company: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});


//**PUT /companies/[code] :** Edit existing company. Should return 404 if company cannot be found.
//Needs to be given JSON like: `{name, description}` Returns update company object: `{company: {code, name, description}}`

router.put('/companies/:code', async (req, res, next) => {
    try {
        const result = await db.query(`
            UPDATE companies
            SET name = $1, description = $2
            WHERE code = $3
            RETURNING code, name, description
        `, [req.body.name, req.body.description, req.params.code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found`, 404);
        }
        return res.json({company: result.rows[0]});
    } catch (e) {
        return next(e);
    }
})

//**DELETE /companies/[code] :** Deletes company. Should return 404 if company cannot be found.
//Returns `{status: "deleted"}`

router.delete('/companies/:code', async (req, res, next) => {
    try {
        const result = await db.query(`
            DELETE FROM companies
            WHERE code = $1
            RETURNING code
        `, [req.params.code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found`, 404);
        }
        return res.json({status: "deleted"});
    } catch (e) {
        return next(e);
    }
})

