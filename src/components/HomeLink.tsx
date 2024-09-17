import { BookOpen } from "lucide-react";
import Link from "next/link";

const HomeLink = () => {
  return (
    <Link className="flex items-center justify-between gap-2" href="/">
      <BookOpen className="h-6 w-6" />
      <span className="font-bold inline-block">Knowledg</span>
    </Link>
  );
};

export default HomeLink;
