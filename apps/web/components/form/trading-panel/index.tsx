"use client";

import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useCreateTrade } from "@/hooks/trading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/global/loader";

const TradingPanelForm = ({ tokenPair, mode }: { tokenPair: string; mode: string }) => {
  const { createNewTrade, isPending, register, control, errors, watch, setValue } = useCreateTrade(tokenPair, mode);

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(data) => {
        console.log("data", data);
        createNewTrade(data);
      }}
    >
      {/* Order Type */}
      <div className="space-y-2">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setValue("price", null);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-themeBlack border-themeGray text-themeTextGray">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="LIMIT">Limit</SelectItem>
                <SelectItem value="MARKET">Market</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="type"
          render={({ message }) => <p className="text-red-400 text-sm">{message}</p>}
        />
      </div>

      {/* Side */}
      <div className="w-full">
        <Controller
          name="side"
          control={control}
          render={({ field }) => (
            <div className="w-full flex gap-2 justify-between">
              <Button
                type="button"
                className={`w-[49%] text-white  ${field.value === "BUY" ? "bg-[#fe8a1d]  hover:bg-[#fe8a1d]" : "bg-[#fe8a1d]/50 hover:bg-[#fe8a1d]/60 cursor-pointer"}`}
                onClick={() => {
                  field.onChange("BUY");
                }}
              >
                Buy
              </Button>

              <Button
                type="button"
                className={`w-[49%] text-white ${field.value === "SELL" ? "bg-[#fe8a1d] hover:bg-[#fe8a1d]" : "bg-[#fe8a1d]/50 hover:bg-[#fe8a1d]/60 cursor-pointer"}`}
                onClick={() => {
                  field.onChange("SELL");
                }}
              >
                Sell
              </Button>
            </div>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="side"
          render={({ message }) => <p className="text-red-400 text-sm">{message}</p>}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Controller
          name="price"
          control={control}
          render={({}) => (
            <div className="w-full flex gap-2 justify-between">
              <Input
                type="number"
                step="any"
                id="price"
                min="0"
                placeholder={watch("type") === "MARKET" ? "Market Price" : "0.00"}
                disabled={watch("type") === "MARKET"}
                className="bg-themeBlack border-themeGray text-themeTextGray h-11"
                {...register("price", {
                  valueAsNumber: true,
                })}
              />
            </div>
          )}
        />

        <ErrorMessage
          errors={errors}
          name="price"
          render={({ message }) => <p className="text-red-400 text-sm">{message}</p>}
        />
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Total</Label>
        <div className="w-full relative">
          <Input
            type="number"
            step="any"
            id="quantity"
            placeholder="0.00"
            className="bg-themeBlack border-themeGray text-themeTextGray h-11 pr-[30%]" // leave space for token selector
            {...register("quantity", { valueAsNumber: true })}
          />

          <Controller
            name="quantityToken"
            control={control}
            defaultValue="quote" // Sets the default value to "base"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value} // Controlled value
              >
                <SelectTrigger className="w-fit bg-themeBlack absolute right-1 top-[2px] p-0 m-0 h-0 border-none shadow-none">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="base">{tokenPair.split("_")[0]}</SelectItem>
                  <SelectItem value="quote">{tokenPair.split("_")[1]}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <ErrorMessage
          errors={errors}
          name="quantity"
          render={({ message }) => <p className="text-red-400 text-sm">{message}</p>}
        />
        <ErrorMessage
          errors={errors}
          name="quantityToken"
          render={({ message }) => <p className="text-red-400 text-sm">{message}</p>}
        />
      </div>

      {/* Symbol */}
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          id="symbol"
          placeholder="BTC_USDT"
          disabled={true}
          className="bg-themeBlack border-themeGray text-themeTextGray h-11"
          {...register("symbol")}
        />
        <ErrorMessage
          errors={errors}
          name="symbol"
          render={({ message }) => <p className="text-red-400 text-sm">{message}</p>}
        />
      </div>

      <Button type="submit" className=" cursor-pointer mt-4 w-full bg-[#fe8a1d] hover:bg-[#fe8a1d]/80 text-white h-11">
        <Loader loading={isPending}>Place Order</Loader>
      </Button>
    </form>
  );
};

export default TradingPanelForm;
