import supertest from "supertest";
import app from "../../src/app";
import { recommendations } from "../factories/recommendationFactory";
import { resetDB, populateDB } from "../factories/databaseFactory";

beforeAll(async () => {
  resetDB();
  populateDB();
});

describe("POST /recommendations", () => {
  it("Should return 201 in case fields are correctly filled", async () => {
    const newRecommendation = recommendations[3];

    const result = await supertest(app)
      .post("/recommendations")
      .send(newRecommendation);

    expect(result.status).toBe(201);
  });

  it("Should return 409 in case the name is already being used", async () => {
    const newRecommendation = recommendations[0];

    const result = await supertest(app)
      .post("/recommendations")
      .send(newRecommendation);

    expect(result.status).toBe(409);
  });

  it("Should return 422 in case the URL is not an youtube URL", async () => {
    const newRecommendation = {
      ...recommendations[3],
      youtubeLink: "https://mail.google.com/",
    };

    const result = await supertest(app)
      .post("/recommendations")
      .send(newRecommendation);

    expect(result.status).toBe(422);
  });
});

describe("POST /recommendations/:id", () => {
  it("Should return 200 /upvote", async () => {
    const id: number = 1;

    const result = await supertest(app).post(`/recommendations/${id}/upvote`);

    expect(result.status).toBe(200);
  });

  it("Should return 200 /downvote", async () => {
    const id: number = 1;

    const result = await supertest(app).post(`/recommendations/${id}/downvote`);

    expect(result.status).toBe(200);
  });

  it("Should return 404 /upvote in case id is invalid", async () => {
    const id: number = 0;

    const result = await supertest(app).post(`/recommendations/${id}/upvote`);

    expect(result.status).toBe(404);
  });

  it("Should return 404 /downvote in case id is invalid", async () => {
    const id: number = 0;

    const result = await supertest(app).post(`/recommendations/${id}/downvote`);

    expect(result.status).toBe(404);
  });
});

describe("GET /recommendations", () => {
  it("Should return status 200 and the last 10 recommendations", async () => {
    const result = await supertest(app).get("/recommendations");

    expect(result.status).toBe(200);
    expect(result.body).toEqual(expect.any(Array));
  });

  it("Should return status 200 and a single recommendation if a valid ID is provided", async () => {
    const id = 1;
    const result = await supertest(app).get(`/recommendations/${id}`);

    expect(result.status).toBe(200);
    expect(result.body.name).toBe(recommendations[0].name);
    expect(result.body.youtubeLink).toBe(recommendations[0].youtubeLink);
  });

  it("Should return 404 in case the ID provided is invalid", async () => {
    const id = 15;
    const result = await supertest(app).get(`/recommendations/${id}`);

    expect(result.status).toBe(404);
  });

  it("/top/:amount should return 200 and a list of recommendations", async () => {
    const amount = 3;
    const result = await supertest(app).get(`/recommendations/top/${amount}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(expect.any(Array));
    expect(result.body.length).toBeLessThanOrEqual(amount);
  });

  it("/random Should return 200 and a random recommendation", async () => {
    const result = await supertest(app).get("/recommendations/random");

    expect(result.status).toBe(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        youtubeLink: expect.any(String),
        score: expect.any(Number),
      })
    );
  });

  it("/random Should return 404 in case database is empty", async () => {
    await resetDB();

    const result = await supertest(app).get("/recommendations/random");

    expect(result.status).toBe(404);
  });
});
