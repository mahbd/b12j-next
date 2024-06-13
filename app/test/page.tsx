"use client";
import MDEditor from "../../components/MDEditor";

const Page = () => {
  return <MDEditor name="hello" onChange={(value) => console.log(value)} />;
};

export default Page;
