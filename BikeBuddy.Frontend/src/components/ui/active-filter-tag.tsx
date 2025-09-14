import { X } from "lucide-react";
import { Button } from "./button";

interface ActiveFilterTagProps {
  label: string;
  value: string | number;
  onRemove: () => void;
  icon?: React.ReactNode;
}

const ActiveFilterTag = ({ label, value, onRemove, icon }: ActiveFilterTagProps) => (
  <div className="flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100 px-2 py-1 rounded-md mr-2 mb-2">
    {icon && <span className="mr-1">{icon}</span>}
    <span className="text-xs font-medium">
      {label}: {value}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={onRemove}
      className="h-5 w-5 p-0 ml-1 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800/30"
    >
      <X className="h-3 w-3" />
      <span className="sr-only">Очистить фильтр</span>
    </Button>
  </div>
);

export default ActiveFilterTag;