const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

//**GET /invoices :** Return info on invoices: like `{invoices: [{id, comp_code}, ...]}`

router.get('/invoices', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM invoices`);
        return res.json({invoices: result.rows});
    } catch (e) {
        return next(e);
    }
})

//**GET /invoices/[id] :** Returns obj on given invoice.
//If invoice cannot be found, returns 404. Returns `{invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}`

router.get('/invoices/:id', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found`, 404);
        }
        return res.json({invoice: result.rows[0]});
    } catch (e) {
        return next(e);
    }
})

//**POST /invoices :** Adds an invoice. Needs to be passed in JSON body of: `{comp_code, amt}`
//Returns: `{invoice: {id, comp_code, amt, paid, add_date, paid_date}}`

router.post('/invoices', async (req, res, next) => {
    try {
        const result = await db.query(`
            INSERT INTO invoices
            (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date
        `, [req.body.comp_code, req.body.amt]);
        return res.status(201).json({invoice: result.rows[0]});
    } catch (e) {
        return next(e);
    }
})

//**PUT /invoices/[id] :** Updates an invoice. If invoice cannot be found, returns a 404.
//Needs to be passed in a JSON body of `{amt}` Returns: `{invoice: {id, comp_code, amt, paid, add_date, paid_date}}`

request.put('/invoices/:id', async (req, res, next) => {
    try {
        const result = await db.query(`
            UPDATE invoices
            SET amt = $1
            WHERE id = $2
            RETURNING id, comp_code, amt, paid, add_date, paid_date
        `, [req.body.amt, req.params.id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found`, 404);
        }
        return res.json({invoice: result.rows[0]});
    } catch (e) {
        return next(e);
    }
})

//**DELETE /invoices/[id] :** Deletes an invoice.If invoice cannot be found, returns a 404. Returns: `{status: "deleted"}` Also, one route from the previous part should be updated:

request.delete('/invoices/:id', async (req, res, next) => {
    try {
        const result = await db.query(`
            DELETE FROM invoices
            WHERE id = $1
            RETURNING id
        `, [req.params.id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found`, 404);
        }
        return res.json({status: "deleted"});
    } catch (e) {
        return next(e);
    }
})

//**GET /companies/[code] :** Return obj of company: `{company: {code, name, description, invoices: [id, ...]}}` If the company given cannot be found, this should return a 404 status response.

request.get('/companies/:code', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM companies WHERE code = $1`, [req.params.code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found`, 404);
        }
        return res.json({company: result.rows[0]});
    } catch (e) {
        return next(e);
    }
})