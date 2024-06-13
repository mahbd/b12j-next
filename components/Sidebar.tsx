import prisma from "@/prisma/client";

const Sidebar = async () => {
  const contests = await prisma.contest.findMany();
  const tutorials = await prisma.tutorial.findMany();
  return (
    <div
      className="flex-col content-center justify-center"
      style={{ width: "200px", height: "90vh" }}
    >
      <div className=" m-2">
        <div className=" bg-black text-white rounded-lg p-1">
          <p className="mx-2">Latest Contests</p>
        </div>
        <table className="mx-2">
          <tbody>
            {contests.map((contest) => (
              <tr key={contest.id}>
                <td>{contest.title}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className=" bg-black text-white rounded-lg p-1 mt-4">
          <p className="mx-2">Latest Tutorials</p>
        </div>
        <table className="mx-2">
          <tbody>
            {tutorials.map((tutorial) => (
              <tr key={tutorial.id}>
                <td>{tutorial.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sidebar;
