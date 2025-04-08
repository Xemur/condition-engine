import { describe, it, expect } from "vitest";
import { getValue } from "../../src/utils/getValue";

describe("getValue", () => {
  const testObj = {
    name: "John",
    age: 30,
    address: {
      city: "New York",
      zip: "10001",
    },
    posts: [
      { id: 1, title: "Post 1", tags: ["a", "b"] },
      { id: 2, title: "Post 2", tags: ["c", "d"] },
    ],
  };

  it("should retrieve a top-level value", () => {
    expect(getValue(testObj, "$.name")).toBe("John");
  });

  it("should retrieve a nested value", () => {
    expect(getValue(testObj, "$.address.city")).toBe("New York");
  });

  it("should retrieve a value from an array by index", () => {
    expect(getValue(testObj, "$.posts[0].title")).toBe("Post 1");
  });

  it("should retrieve an entire object from an array", () => {
    expect(getValue(testObj, "$.posts[1]")).toEqual({
      id: 2,
      title: "Post 2",
      tags: ["c", "d"],
    });
  });

  it("should handle paths without the '$' prefix", () => {
    expect(getValue(testObj, "address.zip")).toBe("10001");
  });

  it("should return undefined for a non-existent path", () => {
    expect(getValue(testObj, "$.address.country")).toBeUndefined();
  });

  it("should return undefined for an out-of-bounds array index", () => {
    expect(getValue(testObj, "$.posts[2]")).toBeUndefined();
  });

  it("should return undefined when traversing through a non-object", () => {
    expect(getValue(testObj, "$.name.first")).toBeUndefined();
  });

  it("should return undefined for a path that continues after a non-existent property", () => {
    expect(getValue(testObj, "$.address.country.code")).toBeUndefined();
  });

  it("should return undefined if the initial object is null or undefined", () => {
    expect(getValue(null, "$.name")).toBeUndefined();
    expect(getValue(undefined, "$.name")).toBeUndefined();
  });
}); 