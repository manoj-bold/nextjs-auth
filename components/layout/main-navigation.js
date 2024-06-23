import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import classes from "./main-navigation.module.css";

function MainNavigation() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  function handleLogout() {
    signOut({ callbackUrl: '/auth' });
  }

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {!loading && !session && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}

          {!loading && session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}

          {!loading && session && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
