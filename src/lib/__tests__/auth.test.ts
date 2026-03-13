import { test, expect, vi, describe, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("jose", () => ({
  SignJWT: vi.fn().mockImplementation(() => ({
    setProtectedHeader: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    sign: vi.fn().mockResolvedValue("mocked-token"),
  })),
  jwtVerify: vi.fn(),
}));

import { createSession } from "@/lib/auth";
import { cookies } from "next/headers";

describe("createSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("creates a session token and sets cookie", async () => {
    const mockCookieStore = {
      set: vi.fn(),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);

    await createSession("user-123", "test@example.com");

    expect(cookies).toHaveBeenCalled();
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "auth-token",
      "mocked-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      })
    );
  });

  test("sets secure cookie in production", async () => {
    const mockCookieStore = {
      set: vi.fn(),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);
    
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    await createSession("user-123", "test@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "auth-token",
      "mocked-token",
      expect.objectContaining({
        secure: true,
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  test("sets non-secure cookie in development", async () => {
    const mockCookieStore = {
      set: vi.fn(),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);
    
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    await createSession("user-123", "test@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "auth-token",
      "mocked-token",
      expect.objectContaining({
        secure: false,
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  test("cookie expires in 7 days", async () => {
    const mockCookieStore = {
      set: vi.fn(),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);

    const beforeTime = new Date();
    await createSession("user-123", "test@example.com");
    const afterTime = new Date();

    const expiresArg = mockCookieStore.set.mock.calls[0][2].expires;
    expect(expiresArg.getTime()).toBeGreaterThan(beforeTime.getTime() + 7 * 24 * 60 * 60 * 1000 - 1000);
    expect(expiresArg.getTime()).toBeLessThan(afterTime.getTime() + 7 * 24 * 60 * 60 * 1000 + 1000);
  });
});
