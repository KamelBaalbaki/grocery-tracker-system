import Sidebar from "../layout/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full bg-brand min-h-screen p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;