"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TicketPrioritySchema } from "@/lib/domain/validation";
import { useRouter } from "next/navigation";
import { createTicketAction } from "@/app/tickets/actions";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  priority: TicketPrioritySchema,
  computerId: z.string().optional(),
  name: z.string().min(2, "Name is required for guest registration").optional(),
  email: z.string().email("Valid email required for notification").optional(),
});

import { submitPublicTicketAction } from "@/app/portal/actions";

export function TicketWizard({ publicTenantId }: { publicTenantId?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      computerId: "",
      name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let result;

      if (publicTenantId) {
        // Public Submission
        result = await submitPublicTicketAction({
          tenantId: publicTenantId,
          name: values.name || "Anonymous",
          email: values.email || "anonymous@example.com",
          title: values.title,
          description: values.description,
          priority: values.priority,
          computerId: values.computerId,
        });
      } else {
        // Internal Submission
        result = await createTicketAction({
          tenantId: "demo", // TODO: Fetch real tenant
          name: values.name,
          email: values.email,
          title: values.title,
          description: values.description,
          priority: values.priority,
          computerId: values.computerId,
        });
      }

      if (result.success) {
        toast.success("Ticket created successfully!");
        if (publicTenantId) {
          // Show success state or redirect to a thank you page
          form.reset();
        } else {
          router.push("/tickets");
        }
      } else {
        toast.error(result.error || "Failed to create ticket.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create New Ticket</CardTitle>
        <CardDescription>Describe your issue in detail. Our AI will help classify it.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-500">Your Name {publicTenantId && "*"}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-slate-50 dark:bg-slate-900"
                        required={!!publicTenantId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-500">Your Email {publicTenantId && "*"}</FormLabel>
                    <FormControl>
                      <Input placeholder="john@enterprise.com" {...field} className="bg-slate-50 dark:bg-slate-900"
                        required={!!publicTenantId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-slate-500">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Printer is jamming" {...field} className="bg-slate-50 dark:bg-slate-900" />
                  </FormControl>
                  <FormDescription className="text-[10px]">
                    A short summary of the problem.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-slate-500">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain what happened, any error messages, etc."
                      className="min-h-[120px] bg-slate-50 dark:bg-slate-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-500">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="computerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-500">Asset / Computer (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LT-12345" {...field} className="bg-slate-50 dark:bg-slate-900" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 gap-2">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-8">
                {isSubmitting ? "Creating..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
