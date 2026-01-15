import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface RenderFormFieldProps {
    label: string;
    _tooltip: string;
    component: React.ReactNode;
    positionTooltip?: string;
    errorMessage : string
}

export default function RenderFormField({
    label,
    _tooltip,
    component,
    errorMessage,
    positionTooltip = "right-3"} : RenderFormFieldProps
) {
    return (
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            {label}
          </label>
          <div className="relative">
            {component}
            {(errorMessage) && (
              <div className={`absolute ${positionTooltip} top-1/2 transform -translate-y-1/2`}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{errorMessage}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      )
}