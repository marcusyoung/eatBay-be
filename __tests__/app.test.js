const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const request = require('supertest')
const expectedEndpoints = require('../endpoints.json')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("GET /api", () => {
    test('Returns json object with info about all endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const {endpoints} = body
            expect(endpoints).toEqual(expectedEndpoints)
        })
    })
})
describe("GET /api/shops", () => {
    test("GET 200 responds with a status code 200 and array of objects wtih expected properties", () => {
        return request(app)
        .get('/api/shops')
        .expect(200)
        .then(({body}) => {
            const { shops } = body
            expect(shops.length).toBe(4)
            shops.forEach((shop) => {
                expect(typeof shop.shop_name).toBe('string')
                expect(typeof shop.address).toBe('string')
                expect(typeof shop.longitude).toBe('string')
                expect(typeof shop.latitude).toBe('string')
                expect(typeof shop.shop_type).toBe('string')
            })
        })
    })
})