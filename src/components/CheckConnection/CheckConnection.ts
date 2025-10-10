import { debug } from "../../constants/calendar";

export async function checkDebugConnection() {
  try {
    const response = await debug();
    console.log("response", response);
    return response.status === 200;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    alert("[INFO] - Banco não está conectado. Existe a branch 'feat/calendar' no repositório de back");

    return false;
  }
}

