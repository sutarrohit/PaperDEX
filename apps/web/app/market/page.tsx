import TopCoins from "@/components/global/top-coins";
import MarketTable from "../../components/global/MarketTable";

const Market = () => {
  return (
    <div className="w-full px-2 mt-10 flex flex-col gap-4">
      <div className="">
        <TopCoins />
      </div>

      <MarketTable />
    </div>
  );
};

export default Market;
