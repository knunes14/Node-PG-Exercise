process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('GET /invoices', () => {
    test('It should respond with a list of invoices', async () => {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toBe(200);
        expect(response.body.invoices).toBeDefined();
    });
});

describe('GET /invoices/:id', () => {
    test('It should respond with a single invoice', async () => {
        // Assuming there's at least one invoice in the database
        const testInvoiceId = 1;
        const response = await request(app).get(`/invoices/${testInvoiceId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.invoice).toBeDefined();
    });

    test('It should respond with 404 if invoice not found', async () => {
        const response = await request(app).get('/invoices/1'); //Assumes 1 is a valid id
        expect(response.statusCode).toBe(404);
    });
});

describe('POST /invoices', () => {
    test('It should create a new invoice', async () => {
        const newInvoice = { comp_code: 'COMP123', amt: 100 };
        const response = await request(app)
            .post('/invoices')
            .send(newInvoice);
        expect(response.statusCode).toBe(201);
        expect(response.body.invoice).toBeDefined();
    });
});

describe('PUT /invoices/:id', () => {
    test('It should update an existing invoice', async () => {
        const updatedInvoice = { amt: 200 };
        // Assuming there's at least one invoice in the database
        const testInvoiceId = 1;
        const response = await request(app)
            .put(`/invoices/${testInvoiceId}`)
            .send(updatedInvoice);
        expect(response.statusCode).toBe(200);
        expect(response.body.invoice).toBeDefined();
    });

    test('It should respond with 404 if invoice not found', async () => {
        const response = await request(app)
            .put('/invoices/1') //Assumes 1 is a valid id
            .send({ amt: 200 });
        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /invoices/:id', () => {
    test('It should delete an existing invoice', async () => {
        // Assuming there's at least one invoice in the database
        const testInvoiceId = 1;
        const response = await request(app).delete(`/invoices/${testInvoiceId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('deleted');
    });

    test('It should respond with 404 if invoice not found', async () => {
        const response = await request(app).delete('/invoices/1'); //Assumes 1 is a valid id
        expect(response.statusCode).toBe(404);
    });
});
