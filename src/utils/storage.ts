export type UserRole = "ADMIN" | "AGENT" | "OWNER" | "BUYER";

const TOKEN_KEYS: Record<UserRole, string> = {
  ADMIN: "admin_access_token",
  AGENT: "agent_access_token",
  OWNER: "owner_access_token",
  BUYER: "buyer_access_token",
};

const ACTIVE_ROLE_KEY = "estateai_active_role";
const LEGACY_TOKEN_KEY = "estateai_access_token";

function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    ["ADMIN", "AGENT", "OWNER", "BUYER"].includes(value)
  );
}

function getTokenRole(token: string): UserRole | null {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedBase64));

    return isUserRole(payload.role) ? payload.role : null;
  } catch {
    return null;
  }
}

function getActiveRole(): UserRole | null {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  const role = sessionStorage.getItem(ACTIVE_ROLE_KEY);

  return isUserRole(role) ? role : null;
}

function migrateLegacyToken(): string | null {
  if (
    typeof localStorage === "undefined" ||
    typeof sessionStorage === "undefined"
  ) {
    return null;
  }

  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);

  if (!legacyToken) {
    return null;
  }

  const role = getTokenRole(legacyToken);

  if (!role) {
    return null;
  }

  // Move the old token to its role-specific storage key.
  localStorage.setItem(TOKEN_KEYS[role], legacyToken);
  sessionStorage.setItem(ACTIVE_ROLE_KEY, role);
  localStorage.removeItem(LEGACY_TOKEN_KEY);

  return legacyToken;
}

export const tokenStorage = {
  /**
   * Get the token belonging to the active account in this tab.
   */
  get(): string | null {
    if (
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return null;
    }

    const activeRole = getActiveRole();

    if (activeRole) {
      return localStorage.getItem(TOKEN_KEYS[activeRole]);
    }

    // Migrate an existing token from the old storage key.
    return migrateLegacyToken();
  },

  /**
   * Save a token and make its account active in this tab.
   */
  set(token: string, role?: string | null): void {
    if (
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return;
    }

    const resolvedRole = isUserRole(role) ? role : getTokenRole(token);

    if (!resolvedRole) {
      throw new Error("Cannot save token: a valid account role was not found.");
    }

    localStorage.setItem(TOKEN_KEYS[resolvedRole], token);
    sessionStorage.setItem(ACTIVE_ROLE_KEY, resolvedRole);
  },

  /**
   * Get the token for a specific role, regardless of the active role.
   */
  getForRole(role: UserRole): string | null {
    if (typeof localStorage === "undefined") {
      return null;
    }

    return localStorage.getItem(TOKEN_KEYS[role]);
  },

  /**
   * Return the active account role for this tab.
   */
  getActiveRole,

  /**
   * Switch the active account in this tab.
   */
  setActiveRole(role: UserRole): boolean {
    if (
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return false;
    }

    const token = localStorage.getItem(TOKEN_KEYS[role]);

    if (!token) {
      return false;
    }

    sessionStorage.setItem(ACTIVE_ROLE_KEY, role);

    return true;
  },

  /**
   * Clear only the active account's token.
   */
  clear(): void {
    if (
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return;
    }

    const activeRole = getActiveRole();

    if (activeRole) {
      localStorage.removeItem(TOKEN_KEYS[activeRole]);
    }

    sessionStorage.removeItem(ACTIVE_ROLE_KEY);
  },

  /**
   * Clear a specific account's token.
   */
  clearRole(role: UserRole): void {
    if (
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return;
    }

    localStorage.removeItem(TOKEN_KEYS[role]);

    if (getActiveRole() === role) {
      sessionStorage.removeItem(ACTIVE_ROLE_KEY);
    }
  },
};

export function readTokenUser(token: string | null): {
  id: number | null;
  role: string | null;
} {
  if (!token) {
    return {
      id: null,
      role: null,
    };
  }

  try {
    const part = token.split(".")[1];

    if (!part) {
      return {
        id: null,
        role: null,
      };
    }

    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedBase64));

    return {
      id: Number(payload.user_id) || null,
      role: typeof payload.role === "string" ? payload.role : null,
    };
  } catch {
    return {
      id: null,
      role: null,
    };
  }
}
