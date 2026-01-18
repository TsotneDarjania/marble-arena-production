"use client";

import { useAppContext } from "@/app/context/AppContexty";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { login, signup } from "@/app/utils/supabase/actions/authActions";
import { InfoModal } from "../infoModal/InfoModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(1, "Username is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthModal() {
  const { isAuthModalOpen } = useAppContext();

  const [isLoginState, setisLoginState] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [clickSubmitButton, setClickSubmitButton] = useState(false);
  const [warningText, setWarningText] = useState("");

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    setisLoginState(true);
    setClickSubmitButton(false);
    loginForm.reset();
    registerForm.reset();
  }, [isAuthModalOpen]); // intentionally not adding form deps

  if (!isAuthModalOpen) return null;

  const onSubmitLogin = async (data: LoginForm) => {
    setClickSubmitButton(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await login(formData);

    if (result.success) {
      window.location.href = "/";
    } else {
      setWarningText(result.message || "Something went wrong, try again.");
      setIsInfoModalOpen(true);
      setClickSubmitButton(false);
    }
  };

  const onSubmitRegister = async (data: RegisterForm) => {
    setClickSubmitButton(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("username", data.username);

    const result = await signup(formData);
    setClickSubmitButton(false);

    if (result.success) {
      setisLoginState(true);
      window.location.reload();
    } else {
      setWarningText(result.message || "Something went wrong, try again.");
      setIsInfoModalOpen(true);
    }
  };

  return (
    <>
      <div className={styles.modal}>
        {clickSubmitButton && <div className={styles.block}></div>}
        <h2 className={styles.title + " title-font"}>LOGIN / REGISTER</h2>

        {isLoginState ? (
          // ✅ LOGIN FORM
          <form
            className={styles.form + " text-font"}
            onSubmit={loginForm.handleSubmit(onSubmitLogin)}
          >
            <label>Email address</label>
            <input
              {...loginForm.register("email")}
              maxLength={50}
              type="email"
              placeholder="Enter your email"
            />
            {loginForm.formState.errors.email && (
              <p className={styles.error}>
                {loginForm.formState.errors.email.message}
              </p>
            )}

            <label>Password</label>
            <input
              {...loginForm.register("password")}
              maxLength={30}
              type="password"
              placeholder="Enter your password"
            />
            {loginForm.formState.errors.password && (
              <p className={styles.error}>
                {loginForm.formState.errors.password.message}
              </p>
            )}

            <div className="w-[100%]">
              <button type="submit" className={styles.loginBtn}>
                LOGIN
              </button>
            </div>

            <p
              onClick={() => setisLoginState(false)}
              className={styles.registerLink}
            >
              REGISTER
            </p>
          </form>
        ) : (
          // ✅ REGISTER FORM
          <form
            className={styles.form + " text-font"}
            onSubmit={registerForm.handleSubmit(onSubmitRegister)}
          >
            <label>Username</label>
            <input
              {...registerForm.register("username")}
              maxLength={20}
              type="text"
              placeholder="Enter your username"
            />
            {registerForm.formState.errors.username && (
              <p className={styles.error}>
                {registerForm.formState.errors.username.message}
              </p>
            )}

            <label>Email address</label>
            <input
              {...registerForm.register("email")}
              maxLength={50}
              type="email"
              placeholder="Enter your email"
            />
            {registerForm.formState.errors.email && (
              <p className={styles.error}>
                {registerForm.formState.errors.email.message}
              </p>
            )}

            <label>Password</label>
            <input
              {...registerForm.register("password")}
              maxLength={30}
              type="password"
              placeholder="Enter your password"
            />
            {registerForm.formState.errors.password && (
              <p className={styles.error}>
                {registerForm.formState.errors.password.message}
              </p>
            )}

            <div className="w-[100%]">
              <button type="submit" className={styles.registerBtn}>
                REGISTER
              </button>
            </div>
          </form>
        )}

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Marble Arena
        </footer>
      </div>

      {isInfoModalOpen && (
        <InfoModal
          title="Warning"
          text={warningText}
          callBack={() => {
            setClickSubmitButton(false);
            setIsInfoModalOpen(false);
          }}
        />
      )}
    </>
  );
}
