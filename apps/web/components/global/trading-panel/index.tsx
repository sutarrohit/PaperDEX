"use client";

import { Card, CardContent } from "@/components/ui/card";
import TradingPanelForm from "@/components/form/trading-panel";

import { Separator } from "@/components/ui/separator";

const TradingPanel = () => {
  return (
    <Card className="w-full rounded-md p-3">
      <CardContent className="p-0">
        <div className="w-full">
          <p className="font-bold text-[#fe8a1d] text-[15px]">Spot</p>
          <Separator className="my-2" />
        </div>

        <TradingPanelForm />
      </CardContent>
    </Card>
  );
};

export default TradingPanel;
