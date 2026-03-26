import { Injectable } from '@angular/core';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersKey = 'qa_users';
  private readonly sessionKey = 'qa_session';

  private readonly defaultUsers: User[] = [
    {
      id: 1,
      name: 'Administrador',
      username: 'admin',
      password: '12345'
    },
    {
      id: 2,
      name: 'Edgar',
      username: 'edgar',
      password: '12345'
    }
  ];

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const foundUser = users.find(
      user => user.username === username && user.password === password
    );

    if (!foundUser) {
      return false;
    }

    localStorage.setItem(this.sessionKey, foundUser.username);
    return true;
  }

  register(name: string, username: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const exists = users.some(user => user.username === username);

    if (exists) {
      return { success: false, message: 'El nombre de usuario ya existe.' };
    }

    const newUser: User = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      username,
      password
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { success: true, message: 'Usuario registrado correctamente.' };
  }

  getUsers(): User[] {
    const savedUsers = localStorage.getItem(this.usersKey);

    if (!savedUsers) {
      localStorage.setItem(this.usersKey, JSON.stringify(this.defaultUsers));
      return this.defaultUsers;
    }

    return JSON.parse(savedUsers);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.sessionKey);
  }

  getCurrentUsername(): string {
    return localStorage.getItem(this.sessionKey) || '';
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }
}
