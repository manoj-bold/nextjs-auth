import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { useFlashMessage } from "../../hooks/flash-message";
import classes from "./auth-form.module.css";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const { setFlashMessage } = useFlashMessage();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result.error) {
        setFlashMessage("You are now logged in");
        router.push("/profile");
      } else {
        setFlashMessage(result.error);
      }
    } else {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Assuming signup and automatic login are successful, redirect to profile page
        setFlashMessage("You are now signed up");
        router.push("/profile");
      } else {
        try {
          const data = await response.json();
          setFlashMessage(data.message);
        } catch (error) {
          setFlashMessage(error.message);
        }
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" name="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" name="password" required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
