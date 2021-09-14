import { describe, test, expect } from "@jest/globals";
import { parseStorage } from "../utilities";

describe("Storage parser", () => {
  test("basic", () => {
    expect(parseStorage("https://domain.com:7070/").schema).toBe("https");
    expect(parseStorage("https://domain.com:7070/").host).toBe("domain.com");
  });

  test("bad protocols", () => {
    expect(() => {
      parseStorage("ftp://domain.com/boom");
    }).toThrow(/Unsupported protocol/);
  });

  test("portless", () => {
    expect(parseStorage("https://domain.com/").port).toBe(443);
    expect(parseStorage("http://domain.com/").port).toBe(80);
  });

  test("buckets", () => {
    expect(parseStorage("https://domain.com/boom").path).toBe("boom");
    expect(() => {
      parseStorage("https://domain.com/boom/alpha");
    }).toThrow(/Got multiple buckets/i);
  });

  test("bucketless", () => {
    expect(parseStorage("https://domain.com").path).toBe("");
    expect(parseStorage("https://domain.com/").path).toBe("");
  });
});
