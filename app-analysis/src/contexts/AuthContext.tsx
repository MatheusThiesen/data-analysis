import { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../service/apiClient";

type User = {
  id: string;
  email: string;
  nome: string;
};

type SignCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  email: string;
  name: string;
  password: string;
  cnpj: string;
  companyName: string;
  tradeName: string;
};

type AuthContextData = {
  signIn(creandentials: SignCredentials): Promise<ReponseSignIn | void>;
  signUp(creandentials: SignUpCredentials): Promise<ReponseSignIn | void>;
  signOut: () => void;
  reset(p: ResetProps): Promise<ReponseSignIn | void>;
  user?: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type ReponseSignIn = {
  title: string;
  status: "warning" | "success" | "error";
};

type ResetProps = {
  password: string;
  token: string;
};

export const AuthContext = createContext({} as AuthContextData);

const base_url =
  process.env.NODE_ENV !== "development"
    ? "https://app.alpardobrasil.com.br"
    : "http://localhost:3000";
const route_home = "/dashboard";

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { "nextauth.token": token } = parseCookies();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function authenticate(data: { token: string; refreshToken: string }) {
    setCookie(undefined, "nextauth.token", data.token, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });
    setCookie(undefined, "nextauth.refreshToken", data.refreshToken, {
      maxAge: 60 * 60 * 24 * 30, //30 Days
      path: "/",
    });

    //@ts-ignore
    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    const me = await api.get("/auth/me");

    setUser(me.data);

    Router.push(route_home);
  }

  async function signIn({
    email,
    password,
  }: SignCredentials): Promise<ReponseSignIn | void> {
    try {
      const response = await api.post("/auth/signin", {
        email,
        senha: password,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (error) {
      const err = error as AxiosError;

      return {
        title: "Login ou senha incorretos",
        status: "warning",
      };
    }
  }

  async function signUp({
    email,
    password,
    cnpj,
    name,
    companyName,
    tradeName,
  }: SignUpCredentials): Promise<ReponseSignIn | void> {
    try {
      const response = await api.post("/auth/signup", {
        email,
        senha: password,
        cnpj: cnpj,
        nome: name,
        razaoSocial: companyName,
        nomeFantasia: tradeName,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (error) {
      const err = error as AxiosError;

      return {
        title: "Login ou senha incorretos",
        status: "warning",
      };
    }
  }

  async function reset({
    password,
    token: tokenReset,
  }: ResetProps): Promise<ReponseSignIn | void> {
    try {
      const response = await api.post("/auth/reset", {
        senha: password,
        token: tokenReset,
      });

      const { access_token: token, refresh_token: refreshToken } =
        response.data;

      await authenticate({ token, refreshToken });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        return {
          title: error.response?.data?.message,
          status: "warning",
        };
      }

      return {
        title: "Desculpe, ocorreu um erro interno, Tente novamente mais tarde",
        status: "error",
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, isAuthenticated, user, signOut, reset, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
