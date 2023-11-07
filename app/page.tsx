import authOptions from "@/auth/authOptions";
import { getServerSession } from "next-auth";

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div
      className="flex justify-center items-center text-2xl text-center w-full"
      style={{ color: "#d03af2", height: "80vh" }}
    >
      <div className="flex-col content-between">
        <p className="font-extrabold mb-2 text-4xl md:text-8xl">
          Welcome to B12J
        </p>
        <p>Online judge for beginners</p>
      </div>
    </div>
  );
};

export default Home;
