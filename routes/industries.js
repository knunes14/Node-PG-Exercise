const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.post('/industries', async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const result = await db.query(`
            INSERT INTO industries (code, industry)
            VALUES ($1, $2)
            RETURNING *
        `, [code, industry]);
        return res.status(201).json({ industry: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});

router.get('/industries', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT industries.code, industries.industry, array_agg(ci.comp_code) AS company_codes
            FROM industries
            LEFT JOIN companies_industries ci ON industries.code = ci.industry_code
            GROUP BY industries.code, industries.industry
        `);
        return res.json({ industries: result.rows });
    } catch (e) {
        return next(e);
    }
});


router.post('/companies/:comp_code/industries/:industry_code', async (req, res, next) => {
    try {
        const { comp_code, industry_code } = req.params;
        const result = await db.query(`
            INSERT INTO companies_industries (comp_code, industry_code)
            VALUES ($1, $2)
            RETURNING *
        `, [comp_code, industry_code]);
        return res.status(201).json({ company_industry: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});


router.get('/companies/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const companyResult = await db.query(`
            SELECT * FROM companies
            WHERE code = $1
        `, [code]);

        if (companyResult.rows.length === 0) {
            throw new ExpressError('Company not found', 404);
        }

        const industriesResult = await db.query(`
            SELECT industries.industry
            FROM industries
            JOIN companies_industries ci ON industries.code = ci.industry_code
            WHERE ci.comp_code = $1
        `, [code]);

        const company = companyResult.rows[0];
        const industries = industriesResult.rows.map(row => row.industry);

        company.industries = industries;

        return res.json({ company });
    } catch (e) {
        return next(e);
    }
});
