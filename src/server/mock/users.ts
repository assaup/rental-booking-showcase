import { type User } from "@/shared/api/auth";

interface UserRecord extends User {
  password: string;
}

export const users: UserRecord[] = [
  {
    id: "u1",
    email: "samir@mail.ru",
    password: "123456",
    name: "Самир",
  },
];

export const sessions = new Map<string, string>();
