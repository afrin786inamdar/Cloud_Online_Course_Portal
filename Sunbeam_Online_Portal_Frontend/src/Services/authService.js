// Importing
import axios from "axios";
import Config from "./Config";

// 1. User Login
export async function loginUser(email, password) {
  const URL = Config.BASE_URL + "/auth/signin";
  const body = { email, password };

  const response = await axios.post(URL, body);
  return response.data;
}

// 2. User Register
export async function registerUser(name, email, password, mobile) {
  const URL = Config.BASE_URL + "/auth/signup";
  const body = { name, email, password, mobile };

  const response = await axios.post(URL, body);
  return response.data;
}
