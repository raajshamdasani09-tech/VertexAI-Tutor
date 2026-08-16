import { BookOpen, TrendingUp, Award, Clock } from "lucide-react";

const ICONS = { BookOpen, TrendingUp, Award, Clock };
const TINTS = {
  BookOpen: "bg-brand-50 text-brand-500",
  TrendingUp: "bg-emerald-50 text-emerald-500",
  Award: "bg-amber-50 text-amber-500",
  Clock: "bg-sky-50 text-sky-500",
};

export default function StatCard({ label, value, sublabel, icon }) {
  const Icon = ICONS[icon] ?? BookOpen;
  const tint = TINTS[icon] ?? TINTS.BookOpen;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
    </div>
  );
}