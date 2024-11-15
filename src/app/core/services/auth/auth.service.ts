import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../../../shared/models/user";
import { DataService } from "../data/data.service";
import { BehaviorSubject } from "rxjs";

/**
 * @description
 * Servicio de autenticación para gestionar el estado de autenticación del usuario.
 *
 * @usageNotes
 * Este servicio se utiliza para realizar el inicio de sesión, cerrar sesión, y obtener la información del usuario autenticado.
 *
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {}
 *
 * this.authService.login('email@example.com', 'password');
 * this.authService.logout();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn = new BehaviorSubject<boolean>(false);
  authStatus$ = this.isLoggedIn.asObservable();
  public userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();
  public userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  private users: User[] = [];
  currentUser: User | null = null;

  /**
   * Constructor del servicio AuthService.
   *
   * @param router Servicio de enrutamiento para navegar entre rutas.
   * @param dataService Servicio de datos para obtener información del usuario.
   */
  constructor(private router: Router, private dataService: DataService) {
    this.loadUsers();
  }

  /**
   * Carga la lista de usuarios desde el servicio de datos.
   */
  loadUsers() {
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
    });
    return this.users;
  }

  /**
   * Realiza el inicio de sesión del usuario.
   *
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns `true` si el inicio de sesión es exitoso, `false` de lo contrario.
   */
  login(email: string, password: string): boolean {
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
    });
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.isLoggedIn.next(true);
      this.userNameSubject.next(user.firstName);
      this.userRoleSubject.next(user.roles.includes('admin') ? 'admin' : 'customer');
      this.currentUser = user;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Realiza el cierre de sesión del usuario.
   */
  logout() {
    this.isLoggedIn.next(false);
    this.userNameSubject.next(null);
    this.userRoleSubject.next(null);
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado.
   *
   * @returns `true` si el usuario está autenticado, `false` de lo contrario.
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn.value;
  }

  /**
   * Obtiene el nombre del usuario autenticado.
   *
   * @returns El nombre del usuario o `null` si no hay usuario autenticado.
   */
  getUserName(): string | null {
    return this.userNameSubject.value;
  }

  /**
   * Obtiene el rol del usuario autenticado.
   *
   * @returns El rol del usuario o `null` si no hay usuario autenticado.
   */
  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  /**
   * Obtiene el usuario autenticado.
   *
   * @returns El usuario autenticado o `null` si no hay usuario autenticado.
   */
  getUser(): User | null {
    return this.currentUser;
  }

  /**
   * Establece un nuevo usuario.
   *
   * @param user El usuario a establecer.
   */
  setUser(user: User) {
    this.users.push(user);
  }
}
