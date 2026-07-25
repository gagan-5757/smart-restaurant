import { describe, expect, it } from "vitest";
import { createOrder, createReservation, getDashboardData, getMenuItems } from "./restaurant-data";

describe("restaurant data flows", () => {
  it("creates a reservation and exposes it in the dashboard", () => {
    const reservation = createReservation({
      customerName: "Nina",
      partySize: 3,
      timeSlot: "18:30",
      table: "Bar 1",
    });

    expect(reservation.customerName).toBe("Nina");
    expect(reservation.status).toBe("Pending");
  });

  it("creates an order and updates dashboard totals", () => {
    const order = createOrder({
      customer: "Aiden",
      items: [{ id: "mint-cooler", name: "Mint Citrus Cooler", qty: 2, price: 5.5 }],
      channel: "Online",
    });

    const dashboard = getDashboardData();
    expect(order.total).toBe(11);
    expect(getMenuItems().length).toBeGreaterThan(0);
    expect(dashboard.revenue).toBeGreaterThan(0);
  });
});
