type Props = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: Props) => {
  return (
    <div className="w-full flex justify-center">
      <div className="container h-screen flex justify-center md:items-center mt-20 md:mt-0">
        this is dashboard layout
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
