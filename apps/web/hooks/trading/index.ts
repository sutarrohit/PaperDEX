import { useForm } from "react-hook-form";
import { TradingPanelSchema } from "@/components/form/trading-panel/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTrade } from "@/lib/api/trade-api";

export const useCreateTrade = (tokenPair: string, type: string) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof TradingPanelSchema>>({
    resolver: zodResolver(TradingPanelSchema),
    defaultValues: {
      type: "MARKET",
      side: "BUY",
      mode: type === "SPOT" || type === "GRID" || type === "FUTURE" ? (type as "SPOT" | "GRID" | "FUTURE") : "SPOT",
      price: null,
      symbol: tokenPair,
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    // Mock API call — replace with your real function
    mutationFn: (data: z.infer<typeof TradingPanelSchema>) => createTrade(data),

    onError: (error: Error) => {
      toast.error(error.message || "❌ Failed to perform trade.");
    },
    onSuccess: (data) => {
      reset();
      toast.success("✅ Trade executed successfully!", {
        description: `You placed a ${data.side} ${data.type} order for ${data.quantity} ${data.symbol}.`,
        duration: 5000,
      });
    },
  });

  const createNewTrade = handleSubmit((values) => {
    console.log("values----------------------------------", values);

    mutate(values);
  });

  return {
    createNewTrade,
    isPending,
    handleSubmit,
    register,
    control,
    errors,
  };
};
