import { isLogged } from "@/components/helpers";
import { Role } from "@prisma/client";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await isLogged("/admin");
  if (user.role !== Role.ADMIN && user.role !== Role.STAFF) {
    return { redirect: "/denied" };
  }
  return children;
};

export default AdminLayout;
