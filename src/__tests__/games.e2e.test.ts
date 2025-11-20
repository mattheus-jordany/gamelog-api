import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../server.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

let adminToken = "";
let userToken = "";

const generateToken = (id: string, role: "USER" | "ADMIN") => {
  return jwt.sign({ role }, process.env.JWT_SECRET as string, {
    subject: id,
    expiresIn: "1d",
  });
};

describe("[GAMES] Game Catalog & Admin Security", () => {
  beforeAll(async () => {
    await prisma.userGameLog.deleteMany();
    await prisma.game.deleteMany();
    await prisma.user.deleteMany();

    const admin = await prisma.user.create({
      data: {
        name: "AdminTester",
        email: "admin@test.com",
        password: await bcrypt.hash("123", 6),
        role: "ADMIN",
      },
    });
    adminToken = generateToken(admin.id, "ADMIN");

    const user = await prisma.user.create({
      data: {
        name: "UserTester",
        email: "user@test.com",
        password: await bcrypt.hash("123", 6),
        role: "USER",
      },
    });
    userToken = generateToken(user.id, "USER");
  });

  it("Admin deve conseguir criar um novo jogo (201)", async () => {
    const response = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Game 2025",
        platform: "PC",
        genre: ["RPG", "Action"],
        releaseYear: 2025,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Game 2025");
  });

  it("Usuário comum NÃO deve conseguir criar jogo (403)", async () => {
    const response = await request(app)
      .post("/games")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Hacker Game",
        platform: "PC",
        genre: ["FPS"],
        releaseYear: 2025,
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toContain("not an admin");
  });

  it("Qualquer um deve conseguir listar os jogos (200)", async () => {
    const response = await request(app).get("/games").send(); // Rota pública

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Test Game 2025");
  });
});
