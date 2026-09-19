export interface User {
  id: string;
  email: string;
  password: string; //учебный проект
  name: string;
}

export const users: User[] = [
  {
    id: "u1",
    email: "alexey@mail.ru",
    password: "123456",
    name: "Алексей Морозов",
  },
];

export const sessions = new Map<string, string>();