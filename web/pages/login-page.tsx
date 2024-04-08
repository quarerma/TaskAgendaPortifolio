import axios, { AxiosError } from "axios";
import { useState } from "react";
import { BASE_URL } from "../env";
import logo from "/src/assets/logo.png";

interface UserLogin {
  login: string;
  password: string;
}

export const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("Carregando...");
    try {
      if (login === "" || password === "") {
        setError("Preencha todos os campos!");
        return;
      }

      const user: UserLogin = { login, password };
      console.log(`${BASE_URL}auth/login`);
      const response = await axios.post(`${BASE_URL}auth/login`, user);

      // Verifica se a resposta contém um token
      if (response.data && typeof response.data === "string") {
        localStorage.setItem("jwt", response.data); // Define o token apenas se for uma string
        window.location.href = "/home"; // Redireciona para a página de Home
      } else {
        setError("Resposta de login inválida!"); // Trata caso a resposta não seja um token
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const status = axiosError.response.status;

          if (status === 401) {
            console.error(err);
            setError("Login Inválido!");
          }
        }
      }
    }
  };

  if (localStorage.getItem("jwt")) {
    window.location.href = "/home";
  }
  return (
    <div
      className="bg-yellow-200 w-screen h-screen"
      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
    >
      <div className="bg-amber-100 border-yellow-500 border flex flex-col absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 text-yellow-900 rounded-sm min-h-[260px] max-w-[360px] items-center justify-center text-center">
        <h1 className="text-2xl font-medium p-2">Login</h1>
        <img
          src={logo}
          alt="logo"
          className="w-[300px] justify-center items-center flex"
        />
        <div className="w-[300px] gap-y-8 flex m-6 flex-col">
          <input
            type="text"
            placeholder="Usuário"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full  placeholder:opacity-50 rounded-sm border p-1 border-amber-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full  placeholder:opacity-50 rounded-sm border p-1 border-amber-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-amber-300 p-1 mb-1 hover:font-medium hover:text-[1.1rem] rounded-md w-[50%] hover:scale-110 duration-300 outline-none hover:bg-yellow-500 hover:text-slate-100 transition-transform"
        >
          Entrar
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
