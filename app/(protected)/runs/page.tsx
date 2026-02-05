import { redirect } from "next/navigation";
import { listRuns } from "@/capabilities/exec/repo";
import { RunList } from "@/capabilities/exec/ui/RunList";
import { getExecAccess } from "@/lib/auth/exec-access";

export default async function RunsPage() {
  const access = await getExecAccess();

  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      redirect("/login");
    }
    return (
      <div className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        {access.message}
      </div>
    );
  }

  const userId = access.userId;

  const { runs, error } = await listRuns(userId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Runs</h1>
        <p className="text-sm text-gray-600">
          Latest runs for the signed-in user.
        </p>
      </div>
      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Failed to load runs: {String(error)}
        </div>
      ) : (
        <RunList runs={runs} />
      )}
    </div>
  );
}
