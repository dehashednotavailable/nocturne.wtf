export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  session: {
    id: string;
    expiresAt: string;
  };
}

interface ApiErrorPayload {
  message?: string | string[];
}

type RegisterAccountPayload = {
  username: string;
  email: string;
  password: string;
};

type LoginAccountPayload = {
  login: string;
  password: string;
};

type LogoutResponse = {
  message: string;
};

type MockUser = AuthResponse["user"];

interface MockAccount {
  user: MockUser;
  password: string;
}

const USE_MOCK_AUTH = true;
const MOCK_USERS_STORAGE_KEY = "le-milliard-et-une-vie.mock-users";
const MOCK_SESSION_STORAGE_KEY = "le-milliard-et-une-vie.mock-session";
const MOCK_NETWORK_DELAY_MS = 250;

let mockUsersCache: MockAccount[] = [];
let mockSessionCache: AuthResponse | null = null;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function parseJson<T>(text: string) {
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

async function requestJson<T>(input: string, init: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const text = await response.text();
  const data = text ? parseJson<T | ApiErrorPayload>(text) : undefined;

  if (!response.ok) {
    const errorMessage = (data as ApiErrorPayload | undefined)?.message;
    const message = Array.isArray(errorMessage)
      ? errorMessage.join(" ")
      : (errorMessage ?? `Request failed with status ${response.status}.`);

    throw new ApiError(message, response.status);
  }

  return data as T;
}

function cloneUser(user: MockUser): MockUser {
  return {
    ...user,
  };
}

function cloneSession(session: AuthResponse): AuthResponse {
  return {
    user: cloneUser(session.user),
    session: {
      ...session.session,
    },
  };
}

function cloneAccount(account: MockAccount): MockAccount {
  return {
    user: cloneUser(account.user),
    password: account.password,
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function createMockId(prefix: string) {
  const randomId =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${randomId}`;
}

function normalizeCredential(value: string) {
  return value.trim().toLowerCase();
}

function persistMockUsers(users: MockAccount[]) {
  mockUsersCache = users.map(cloneAccount);

  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      MOCK_USERS_STORAGE_KEY,
      JSON.stringify(mockUsersCache),
    );
  } catch {
    // Ignore storage errors in mock mode and keep the in-memory fallback.
  }
}

function loadMockUsers() {
  if (isBrowser()) {
    try {
      const storedUsers = window.localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      const parsedUsers = storedUsers
        ? parseJson<MockAccount[]>(storedUsers)
        : undefined;

      if (Array.isArray(parsedUsers)) {
        mockUsersCache = parsedUsers.map(cloneAccount);
      }
    } catch {
      // Ignore storage errors in mock mode and keep the in-memory fallback.
    }
  }

  return mockUsersCache.map(cloneAccount);
}

function persistMockSession(session: AuthResponse | null) {
  mockSessionCache = session ? cloneSession(session) : null;

  if (!isBrowser()) {
    return;
  }

  try {
    if (mockSessionCache) {
      window.localStorage.setItem(
        MOCK_SESSION_STORAGE_KEY,
        JSON.stringify(mockSessionCache),
      );
      return;
    }

    window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage errors in mock mode and keep the in-memory fallback.
  }
}

function loadMockSession() {
  if (isBrowser()) {
    try {
      const storedSession = window.localStorage.getItem(MOCK_SESSION_STORAGE_KEY);
      const parsedSession = storedSession
        ? parseJson<AuthResponse>(storedSession)
        : undefined;

      if (parsedSession) {
        mockSessionCache = cloneSession(parsedSession);
      }
    } catch {
      // Ignore storage errors in mock mode and keep the in-memory fallback.
    }
  }

  return mockSessionCache ? cloneSession(mockSessionCache) : null;
}

function createAuthResponse(user: MockUser): AuthResponse {
  return {
    user: cloneUser(user),
    session: {
      id: createMockId("session"),
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
  };
}

function delay(durationMs = MOCK_NETWORK_DELAY_MS) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

async function mockRegisterAccount(
  payload: RegisterAccountPayload,
): Promise<AuthResponse> {
  await delay();

  const users = loadMockUsers();
  const normalizedUsername = normalizeCredential(payload.username);
  const normalizedEmail = normalizeCredential(payload.email);

  if (
    users.some(
      ({ user }) => normalizeCredential(user.username) === normalizedUsername,
    )
  ) {
    throw new ApiError("Username is already taken.", 409);
  }

  if (
    users.some(({ user }) => normalizeCredential(user.email) === normalizedEmail)
  ) {
    throw new ApiError("Email is already registered.", 409);
  }

  const user: MockUser = {
    id: createMockId("user"),
    username: payload.username.trim(),
    email: payload.email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  const auth = createAuthResponse(user);

  persistMockUsers([
    ...users,
    {
      user: cloneUser(user),
      password: payload.password,
    },
  ]);
  persistMockSession(auth);

  return auth;
}

async function mockLoginAccount(
  payload: LoginAccountPayload,
): Promise<AuthResponse> {
  await delay();

  const normalizedLogin = normalizeCredential(payload.login);
  const account = loadMockUsers().find(({ user }) => {
    return (
      normalizeCredential(user.username) === normalizedLogin ||
      normalizeCredential(user.email) === normalizedLogin
    );
  });

  if (!account || account.password !== payload.password) {
    throw new ApiError("Invalid username, email, or password.", 401);
  }

  const auth = createAuthResponse(account.user);
  persistMockSession(auth);

  return auth;
}

async function mockGetCurrentSession(): Promise<AuthResponse> {
  await delay();

  const session = loadMockSession();
  const expiresAt = session ? Date.parse(session.session.expiresAt) : NaN;

  if (!session || Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
    persistMockSession(null);
    throw new ApiError("Not authenticated.", 401);
  }

  return session;
}

async function mockLogoutAccount(): Promise<LogoutResponse> {
  await delay();
  persistMockSession(null);

  return {
    message: "Signed out.",
  };
}

export function registerAccount(
  payload: RegisterAccountPayload,
): Promise<AuthResponse> {
  if (!USE_MOCK_AUTH) {
    return requestJson<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  return mockRegisterAccount(payload);
}

export function loginAccount(
  payload: LoginAccountPayload,
): Promise<AuthResponse> {
  if (!USE_MOCK_AUTH) {
    return requestJson<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  return mockLoginAccount(payload);
}

export function getCurrentSession(): Promise<AuthResponse> {
  if (!USE_MOCK_AUTH) {
    return requestJson<AuthResponse>("/api/auth/me", {
      method: "GET",
    });
  }

  return mockGetCurrentSession();
}

export function logoutAccount(): Promise<LogoutResponse> {
  if (!USE_MOCK_AUTH) {
    return requestJson<LogoutResponse>("/api/auth/logout", {
      method: "POST",
    });
  }

  return mockLogoutAccount();
}
