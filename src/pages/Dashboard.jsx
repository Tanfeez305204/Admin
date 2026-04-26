import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import StatCard from "../components/StatCard";
import { useMoviesList } from "../hooks/useMovies";

const LANGUAGE_ORDER = [
  "Hindi Dubbed",
  "South Dubbed",
  "English",
  "Bollywood",
  "Multi Audio"
];

export default function Dashboard() {
  const { data, isLoading } = useMoviesList({
    page: 1,
    limit: 1,
    sortBy: "created_at",
    sortOrder: "desc"
  });
  const { data: publishedData } = useMoviesList({
    page: 1,
    limit: 1,
    sortBy: "created_at",
    sortOrder: "desc",
    isPublished: "true"
  });

  const chartData = useMemo(
    () =>
      LANGUAGE_ORDER.map((language) => ({
        language,
        count: data?.languageCounts?.[language] || 0
      })),
    [data]
  );

  const totalMovies = data?.total || 0;
  const publishedMovies = publishedData?.total || 0;
  const draftMovies = Math.max(0, totalMovies - publishedMovies);

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-white/5 bg-panelSoft p-6 text-sm text-slate-300 shadow-panel sm:rounded-[2rem] sm:p-8">
        Loading dashboard metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Platform Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Movies" value={totalMovies} icon="M" tone="accent" />
        <StatCard label="Published Movies" value={publishedMovies} icon="P" tone="success" />
        <StatCard label="Languages Covered" value={chartData.filter((item) => item.count).length} icon="L" />
        <StatCard label="Draft Movies" value={draftMovies} icon="D" tone="warning" />
      </div>

      <div className="rounded-[1.75rem] border border-white/5 bg-panelSoft p-4 shadow-panel sm:rounded-[2rem] sm:p-6">
        <div className="mb-5 sm:mb-6">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Language Mix</p>
          <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Movies by language</h2>
        </div>

        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="h-[300px] min-w-[560px] sm:h-[360px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27314d" />
                <XAxis dataKey="language" stroke="#94a3b8" tick={{ fontSize: 12 }} interval={0} />
                <YAxis stroke="#94a3b8" allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111628",
                    border: "1px solid #27314d",
                    borderRadius: "16px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
