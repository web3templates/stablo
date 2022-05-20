import Link from "next/link";
import Label from "@components/ui/label";

export default function CategoryLabel({ categories }) {
  return (
    <div>
      {categories?.length &&
        categories.slice(0).map((category, index) => (
          <Link
            href={`/category/${category.slug.current}`}
            key={index}>
            <a>
              <Label color={category.color}>{category.title}</Label>
            </a>
          </Link>
        ))}
    </div>
  );
}
