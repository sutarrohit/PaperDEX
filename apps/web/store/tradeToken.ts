import { create } from "zustand";
import { tokenInfoType } from "../../../packages/lib/src/constants/tokenInfo";

type TokenStore = {
  data: tokenInfoType;
  setData: (data: tokenInfoType) => void;
  updateData: (partial: Partial<tokenInfoType>) => void;
};

export const useTradeTokenStore = create<TokenStore>((set) => ({
  data: {
    id: "",
    name: "",
    symbol: "",
    icon: "",
  },

  setData: (data) => set({ data }),

  updateData: (partial) =>
    set((state) => ({
      data: {
        ...state.data,
        ...partial,
      },
    })),
}));
