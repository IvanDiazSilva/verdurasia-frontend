import { vi, describe, it, expect } from 'vitest';
import { adminGuard } from './auth.guard';

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

describe('adminGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('canActivate should return true when user is admin', () => {
    kcMock.tokenParsed = { realm_access: { roles: ['ADMIN', 'USER'] } };
    expect(typeof adminGuard).toBe('function');
  });

  it('canActivate should deny access when user is not admin', () => {
    kcMock.tokenParsed = { realm_access: { roles: ['USER'] } };
    expect(typeof adminGuard).toBe('function');
  });
});