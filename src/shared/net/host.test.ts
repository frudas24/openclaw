import { describe, expect, it } from "vitest";
import { normalizeGatewayAdvertiseHost, validateGatewayAdvertiseHostInput } from "./host.js";

describe("normalizeGatewayAdvertiseHost", () => {
  it("accepts IPv4 and DNS names", () => {
    expect(normalizeGatewayAdvertiseHost("10.8.0.1")).toBe("10.8.0.1");
    expect(normalizeGatewayAdvertiseHost("openclaw-gateway")).toBe("openclaw-gateway");
    expect(normalizeGatewayAdvertiseHost("gateway.local")).toBe("gateway.local");
  });

  it("accepts IPv6 (plain or bracketed)", () => {
    expect(normalizeGatewayAdvertiseHost("::1")).toBe("::1");
    expect(normalizeGatewayAdvertiseHost("[::1]")).toBe("::1");
  });

  it("rejects URLs, paths, and host:port strings", () => {
    expect(normalizeGatewayAdvertiseHost("http://openclaw-gateway")).toBeUndefined();
    expect(normalizeGatewayAdvertiseHost("openclaw-gateway/path")).toBeUndefined();
    expect(normalizeGatewayAdvertiseHost("openclaw-gateway:18789")).toBeUndefined();
  });
});

describe("validateGatewayAdvertiseHostInput", () => {
  it("allows empty input (optional field)", () => {
    expect(validateGatewayAdvertiseHostInput("")).toBeUndefined();
    expect(validateGatewayAdvertiseHostInput("   ")).toBeUndefined();
  });

  it("returns an error for invalid host values", () => {
    expect(validateGatewayAdvertiseHostInput("http://openclaw-gateway")).toContain("Invalid host");
  });
});
