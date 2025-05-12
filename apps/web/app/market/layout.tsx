import React from "react";
import LandingPageNavbar from "../(landing)/_components/navbar";

type Props = {
  children: React.ReactNode;
};

const LayoutMarket = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="container">
        <LandingPageNavbar />
        {children}
      </div>
    </div>
  );
};

export default LayoutMarket;
