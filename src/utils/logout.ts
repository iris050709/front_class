
import { authApi } from "../api/auth.api";
import { storage } from "./storage";

export async function closeSession(): Promise<void> {
  try {
    // Solicita al backend revocar el Access Token
    // y eliminar el Refresh Token.
    await authApi.logout();
  } finally {
    // Limpia únicamente los tokens almacenados localmente.
    // No elimina usuarios ni datos de SQLite.
    await storage.clearAll();
  }
}
