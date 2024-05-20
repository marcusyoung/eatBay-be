const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("Seed data", () => {
    test("Should seed the test data", () => {
        
    })
})