import React, { type FC } from "react";
import Link from "next/link";
import { Button } from "$/components/ui/button";
import { DateTime } from "luxon";
import { type AppRouter } from "$/server/api/root";
import { Calendar, Eye } from "lucide-react";
import { Skeleton } from "$/components/ui/skeleton";
import { type inferProcedureOutput } from "@trpc/server";
import { strTransformer } from "$/lib/utils/str-transformer";
import { Avatar } from "$/components/ui/avatar";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["user"]["getOwnedDebts"]>
  >["debtsAsLender"][number];
};

const DebtCard: FC<Props> & {
  Skeleton: FC;
} = ({ debt }) => {
  return (
    <Link
      key={debt.id}
      className="flex flex-col gap-2 rounded-lg border border-border p-6 shadow-sm transition-colors duration-200 ease-in hover:bg-background-secondary/70"
      href={`/dashboard/${debt.id}`}
    >
      <div className="flex items-center justify-between gap-4 text-lg font-bold text-indigo-500 dark:text-indigo-400">
        <span className="truncate">{debt.name}</span>

        <div className="flex -space-x-2 overflow-hidden p-2">
          {debt.borrowers?.map(({ user }) => (
            <Avatar key={user.name}>
              <Avatar.Image src={user.image ?? undefined} />

              <Avatar.Fallback>
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </Avatar.Fallback>
            </Avatar>
          ))}
        </div>
      </div>

      <span className="mb-6 mt-2 pr-2 lg:pr-3 xl:pr-6">
        {strTransformer.truncate(debt.description, 80)}
      </span>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {DateTime.fromJSDate(debt.createdAt).toLocaleString({
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <Button color="indigo" type="button" size="sm">
          <Eye className="mr-2 h-5 w-5" />
          Ver
        </Button>
      </div>
    </Link>
  );
};

const GroupCardSkeleton: FC = () => (
  <Skeleton className="flex h-48 flex-col gap-2 rounded-lg p-6" />
);

DebtCard.Skeleton = GroupCardSkeleton;
export default DebtCard;
