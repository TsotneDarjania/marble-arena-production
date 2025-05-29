"use client";

import { useAppContext } from "@/app/context/AppContexty";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { login, signup } from "@/app/utils/supabase/actions/authActions";
import { InfoModal } from "../infoModal/InfoModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(1, "Username is required"),
});

// Infer types
type LoginSchema = z.infer<typeof loginSchema>;
type RegisterSchema = z.infer<typeof registerSchema>;
type FormSchema = LoginSchema | RegisterSchema;

export default function AuthModal() {
  const { isAuthModalOpen } = useAppContext();

  const [isLoginState, setisLoginState] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [clickSubmitButton, setClickSubmitButton] = useState(false);
  const [warningText, setWarningText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(isLoginState ? loginSchema : registerSchema),
  });

  useEffect(() => {
    setisLoginState(true);
    setClickSubmitButton(false);
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const onSubmit = async (data: FormSchema) => {
    setClickSubmitButton(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (!isLoginState && "username" in data) {
      formData.append("username", data.username);
    }

    if (isLoginState) {
      const result = await login(formData);

      if (result.success) {
        window.location.href = "/";
      } else {
        setWarningText(result.message || "Something went wrong, try again.");
        setIsInfoModalOpen(true);
      }
    } else {
      const result = await signup(formData);
      setClickSubmitButton(false);

      if (result.success) {
        setisLoginState(true);
      } else {
        setWarningText(result.message || "Something went wrong, try again.");
        setIsInfoModalOpen(true);
      }
    }
  };

  return (
    <>
      <div className={styles.modal}>
        {clickSubmitButton && <div className={styles.block}></div>}
        <h2 className={styles.title + " title-font"}>LOGIN / REGISTER</h2>

        <form
          className={styles.form + " text-font"}
          onSubmit={handleSubmit(onSubmit)}
        >
          {!isLoginState && (
            <>
              <label>Username</label>
              <input
                {...register("username")}
                maxLength={20}
                type="text"
                placeholder="Enter your username"
              />
              {/* Access username error only if it's register mode */}
              {!isLoginState && "username" in errors && (
                <p className={styles.error}>{errors.username?.message}</p>
              )}
            </>
          )}

          <label>Email address</label>
          <input
            {...register("email")}
            maxLength={50}
            type="email"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          <label>Password</label>
          <input
            {...register("password")}
            maxLength={30}
            type="password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          <div className="w-[100%]">
            <button
              type="submit"
              className={isLoginState ? styles.loginBtn : styles.registerBtn}
            >
              {isLoginState ? "LOGIN" : "REGISTER"}
            </button>
          </div>

          {isLoginState && (
            <p
              onClick={() => setisLoginState(false)}
              className={styles.registerLink}
            >
              REGISTER
            </p>
          )}
        </form>

        <footer className={styles.footer}>© 2024 Marble Arena</footer>
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
