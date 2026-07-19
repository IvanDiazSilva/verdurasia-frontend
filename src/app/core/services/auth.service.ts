import { Injectable, signal, computed } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

/**
 * Servicio de autenticación basado en Keycloak.
 *
 * Responsabilidades:
 * - Inicializar la instancia de Keycloak al arrancar la app (via APP_INITIALIZER).
 * - Exponer el estado de autenticación como signals reactivos.
 * - Proporcionar acceso al token para el interceptor HTTP.
 * - Renovar el token automáticamente antes de que expire.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly kc: Keycloak;

  /** True si el usuario está autenticado. */
  readonly isAuthenticated = signal(false);

  /** Nombre del usuario autenticado (preferred_username del token). */
  readonly username = signal<string>('');

  /** Nombre completo (name) del token, con fallback a username. */
  readonly fullName = signal<string>('');

  /** Roles del realm asignados al usuario. */
  readonly roles = signal<string[]>([]);

  /** True si el usuario tiene el rol ADMIN. */
  readonly isAdmin = computed(() => this.roles().includes('ADMIN'));

  constructor() {
    this.kc = new Keycloak({
      url:      environment.keycloak.url,
      realm:    environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });
  }

  /**
   * Inicializa Keycloak. Llamado por APP_INITIALIZER antes del bootstrap de Angular.
   *
   * - `onLoad: 'login-required'` redirige a Keycloak si el usuario no está autenticado.
   * - `checkLoginIframe: false` evita problemas de cookies SameSite en localhost.
   * - `silentCheckSsoRedirectUri` usa el archivo estático para renovación silenciosa.
   */
  async init(): Promise<void> {
    const authenticated = await this.kc.init({
      onLoad:                   'login-required',
      checkLoginIframe:         false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });

    if (authenticated) {
      this.syncState();
      this.scheduleTokenRefresh();
    }
  }

  /** Devuelve el token JWT actual (puede estar vacío si no autenticado). */
  getToken(): string {
    return this.kc.token ?? '';
  }

  /**
   * Obtiene un token válido, renovándolo si expira en menos de 30 segundos.
   * Devuelve el token como string para usarlo en el interceptor.
   */
  async getValidToken(): Promise<string> {
    try {
      await this.kc.updateToken(30);
    } catch {
      // Si no puede renovar, fuerza login
      this.kc.login();
    }
    return this.kc.token ?? '';
  }

  login(): void {
    this.kc.login();
  }

  logout(): void {
    this.kc.logout({ redirectUri: window.location.origin });
  }

  /** Sincroniza los signals con el estado actual del token de Keycloak. */
  private syncState(): void {
    const profile = this.kc.tokenParsed;
    this.isAuthenticated.set(true);
    this.username.set(profile?.['preferred_username'] ?? '');
    this.fullName.set(profile?.['name'] ?? profile?.['preferred_username'] ?? '');
    const realmRoles: string[] = profile?.['realm_access']?.['roles'] ?? [];
    this.roles.set(realmRoles);
  }

  /**
   * Renueva el token 60 segundos antes de que expire para mantener la sesión activa.
   * Se reprograma automáticamente tras cada renovación exitosa.
   */
  private scheduleTokenRefresh(): void {
    const expiresIn = (this.kc.tokenParsed?.exp ?? 0) - Math.ceil(Date.now() / 1000);
    const refreshIn = Math.max((expiresIn - 60) * 1000, 10_000); // mínimo 10s

    setTimeout(async () => {
      try {
        const refreshed = await this.kc.updateToken(60);
        if (refreshed) this.syncState();
      } catch {
        this.kc.login();
      }
      this.scheduleTokenRefresh();
    }, refreshIn);
  }
}
