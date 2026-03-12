import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  logoGenerationRequestSchema,
  type LogoGenerationRequest,
  type GeneratedLogo,
} from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Wand2 } from "lucide-react";

interface HeroFormProps {
  onGenerate: (logos: GeneratedLogo[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

const HeroForm = ({
  onGenerate,
  onLoading,
  onError,
}: HeroFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LogoGenerationRequest>({
    resolver: zodResolver(logoGenerationRequestSchema),
    defaultValues: {
      brandName: "",
      description: "",
      businessType: "",
      colorPreference: "",
    },
  });

  const onSubmit = async (data: LogoGenerationRequest) => {
    try {
      setIsSubmitting(true);
      onLoading(true);

      const response = await apiRequest("POST", "/api/generate", data);
      const result = await response.json();

      onGenerate(result.logos);

      toast({
        title: "Logos Generated Successfully!",
        description: `Generated ${result.logos.length} unique logo designs for ${data.brandName}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate logos. Please try again.";
      onError(errorMessage);

      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center mb-16">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Create Professional Logos with
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {" "}
            AI Magic
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Generate stunning, unique logo designs for your brand in seconds.
          Powered by advanced AI technology.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-6"
        >
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Brand/Website Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your brand name"
                    data-testid="input-brand-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Brief Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business or what your brand represents..."
                    rows={3}
                    className="resize-none"
                    data-testid="textarea-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Business Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-business-type">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="creative">Creative & Design</SelectItem>
                    <SelectItem value="fitness">Fitness & Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colorPreference"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Color Preference (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Blue and white, Modern pastels, Bold and vibrant..."
                    data-testid="input-color-preference"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            data-testid="button-generate"
          >
            <Wand2 className="h-5 w-5 mr-1" />
            {isSubmitting ? "Generating..." : "Generate Logos"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default HeroForm;
