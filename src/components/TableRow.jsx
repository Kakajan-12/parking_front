import { useState } from "react";

const TableRow = ({ index, name, id, status }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Inside", "Outside"];

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 font-medium text-left">{index}</td>
      <td className="p-4 font-medium text-left">{name}</td>
      <td className="p-4 font-medium text-left">{id}</td>
      <td className="p-4 relative text-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex h-10 w-40 items-center justify-between rounded-md border px-3 py-2 text-sm bg-gray-100 m-auto"
        >
          <span>{status}</span>
          <svg
            className="h-4 w-4 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-40 left-1/2 -translate-x-1/2 rounded-md border bg-white shadow-lg">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </td>
      <td className="p-4 flex justify-center gap-2">
        <button
          className="inline-flex items-center gap-2 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 rounded-md px-3"
          type="button"
        >
          <svg
            className="lucide lucide-trash"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default TableRow