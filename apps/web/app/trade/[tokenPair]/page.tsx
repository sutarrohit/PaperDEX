import React from "react";

const Trade = async ({
  searchParams,
  params,
}: {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const tokenPair = params.token || "BNB_USDT";
  const type = searchParams.type || "spot";

  return (
    <div>
      {tokenPair}
      {type}
    </div>
  );
};

export default Trade;
