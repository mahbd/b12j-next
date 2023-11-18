import prisma from "@/prisma/client";
import Link from "next/link";
import React from "react";

const Checkers = async () => {
  const checkers = await prisma.checker.findMany();
  return (
    <div>
      <Link href="/checkers/new">Add new</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody>
          {checkers.map((checker) => (
            <tr key={checker.id}>
              <td>{checker.name}</td>
              <td>{checker.language}</td>
              <td>
                <pre>{checker.source}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Checkers;
