type StatCardProps = {
  label: string;
  value: number | string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
    </div>
  );
}