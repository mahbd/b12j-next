"use client";

import { Skeleton } from "@/components";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import Image from "next/image";

export const navLinks = [
  {
    id: "/",
    title: "Home",
  },
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
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <div className="bg-black text-white">
      {/* Desktop Navigation */}
      <nav
        className="sm:flex hidden navbar px-5"
        style={{
          minHeight: "40px",
        }}
      >
        <div className="navbar-start">
          {navLinks.map((nav) => (
            <span
              key={nav.id}
              className="mx-1"
              onClick={() => setActive(nav.title)}
            >
              <a href={`${nav.id}`} className="text-white">
                {nav.title}
              </a>
            </span>
          ))}
        </div>
        <div className="navbar-end">
          <AuthStatus />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="sm:hidden flex flex-1 justify-end items-center">
        <button
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        >
          {toggle ? <IoMdClose /> : <IoMdMenu />}
        </button>

        {/* Sidebar */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width={"3rem"} height={"20px"} />;
  if (status === "unauthenticated")
    return (
      <Link href={"/api/auth/signin"} className="nav-link">
        Login
      </Link>
    );
  return (
    <Link href={"/api/auth/signout"} className="nav-link">
      Logout
    </Link>
  );
  // return (
  //   <details className="dropdown dropdown-left bg-none">
  //     <summary>
  //       <div className="avatar">
  //         <div className="h-8">
  //           <Image
  //             height="20"
  //             width="20"
  //             alt="This is profile pic"
  //             src={session!.user!.image!}
  //           />
  //         </div>
  //       </div>
  //     </summary>
  //     <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
  //       <li>
  //         <p>{session!.user!.email}</p>
  //       </li>
  //       <li>
  //         <Link href={"/api/auth/signout"} className="nav-link">
  //           Logout
  //         </Link>
  //       </li>
  //     </ul>
  //   </details>
  // );
};
