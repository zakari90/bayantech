"use server";

import { getTranslations } from "next-intl/server"; // Import for server-side translations
import { cookies, headers } from "next/headers";
import { z } from "zod";
import { encrypt } from "./server-auth";
import { CenterInputSchema, UserUpdateSchema } from "./validations/schemas";

// Resolve the absolute base URL for server actions (required for fetch in Next.js server context)
async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Derive from the incoming request host header at runtime
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}
// Zod schemas with dynamic translations
const createRegistrationSchema = (
  t: Awaited<ReturnType<typeof getTranslations>>,
) =>
  z
    .object({
      username: z.string().min(3, { message: t("validation.usernameMin") }),
      email: z.email({ message: t("validation.invalidEmail") }),
      password: z.string().min(4, { message: t("validation.passwordMin") }),
      confirmPassword: z
        .string()
        .min(4, { message: t("validation.passwordMin") }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("validation.passwordMismatch"),
          path: ["confirmPassword"],
        });
      }
    });

const createLoginSchema = (t: Awaited<ReturnType<typeof getTranslations>>) =>
  z.object({
    email: z
      .email({ message: t("validation.invalidEmail") })
      .nonempty({ message: t("validation.emailRequired") }),
    password: z
      .string()
      .min(1, { message: t("validation.passwordRequired") })
      .nonempty({ message: t("validation.passwordRequired") }),
  });

// Register Action
export async function register(state: unknown, formData: FormData) {
  try {
    // Get translations for validation messages
    const t = await getTranslations("auth");

    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const registrationSchema = createRegistrationSchema(t);
    const result = registrationSchema.safeParse(data);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || { message: t("errors.registrationFailed") },
      };
    }

    return { success: true, data: json };
  } catch (error) {
    console.error("Registration error:", error);
    const t = await getTranslations("auth");
    return { error: { message: t("errors.unexpectedError") } };
  }
}

// Create Manager Action
export async function createManager(state: unknown, formData: FormData) {
  try {
    const t = await getTranslations("auth");

    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const registrationSchema = createRegistrationSchema(t);
    const result = registrationSchema.safeParse(data);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, role: "MANAGER" }),
    });
    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || { message: t("errors.createManagerFailed") },
      };
    }

    return { success: true, data: json };
  } catch (error) {
    console.error("Create manager error:", error);
    const t = await getTranslations("auth");
    return { error: { message: t("errors.unexpectedError") } };
  }
}

// Update Manager Action
export async function updateManager(state: unknown, formData: FormData) {
  try {
    const t = await getTranslations("auth");

    const data = {
      userId: formData.get("userId"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = UserUpdateSchema.safeParse(data);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/admin/users/${data.userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, role: "MANAGER" }),
    });
    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || { message: t("errors.updateManagerFailed") },
      };
    }

    return { success: true, data: json };
  } catch (error) {
    console.error("Update manager error:", error);
    const t = await getTranslations("auth");
    return { error: { message: t("errors.unexpectedError") } };
  }
}

export async function loginAdmin(state: unknown, formData: FormData) {
  try {
    const t = await getTranslations("auth");

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      role: "admin", // Enforce admin role validation
    };

    const loginSchema = createLoginSchema(t);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    // Use the auth/login endpoint for proper login flow
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || { message: t("errors.loginFailed") },
      };
    }

    const user = json.user;
    const passwordHash = json.passwordHash; // For offline auth
    const session = await encrypt({ user });
    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return {
      success: true,
      data: {
        ...json,
        passwordHash, // Include hash for offline storage on client
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);
    const t = await getTranslations("auth");
    return { error: { message: t("errors.unexpectedError") } };
  }
}

// Login Manager Action
export async function loginManager(state: unknown, formData: FormData) {
  try {
    const t = await getTranslations("auth");

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      role: "manager", // Enforce manager role validation
    };

    const loginSchema = createLoginSchema(t);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || { message: t("errors.loginFailed") },
      };
    }

    const user = json.user;
    const passwordHash = json.passwordHash; // For offline auth
    const session = await encrypt({ user });
    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return {
      success: true,
      data: {
        ...json,
        passwordHash, // Include hash for offline storage on client
      },
    };
  } catch (error) {
    console.error("Manager login error:", error);
    const t = await getTranslations("auth");
    return { error: { message: t("errors.unexpectedError") } };
  }
}

// Create Center Action
export async function createCenterAction(state: unknown, formData: FormData) {
  try {
    const t = await getTranslations("center");

    const rawData = {
      name: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      classrooms: formData.getAll("classrooms"),
      workingDays: formData.getAll("workingDays"),
    };

    const result = CenterInputSchema.safeParse(rawData);

    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
      };
    }

    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/centers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });
    const json = await res.json();

    if (!res.ok) {
      return { error: json.error || { message: t("errors.createFailed") } };
    }

    return { success: true, data: json };
  } catch (error) {
    console.error("Create center error:", error);
    const t = await getTranslations("center");
    return { error: { message: t("errors.unexpectedError") } };
  }
}

// Combined login action that routes based on role and returns role info
export async function loginWithRole(state: unknown, formData: FormData) {
  const submittedRole =
    (formData.get("role") as string) === "manager" ? "manager" : "admin";
  const result =
    submittedRole === "manager"
      ? await loginManager(state, formData)
      : await loginAdmin(state, formData);

  return {
    ...result,
    role: submittedRole,
  };
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}
