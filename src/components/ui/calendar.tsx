"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 shadow-sm",
        caption_label: "text-lg font-bold text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-gray-800/80 border border-indigo-500/30 p-0 hover:bg-indigo-900/40 text-indigo-300 rounded-md transition-all"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-1 mt-2 bg-gradient-to-b from-gray-800/10 to-gray-900/20 rounded-lg p-2 border border-indigo-500/10 shadow-inner",
        head_row: "flex bg-gray-800/40 rounded-md border border-indigo-500/10",
        head_cell:
          "text-indigo-300 font-bold text-[0.9rem] rounded-md w-10 h-10 flex items-center justify-center",
        row: "flex w-full mt-2 gap-1",
        cell: "relative p-0 text-center rounded-md h-10 w-10 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-indigo-900/20",
        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-md transition-all duration-200 hover:bg-indigo-800/30 hover:text-white focus:bg-indigo-800/30 focus:text-white focus:ring-2 focus:ring-indigo-500/30",
        day_selected:
          "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white rounded-md",
        day_today: 
          "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-medium",
        day_outside: "text-gray-500 opacity-50",
        day_disabled: "text-gray-500 opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-indigo-500/20 aria-selected:text-indigo-200 rounded-md",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-7 w-7" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-7 w-7" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
