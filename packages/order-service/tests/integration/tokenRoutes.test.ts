import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import app from "../../src/app";

// Mock the token controller
vi.mock("../../src/controllers/tokenControllers", () => ({
  getTokenMarketData: vi.fn((req, res) => res.status(200).json({ status: "success", data: [] })),
  getTokenTradeData: vi.fn((req, res) => res.status(200).json({ status: "success", data: [] })),
  getOrderBook: vi.fn((req, res) => res.status(200).json({ status: "success", data: {} })),
}));

// Mock the token price store
vi.mock("../../src/store/tokenPriceStore", () => ({
    getTokenPrice: vi.fn().mockReturnValue({ "BTC": 50000 }),
}));


describe("Token Routes", () => {
  it("should return token market data", async () => {
    const response = await request(app).get("/api/v1/token/tokenMarketData");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", data: [] });
  });

  it("should return token trade data", async () => {
    const response = await request(app).get("/api/v1/token/tokenTradeData");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", data: [] });
  });

  it("should return order book", async () => {
    const response = await request(app).get("/api/v1/token/orderBooks");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", data: {} });
  });

   it("should return token prices", async () => {
    const response = await request(app).get("/api/v1/token/tokenPrices");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", data: { "BTC": 50000 } });
  });
});
