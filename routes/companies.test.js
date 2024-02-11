process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

const mockCompany = {
    code: 'MOCK123',
    name: 'Mock Company',
    description: 'This is a mock company for testing purposes'
};

describe('GET /companies', () => {
    test('It should respond with a list of companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
        expect(response.body.companies).toBeDefined();
    });
});


describe('GET /companies/:code', () => {
    test('It should respond with a single company', async () => {
        const response = await request(app).get(`/companies/${mockCompany.code}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.company).toBeDefined();
        expect(response.body.company).toEqual(mockCompany);
    });

    test('It should respond with 404 if company not found', async () => {
        const response = await request(app).get('/companies/INVALID_CODE');
        expect(response.statusCode).toBe(404);
    });
});

describe('POST /companies', () => {
    test('It should create a new company', async () => {
        const newCompany = { code: 'NEW', name: 'New Company', description: 'A new test company' };
        const response = await request(app)
            .post('/companies')
            .send(newCompany);
        expect(response.statusCode).toBe(201);
        expect(response.body.company).toBeDefined();
    });
});

describe('PUT /companies/:code', () => {
    test('It should update an existing company', async () => {
        const updatedCompany = { name: 'Updated Company', description: 'An updated test company' };
        const response = await request(app)
            .put(`/companies/${mockCompany.code}`)
            .send(updatedCompany);
        expect(response.statusCode).toBe(200);
        expect(response.body.company).toBeDefined();
        expect(response.body.company).toEqual({ ...mockCompany, ...updatedCompany });
    });

    test('It should respond with 404 if company not found', async () => {
        const response = await request(app)
            .put('/companies/INVALID_CODE')
            .send({ name: 'Updated Company', description: 'An updated test company' });
        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /companies/:code', () => {
    test('It should delete an existing company', async () => {
        const testCompanyCode = 'TEST'; // Assuming you have a test company code
        const response = await request(app).delete(`/companies/${testCompanyCode}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('deleted');
    });

    test('It should respond with 404 if company not found', async () => {
        const response = await request(app).delete('/companies/INVALID_CODE');
        expect(response.statusCode).toBe(404);
    });
});
