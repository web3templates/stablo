import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchInput({
  q,
  handleChange,
  placeholder
}) {
  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={q}
        onChange={handleChange}
        placeholder={placeholder}
        name="q"
        id="q"
        className="w-full px-3 py-2 border rounded-md outline-none focus:border-gray-300 focus:shadow-sm dark:bg-gray-900 dark:border-gray-600 dark:focus:border-white"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
