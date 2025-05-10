import React from "react";
import LandingPageNavbar from "../(landing)/_components/navbar";

type Props = {
  children: React.ReactNode;
};

const LayoutMarket = ({ children }: Props) => {
  return (
    <div className="border border-pink-500 w-full min-h-screen flex justify-center">
      <div className="container border border-yellow-500">
        <LandingPageNavbar />
        {children}
      </div>
    </div>
  );
};

export default LayoutMarket;
