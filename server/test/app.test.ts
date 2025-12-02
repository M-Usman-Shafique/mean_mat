import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/services/websocket";

test("GET / should return running message", async () => {
    const response = await request(app).get("/");

    assert.equal(response.status, 200);
    assert.ok(
        response.text.includes("Express server is running"),
        "Response should contain the running message"
    );
});
