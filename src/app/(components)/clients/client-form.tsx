
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { suggestClientNote, type SuggestClientNoteInput } from "@/ai/flows/suggest-client-note-flow";
import { useToast } from "@/hooks/use-toast";

const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: Client | null;
  onSubmit: (data: ClientFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function ClientForm({ initialData, onSubmit, isSubmitting = false, submitButtonText = "Save Client" }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const [isSuggestingNote, setIsSuggestingNote] = useState(false);
  const { toast } = useToast();

  const handleSuggestNote = async () => {
    const clientName = form.getValues("name");
    if (!clientName.trim()) {
      toast({
        title: "Nom du client requis",
        description: "Veuillez d'abord saisir un nom pour le client.",
        variant: "destructive",
      });
      return;
    }

    setIsSuggestingNote(true);
    try {
      const result = await suggestClientNote({ clientName });
      form.setValue("notes", result.note, { shouldValidate: true, shouldDirty: true });
      toast({
        title: "Suggestion de note générée",
        description: "La note a été insérée. Vous pouvez la modifier.",
      });
    } catch (error) {
      console.error("Failed to suggest note:", error);
      toast({
        title: "Erreur de suggestion",
        description: "Impossible de générer une suggestion de note pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingNote(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g. john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Notes</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSuggestNote}
                      disabled={isSuggestingNote}
                      className="text-xs"
                    >
                      {isSuggestingNote ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Suggestion IA
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Any relevant notes about the client (e.g., preferences, allergies)."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || isSuggestingNote}>
              {isSubmitting ? "Saving..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
