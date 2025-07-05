"use client";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { getUserStats } from "@/lib/api/user-api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { type LucideIcon } from "lucide-react";

export type sectionDataSchema = {
  name: string;
  id: string;
  data: string;
  icon: LucideIcon;
};

export function SectionCards({
  data,
  className,
}: {
  data: sectionDataSchema[];

  className?: string;
}) {
  const {
    data: userStats,
    isLoading,

    // isError,
  } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => getUserStats(),
  });

  return (
    <div
      className={cn(
        "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4",
        className,
      )}
    >
      {data &&
        data?.map((section, index) => {
          return (
            <Card className="@container/card " key={index}>
              <CardHeader>
                <CardDescription className="grid gap-4">
                  <div className="border w-fit p-1.5 rounded-md bg-orange-500">
                    <section.icon className="font-semibold w-5 h-5 text-white" />
                  </div>

                  <div className="flex flex-col">
                    <div className="text-[18px]">{section.name}</div>
                    <span className="text-[18px]">
                      {section.id === "totalBalance"
                        ? isLoading
                          ? "--"
                          : (userStats?.data[section?.id].toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumSignificantDigits: 7,
                            }) ?? "0")
                        : isLoading
                          ? "--"
                          : (userStats?.data[section?.id] ?? "0")}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
    </div>
  );
}
