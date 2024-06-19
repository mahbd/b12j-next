const Home = async () => {
  return (
    <div
      className="flex justify-center items-center text-2xl text-center w-full"
      style={{ color: "#d03af2", height: "80vh" }}
    >
      <div className="flex-col content-between">
        <p className="font-extrabold mb-2 text-4xl md:text-8xl">
          Welcome to CPCCB
        </p>
        <p>An Online Judge for Beginners</p>
      </div>
    </div>
  );
};

export default Home;
