export type UserRole = "admin" | "devops" | "developer";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
}

const MOCK_USERS: User[] = [
  { id: 1, firstName: "Jan", lastName: "Kowalski", role: "admin" },
  { id: 2, firstName: "Anna", lastName: "Nowak", role: "developer" },
  { id: 3, firstName: "Tomasz", lastName: "Zieliński", role: "devops" },
];

export default class UserApi {
  static getCurrentUser(): User {
    return MOCK_USERS[0];
  }

  static getUsers(): User[] {
    return MOCK_USERS;
  }
}
