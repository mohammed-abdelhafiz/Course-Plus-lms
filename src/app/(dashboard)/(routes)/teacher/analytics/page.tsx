import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { DataCard } from "./_components/DataCard";
import { Chart } from "./_components/Chart";

export default async function TeacherAnalyticsPage() {
  const { userId } = await auth();
  const { data, totalRevenue, totalSales } = await getAnalytics(userId!);
  return (
    <div className="p-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat/>
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
}
