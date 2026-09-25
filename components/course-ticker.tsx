import { NYU_COURSES, deptColors } from "@/data/courses";

function CourseCard({ course }: { course: typeof NYU_COURSES[0] }) {
  const bg = deptColors[course.dept] ?? "#f5f5f5";
  return (
    <div className="rounded-lg p-3 flex flex-col gap-1 select-none" style={{ backgroundColor: bg, minWidth: 160, maxWidth: 200 }}>
      <span className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase">{course.code}</span>
      <span className="text-[12px] font-medium text-gray-700 leading-tight">{course.title}</span>
      <span className="text-[10px] text-gray-400 mt-auto">{course.dept} · {course.credits} cr</span>
    </div>
  );
}

const DOUBLED = [...NYU_COURSES, ...NYU_COURSES, ...NYU_COURSES];

export default function CourseTicker({ offset = 0, reverse = false }: { offset?: number; reverse?: boolean }) {
  const items = DOUBLED.slice(offset, offset + 12);
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex gap-3"
        style={{ animation: `ticker${reverse ? "Rev" : "Fwd"} 40s linear infinite`, width: "max-content" }}
      >
        {doubled.map((c, i) => <CourseCard key={i} course={c} />)}
      </div>
    </div>
  );
}
