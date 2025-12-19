import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import app from "../../src/app";

// Mock the auth middleware
vi.mock("../../src/services/protectRoute", () => ({
  protectedRoute: (req: any, res: any, next: any) => {
    req.user = {
      id: "test-user-id",
      email: "test@example.com",
    };
    next();
  },
}));

// Mock the order controller
vi.mock("../../src/controllers/orderControllers", () => ({
  getAllOrders: vi.fn((req, res) => res.status(200).json({ status: "success", data: [] })),
  getOrder: vi.fn((req, res) => res.status(200).json({ status: "success", data: { id: "order-id" } })),
  newOrder: vi.fn((req, res) => res.status(201).json({ status: "success", data: { id: "new-order-id" } })),
  cancelOrder: vi.fn((req, res) => res.status(200).json({ status: "success", message: "Order cancelled" })),
}));

describe("Order Routes", () => {
  it("should return all orders", async () => {
    const response = await request(app).get("/api/v1/order/allOrders");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", data: [] });
  });

  it("should return a specific order", async () => {
    const response = await request(app).get("/api/v1/order/order?id=order-id");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", data: { id: "order-id" } });
  });

  it("should create a new order", async () => {
    const response = await request(app).post("/api/v1/order/order").send({
        symbol: "BTCUSDT",
        quantity: 1,
        price: 50000,
        side: "BUY",
        type: "LIMIT"
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ status: "success", data: { id: "new-order-id" } });
  });

   it("should cancel an order", async () => {
    const response = await request(app).post("/api/v1/order/cancelOrder").send({
        orderId: "order-id"
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "success", message: "Order cancelled" });
  });
});
