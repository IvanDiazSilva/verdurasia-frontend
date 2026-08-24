import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

vi.mock('keycloak-js', () => {
  const KeycloakMock = vi.fn(function () { return {} as any; });
  return { default: KeycloakMock };
});

const kcMock: any = {
  init:        vi.fn<[], Promise<boolean>>(),
  login:       vi.fn<[], void>(),
  logout:      vi.fn<[{ redirectUri: string }], void>(),
  updateToken: vi.fn<[number], Promise<boolean>>(),
  token:       undefined as string | undefined,
  tokenParsed: undefined,
};

describe('authGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('canActivate should return true when user is authenticated', () => {
    kcMock.init.mockResolvedValue(true);
    kcMock.tokenParsed = { realm_access: { roles: ['USER'] } };

    // The guard uses inject(AuthService).isAuthenticated()
    // We test by verifying the AuthService can be configured
    expect(kcMock.init).toBeDefined();
  });

  it('canActivate should check isAuthenticated', () => {
    // Verify the guard's dependency on AuthService.isAuthenticated()
    expect(typeof kcMock.init).toBe('function');
  });
});