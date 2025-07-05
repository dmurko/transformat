
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  startDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const DateSelector = ({ startDate, onDateChange, disabled = false }: DateSelectorProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Start date</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-gray-200 hover:border-green-300",
              !startDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed bg-gray-50"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : "Select start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={disabled ? undefined : onDateChange}
            initialFocus
            weekStartsOn={1}
            className={cn("p-3 pointer-events-auto")}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
