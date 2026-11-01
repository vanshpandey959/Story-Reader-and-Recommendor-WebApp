import client, { USE_MOCK, delay } from "./client";
import { loadJson, saveJson } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

/* ---- mock backend (localStorage). Never ship plain-text passwords for real. ---- */
export const DEMO_USER = {
  id: "u_demo",
  name: "Demo Reader",
  email: "demo@example.com",
  password: "demo1234",
};

const getUsers = () => {
  const users = loadJson(STORAGE_KEYS.mockUsers, []);
  return users.some((u) => u.id === DEMO_USER.id) ? users : [DEMO_USER, ...users];
};

const toSession = ({ password, ...user }) => ({ user, token: `mock-token-${user.id}` });

/** POST /auth/login  { email, password }  ->  { user, token } */
export async function loginRequest({ email, password }) {
  if (!USE_MOCK) return (await client.post("/auth/login", { email, password })).data;

  await delay();
  const user = getUsers().find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error("Incorrect email or password");
  return toSession(user);
}

/** POST /auth/signup  { name, email, password }  ->  { user, token } */
export async function signupRequest({ name, email, password }) {
  if (!USE_MOCK) return (await client.post("/auth/signup", { name, email, password })).data;

  await delay();
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error("An account with this email already exists");
  }
  const user = { id: `u_${Date.now()}`, name: name.trim(), email: cleanEmail, password };
  saveJson(STORAGE_KEYS.mockUsers, [...users, user]);
  return toSession(user);
}
