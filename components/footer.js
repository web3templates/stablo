import Container from "@/components/container";
import ThemeSwitch from "@/components/themeSwitch";

export default function Footer() {
  return (
    <Container className="mt-10 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
      <div className="text-center text-sm">
        Copyright © {new Date().getFullYear()} SSS MUSIC. All rights
        reserved.
      </div>
      <div>
        <ThemeSwitch />
      </div>
    </Container>
  );
}
