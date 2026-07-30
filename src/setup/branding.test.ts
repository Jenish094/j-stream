import { describe, expect, it } from "vitest";

import { APP_NAME, GITHUB_LINK } from "./constants";

describe("branding", () => {
  it("uses the J-Stream app identity", () => {
    expect(APP_NAME).toBe("J-Stream");
    expect(GITHUB_LINK).toBe("https://github.com/jenish094/j-stream");
  });
});
