import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
const OrderHistory = () => {
  return (
    <Card className="w-full rounded-md p-3 h-full">
      <CardContent className="p-0">
        <div className="w-full flex gap-4">
          <span className="font-semibold text-[#FE8A1D] text-[14px] cursor-pointer">Open Order</span>
          <span className="font-semibold text-[#FE8A1D] text-[14px] cursor-pointer">Order History </span>
        </div>
        <Separator className="my-2" />
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
