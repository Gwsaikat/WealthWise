import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useToast } from "../ui/use-toast";
import { cn } from "../../lib/utils";
import { expenseFormSchema, ExpenseFormValues } from "../../schemas/forms";

// Expense categories
const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Housing",
  "Entertainment",
  "Education",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Personal",
  "Other"
];

interface AddExpenseFormProps {
  onSubmit: (data: ExpenseFormValues) => Promise<void>;
  defaultValues?: Partial<ExpenseFormValues>;
  isEdit?: boolean;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false
}) => {
  const { toast } = useToast();
  
  // Initialize form with Zod schema validation
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: defaultValues?.amount || undefined,
      category: defaultValues?.category || "Food",
      description: defaultValues?.description || "",
      date: defaultValues?.date || new Date(),
      isRecurring: defaultValues?.isRecurring || false,
      recurringFrequency: defaultValues?.recurringFrequency,
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  // Form submission handler
  const handleSubmit = async (data: ExpenseFormValues) => {
    try {
      await onSubmit(data);
      
      if (!isEdit) {
        // Reset form after successful submission if it's not an edit
        form.reset({
          amount: undefined,
          category: "Food",
          description: "",
          date: new Date(),
          isRecurring: false,
          recurringFrequency: undefined,
        });
      }
      
      toast({
        title: `Expense ${isEdit ? "updated" : "added"}`,
        description: `Successfully ${isEdit ? "updated" : "added"} expense of ${data.amount}`,
      });
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "adding"} expense:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "add"} expense. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Amount Field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  <Input
                    placeholder="0.00"
                    className="pl-8 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    {...field}
                    onChange={(e) => {
                      // Only allow valid number inputs
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter expense description"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-300">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-gray-800/50 border-gray-600 text-white",
                        !field.value && "text-gray-500"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        {/* Is Recurring Field */}
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-yellow-500 rounded bg-gray-700 border-gray-600"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <Label className="text-gray-300">Recurring expense</Label>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        {/* Recurring Frequency - shown only when isRecurring is true */}
        {form.watch("isRecurring") && (
          <FormField
            control={form.control}
            name="recurringFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Frequency</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-xs">
                  How often this expense repeats
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        )}
        
        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEdit ? "Update Expense" : "Add Expense"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddExpenseForm; 