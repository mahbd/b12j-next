"use client";

import { Skeleton } from "@/components";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Role, User } from "@prisma/client";

export const navLinks = [
  {
    id: "/contests",
    title: "Contests",
  },
  {
    id: "/problems",
    title: "Problems",
  },
  {
    id: "/submissions",
    title: "Submissions",
  },
  {
    id: "/tutorials",
    title: "Tutorials",
  },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div>
      {/* Desktop Navigation */}
      <nav className="sm:flex hidden navbar px-5 py-0 bg-base-200 min-h-8">
        <div className="navbar-start">
          <Link href={"/"} className="btn btn-ghost btn-sm text-lg font-medium">
            CPCCB
          </Link>
          {navLinks.map((nav) => (
            <span key={nav.id} className="mx-1">
              <a href={`${nav.id}`}>{nav.title}</a>
            </span>
          ))}
        </div>
        <div className="navbar-end">
          <AuthStatus />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="navbar bg-base-200 sm:hidden flex min-h-4 py-1">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] shadow bg-base-100 rounded-box w-52"
            >
              {navLinks.map((nav, index) => (
                <li
                  key={nav.id}
                  className={`font-poppins cursor-pointer text-[16px] ${
                    pathname.search(nav.id) === 0 ? "font-bold" : ""
                  } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                >
                  <a href={`${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link href={"/"} className="btn btn-ghost btn-sm text-lg font-medium">
            CPCCB
          </Link>
        </div>
        <div className="navbar-end">
          <AuthStatus />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width={"3rem"} height={"20px"} />;
  if (status === "unauthenticated" || !session || !session.user)
    return (
      <Link href={"/api/auth/signin"} className="nav-link">
        Login
      </Link>
    );

  const user: User = session.user as User;
  return (
    <div className="dropdown dropdown-end max-h-4">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm btn-circle avatar -m-2"
      >
        <div className="w-10 rounded-full">
          <Image
            height={24}
            width={24}
            alt="Tailwind CSS Navbar component"
            src={user.image || ""}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <Link href={"/profile"} className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        {(user.role === Role.ADMIN || user.role === Role.STAFF) && (
          <li>
            <Link href={"/admin"} className="justify-between">
              Admin Panel
              <span className="badge">New</span>
            </Link>
          </li>
        )}
        <li>
          <Link href={"/api/auth/signout"} className="nav-link">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};
