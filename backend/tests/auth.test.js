process.env.JWT_SECRET = "test_jwt_secret";
process.env.JWT_EXPIRES_IN = "1h";

const request = require("supertest");

const app = require("../src/app");

jest.mock("../src/models/userModel");

const userModel = require("../src/models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Signup succeeds for new user", async () => {
    userModel.findUserByEmail.mockResolvedValue(null);
    userModel.createUser.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      role: "user",
    });

    const res = await request(app).post("/auth/signup").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test("Signup fails if email already exists", async () => {
    userModel.findUserByEmail.mockResolvedValue({ email: "test@example.com" });

    const res = await request(app).post("/auth/signup").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
  });

  test("Login succeeds with valid credentials", async () => {
    const hash = await bcrypt.hash("password123", 10);

    userModel.findUserByEmail.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      password_hash: hash,
      role: "user",
      status: "active",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Login fails with wrong password", async () => {
    const hash = await bcrypt.hash("password123", 10);

    userModel.findUserByEmail.mockResolvedValue({
      email: "test@example.com",
      password_hash: hash,
      role: "user",
      status: "active",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  test("Protected route fails without token", async () => {
    const res = await request(app).get("/users/me");
    expect(res.statusCode).toBe(401);
  });
});
