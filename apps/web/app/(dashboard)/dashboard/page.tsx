import { BalanceChart } from "./_components/balance-chart";
import UserBalance from "./_components/user-balance.tsx";

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:max-h-[calc(100vh_-_80px)]">
      <div className="w-full h-full">
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-3 grid-rows-3 h-full">
          <div className="bg-[#161616] lg:row-span-full rounded-xl h-[500px] lg:h-full">
            <UserBalance />
          </div>

          <div className="bg-[#161616] lg:col-span-2 h-[500px] lg:h-full rounded-xl border">
            {/* h-fit lg:h-full*/}
            <>chart1</>
          </div>

          <div className="bg-[#161616] lg:col-span-2 lg:row-span-2 rounded-xl h-[500px] lg:h-full border">
            <BalanceChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
