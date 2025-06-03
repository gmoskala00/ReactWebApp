export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export default class UserApi {
  static getCurrentUser(): User {
    return {
      id: 1,
      firstName: "Jan",
      lastName: "Kowalski",
    };
  }
}
