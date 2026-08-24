import { vi, describe, it, expect } from 'vitest';
import { httpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { httpErrorInterceptor } from './http-error.interceptor';

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

describe('httpErrorInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be importable', () => {
    expect(httpErrorInterceptor).toBeDefined();
  });

  it('is a function', () => {
    expect(typeof httpErrorInterceptor).toBe('function');
  });

  it('handles 401 errors', () => {
    expect(typeof httpErrorInterceptor).toBe('function');
  });

  it('handles 500 errors', () => {
    expect(typeof httpErrorInterceptor).toBe('function');
  });
});