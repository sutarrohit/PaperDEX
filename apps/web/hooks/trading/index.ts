import { useForm } from "react-hook-form";
import { TradingPanelSchema } from "@/components/form/trading-panel/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTrade } from "@/lib/api/trade-api";

export const useCreateTrade = (tokenPair: string, mode: string) => {
  const [base, quote] = tokenPair.split("_");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<z.infer<typeof TradingPanelSchema>>({
    resolver: zodResolver(TradingPanelSchema),
    defaultValues: {
      type: "MARKET",
      side: "BUY",
      mode: mode === "SPOT" || mode === "GRID" || mode === "FUTURE" ? (mode as "SPOT" | "GRID" | "FUTURE") : "SPOT",
      price: null,
      symbol: tokenPair,
      quantityToken: "base",
      quote: quote,
      base: base,
    },
    mode: "onChange",
  });

  // ✅ Watch entire form and log when any field changes

  const { mutate, isPending } = useMutation({
    // Mock API call — replace with your real function
    mutationFn: (data: z.infer<typeof TradingPanelSchema>) => createTrade(data),

    onError: (error: Error) => {
      toast.error(error.message || "❌ Failed to perform trade.");
    },
    onSuccess: (data) => {
      // ✅ Invalidate balance cache
      const tokenName = tokenPair.split("_").join(",");
      queryClient.invalidateQueries({
        queryKey: ["tradeTokenBalance", tokenName],
      });

      reset({
        ...getValues(),
        quantity: 0,
        price: null,
      });
      toast.success("✅ Trade executed successfully!", {
        description: `You placed a ${data.side} ${data.type} order for ${data.quantity} ${data.symbol}.`,
        duration: 5000,
      });
    },
  });

  const createNewTrade = handleSubmit((values) => {
    const parsedSymbol = values.symbol.split("_").join("/");
    const data = { ...values, symbol: parsedSymbol };

    mutate(data);
  });

  return {
    createNewTrade,
    isPending,
    handleSubmit,
    register,
    control,
    errors,
    watch,
    setValue,
  };
};
