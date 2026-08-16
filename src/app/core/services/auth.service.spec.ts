import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

// ── Token parsed stub type ────────────────────────────────────────────────────

interface TokenParsedStub {
  preferred_username?: string;
  name?: string;
  exp?: number;
  realm_access?: { roles: string[] };
}

// ── Keycloak instance mock ────────────────────────────────────────────────────
// Declared before vi.mock() so the factory closure can reference it.
// vi.mock() is hoisted by Vitest, but the variable reference is resolved at
// module evaluation time via the closure, which works correctly.

const kcMock = {
  init:        vi.fn<[], Promise<boolean>>(),
  login:       vi.fn<[], void>(),
  logout:      vi.fn<[{ redirectUri: string }], void>(),
  updateToken: vi.fn<[number], Promise<boolean>>(),
  token:       undefined as string | undefined,
  tokenParsed: undefined as TokenParsedStub | undefined,
};

// ── Module mock ───────────────────────────────────────────────────────────────
// Intercepts `new Keycloak(...)` in AuthService constructor.

vi.mock('keycloak-js', () => {
  // Must use a regular function (not arrow) so it can be called with `new`
  const KeycloakMock = vi.fn(function () { return kcMock; });
  return { default: KeycloakMock };
});

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // Freeze timers so scheduleTokenRefresh() setTimeout never fires
    vi.useFakeTimers();

    // Reset all mock call history and return values
    vi.resetAllMocks();

    // Restore neutral state of the kc instance properties
    kcMock.token       = undefined;
    kcMock.tokenParsed = undefined;

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  // ── init() ─────────────────────────────────────────────────────────────────

  it('init() with authenticated user should set signals from tokenParsed', async () => {
    kcMock.tokenParsed = {
      preferred_username: 'ivan',
      name:               'Iván Díaz',
      exp:                Math.ceil(Date.now() / 1000) + 3600,
      realm_access:       { roles: ['USER'] },
    };
    kcMock.init.mockResolvedValue(true);
    kcMock.updateToken.mockResolvedValue(false); // scheduleTokenRefresh may call this

    await service.init();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.username()).toBe('ivan');
    expect(service.fullName()).toBe('Iván Díaz');
    expect(service.roles()).toContain('USER');
  });

  it('init() with unauthenticated user should leave signals in initial state', async () => {
    kcMock.init.mockResolvedValue(false);

    await service.init();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.username()).toBe('');
    expect(service.fullName()).toBe('');
    expect(service.roles()).toEqual([]);
  });

  // ── fullName fallback ──────────────────────────────────────────────────────

  it('init() should fall back to preferred_username when name is absent', async () => {
    kcMock.tokenParsed = {
      preferred_username: 'ivan',
      exp:                Math.ceil(Date.now() / 1000) + 3600,
      realm_access:       { roles: [] },
    };
    kcMock.init.mockResolvedValue(true);
    kcMock.updateToken.mockResolvedValue(false);

    await service.init();

    expect(service.fullName()).toBe('ivan');
  });

  // ── isAdmin ────────────────────────────────────────────────────────────────

  it('isAdmin() should return true when roles include ADMIN', async () => {
    kcMock.tokenParsed = {
      preferred_username: 'admin',
      exp:                Math.ceil(Date.now() / 1000) + 3600,
      realm_access:       { roles: ['USER', 'ADMIN'] },
    };
    kcMock.init.mockResolvedValue(true);
    kcMock.updateToken.mockResolvedValue(false);

    await service.init();

    expect(service.isAdmin()).toBe(true);
  });

  it('isAdmin() should return false when roles do not include ADMIN', async () => {
    kcMock.tokenParsed = {
      preferred_username: 'user',
      exp:                Math.ceil(Date.now() / 1000) + 3600,
      realm_access:       { roles: ['USER'] },
    };
    kcMock.init.mockResolvedValue(true);
    kcMock.updateToken.mockResolvedValue(false);

    await service.init();

    expect(service.isAdmin()).toBe(false);
  });

  // ── getToken() ─────────────────────────────────────────────────────────────

  it('getToken() should return the current token string', () => {
    kcMock.token = 'eyJhbGciOiJSUzI1NiJ9.payload.sig';

    expect(service.getToken()).toBe('eyJhbGciOiJSUzI1NiJ9.payload.sig');
  });

  it('getToken() should return empty string when token is undefined', () => {
    kcMock.token = undefined;

    expect(service.getToken()).toBe('');
  });

  // ── getValidToken() ────────────────────────────────────────────────────────

  it('getValidToken() should call updateToken(30) and return the refreshed token', async () => {
    kcMock.updateToken.mockResolvedValue(true);
    kcMock.token = 'refreshed-token';

    const result = await service.getValidToken();

    expect(kcMock.updateToken).toHaveBeenCalledWith(30);
    expect(kcMock.login).not.toHaveBeenCalled();
    expect(result).toBe('refreshed-token');
  });

  it('getValidToken() should call login() once and return empty string when updateToken rejects', async () => {
    kcMock.updateToken.mockRejectedValue(new Error('Token refresh failed'));
    kcMock.token = undefined;

    const result = await service.getValidToken();

    expect(kcMock.login).toHaveBeenCalledTimes(1);
    expect(result).toBe('');
  });

  // ── logout() ───────────────────────────────────────────────────────────────

  it('logout() should delegate to kc.logout() with window.location.origin as redirectUri', () => {
    service.logout();

    expect(kcMock.logout).toHaveBeenCalledTimes(1);
    expect(kcMock.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
  });
});
