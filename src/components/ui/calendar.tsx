
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type CaptionProps } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select" // Assuming select is in the same directory


export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = fr, // Default to French locale
  ...props
}: CalendarProps) {

  const handleCalendarChange = (
    _month: Date,
    form: { क्षमता: (newMonth: Date) => void } // Using a simplified type, adjust if needed
  ) => {
    // Not directly used for year/month selection here but part of react-day-picker's API
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        caption: "flex justify-center pt-1 relative items-center",
        ...classNames,
      }}
      locale={locale}
      components={{
        IconLeft: ({ className: c, ...rest }) => (
          <ChevronLeft className={cn("h-4 w-4", c)} {...rest} />
        ),
        IconRight: ({ className: c, ...rest }) => (
          <ChevronRight className={cn("h-4 w-4", c)} {...rest} />
        ),
        Caption: ({ displayMonth, ...rest }: CaptionProps) => {
          const currentYear = new Date().getFullYear()
          const years = Array.from(
            { length: 20 },
            (_, i) => currentYear - 10 + i
          ) // Example: 10 years past, 10 years future
          const months = Array.from({ length: 12 }, (_, i) =>
            new Date(displayMonth.getFullYear(), i)
          );


          return (
            <div className="flex justify-between items-center gap-2 px-1">
               <h2 className="text-sm font-medium">
                {format(displayMonth, "MMMM yyyy", { locale })}
              </h2>
            </div>
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
