const request = require("supertest");
const crypto = require("node:crypto");

const app = require("../src/app");
const database = require("../database");
afterAll(() => database.end());
describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});
// GET //
describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");
    expect(response.status).toEqual(404);
  });
});
// POST //
describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );
    const [userInDatabase] = result;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
  });
  it("should return an error", async () => {
    const userWithMissingProps = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
    expect(response.status).toEqual(201);
  });
});
// PUT //
describe("/api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );
    const id = result.insertId;
    const updatedUsers = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUsers);

    expect(response.status).toEqual(204);
    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = users;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updatedUsers.firstname);
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUsers.lastname);
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUsers.email);
    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUsers.city);
    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUsers.language);
  });
  it("should return an error", async () => {
    const usersWithMissingProps = { firstname: "Robert" };

    const response = await request(app)
      .put(`/api/movies/1`)
      .send(usersWithMissingProps);
    expect(response.status).toEqual(422);
  });
});
describe("DELETE /api/users/:id", () => {
  it("should delete user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const [result] = await database.query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?,?,?,?,?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );
    const id = result.insertId;

    const response = await request(app).delete(`/api/users/${id}`);
    expect(response.status).toEqual(204);

    const checkResponse = await request(app).delete(`/api/users/${id}`);
    expect(checkResponse.status).toEqual(404);
  });
});
