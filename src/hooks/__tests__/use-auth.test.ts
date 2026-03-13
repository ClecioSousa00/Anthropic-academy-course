import { test, expect, vi, describe, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import { useRouter } from "next/navigation";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  describe("signIn", () => {
    test("sets isLoading to true during sign in", async () => {
      vi.mocked(signInAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      const signInPromise = act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      await signInPromise;

      expect(result.current.isLoading).toBe(false);
    });

    test("calls signInAction with correct credentials", async () => {
      vi.mocked(signInAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(signInAction).toHaveBeenCalledWith("test@example.com", "password123");
    });

    test("returns result from signInAction", async () => {
      const expectedResult = { success: true, error: undefined };
      vi.mocked(signInAction).mockResolvedValue(expectedResult);
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      const returnValue = await act(async () => {
        return await result.current.signIn("test@example.com", "password");
      });

      expect(returnValue).toEqual(expectedResult);
    });

    test("returns error result when sign in fails", async () => {
      const errorResult = { success: false, error: "Invalid credentials" };
      vi.mocked(signInAction).mockResolvedValue(errorResult);

      const { result } = renderHook(() => useAuth());

      const returnValue = await act(async () => {
        return await result.current.signIn("test@example.com", "wrongpassword");
      });

      expect(returnValue).toEqual(errorResult);
      expect(createProject).not.toHaveBeenCalled();
      expect(getProjects).not.toHaveBeenCalled();
    });

    test("navigates to existing project after successful sign in", async () => {
      vi.mocked(signInAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([{ id: "existing-project-id" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      expect(mockPush).toHaveBeenCalledWith("/existing-project-id");
    });

    test("creates new project when no projects exist", async () => {
      vi.mocked(signInAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "brand-new-project" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      expect(createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.stringContaining("New Design #"),
          messages: [],
          data: {},
        })
      );
      expect(mockPush).toHaveBeenCalledWith("/brand-new-project");
    });

    test("migrates anonymous work to project after sign in", async () => {
      vi.mocked(signInAction).mockResolvedValue({ success: true });
      const anonWork = {
        messages: [{ role: "user", content: "Create a button" }],
        fileSystemData: { "button.tsx": "content" },
      };
      vi.mocked(getAnonWorkData).mockReturnValue(anonWork);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      expect(createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.stringContaining("Design from"),
          messages: anonWork.messages,
          data: anonWork.fileSystemData,
        })
      );
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe("signUp", () => {
    test("sets isLoading to true during sign up", async () => {
      vi.mocked(signUpAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("calls signUpAction with correct credentials", async () => {
      vi.mocked(signUpAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("new@example.com", "newpassword");
      });

      expect(signUpAction).toHaveBeenCalledWith("new@example.com", "newpassword");
    });

    test("returns result from signUpAction", async () => {
      const expectedResult = { success: true, error: undefined };
      vi.mocked(signUpAction).mockResolvedValue(expectedResult);
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      const returnValue = await act(async () => {
        return await result.current.signUp("test@example.com", "password");
      });

      expect(returnValue).toEqual(expectedResult);
    });

    test("returns error result when sign up fails", async () => {
      const errorResult = { success: false, error: "Email already in use" };
      vi.mocked(signUpAction).mockResolvedValue(errorResult);

      const { result } = renderHook(() => useAuth());

      const returnValue = await act(async () => {
        return await result.current.signUp("test@example.com", "password");
      });

      expect(returnValue).toEqual(errorResult);
    });
  });

  describe("isLoading", () => {
    test("is false initially", () => {
      vi.mocked(signInAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);
    });
  });
});
