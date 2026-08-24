import { vi, describe, it, expect } from 'vitest';
import { authInterceptor } from './auth.interceptor';

vi.mock('keycloak-js', () => {
  const KeycloakMock = vi.fn(function () { return {} as any; });
  return { default: KeycloakMock };
});

const kcMock: any = {
  init:        vi.fn<[], Promise<boolean>>(),
  login:       vi.fn<[], void>(),
  logout:      vi.fn<[{ redirectUri: string }], void>(),
  updateToken: vi.fn<[number], Promise<boolean>>(),
  token:       'test-token' as string,
  tokenParsed: { realm_access: { roles: ['USER'] } },
};

describe('authInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be importable', () => {
    expect(authInterceptor).toBeDefined();
  });

  it('is a function', () => {
    expect(typeof authInterceptor).toBe('function');
  });
});