
import { logout as logoutApi } from "../api/auth.api";
import { clearTokens } from "./storage";

export async function closeSession(): Promise<void> {
  try {
    await logoutApi();
  } finally {
    await clearTokens();
  }
}
//Así se envía el refresh token al backend y después se limpian ambos tokens locales.