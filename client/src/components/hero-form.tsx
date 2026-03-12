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
import {
  Sparkles,
  Building2,
  Palette,
  Type,
  FileText,
} from "lucide-react";

interface HeroFormProps {
  onGenerate: (logos: GeneratedLogo[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

const BUSINESS_TYPES = [
  { value: "technology", label: "Technology" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance & Fintech" },
  { value: "education", label: "Education" },
  { value: "food", label: "Food & Beverage" },
  { value: "real-estate", label: "Real Estate" },
  { value: "consulting", label: "Consulting" },
  { value: "creative", label: "Creative & Design" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "saas", label: "SaaS & Software" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "other", label: "Other" },
];

const HeroForm = ({ onGenerate, onLoading, onError }: HeroFormProps) => {
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
    <div className="max-w-3xl mx-auto px-2">
      {/* Hero text */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Logo Generator
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
          Design Your Brand
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {" "}Identity in Seconds
          </span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Describe your brand and let AI craft unique logo concepts
          tailored to your vision.
        </p>
      </div>

      {/* Form card */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-xl space-y-5"
        >
          {/* Brand Name & Business Type - side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                    <Type className="h-3.5 w-3.5 text-muted-foreground" />
                    Brand Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. NovaTech, Bloom, SnapShift"
                      className="h-11"
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
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Industry
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11" data-testid="select-business-type">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Brand Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what your brand does, its values, target audience, and the feeling you want the logo to convey..."
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

          {/* Color Preference */}
          <FormField
            control={form.control}
            name="colorPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                  Color Preference
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Ocean blue & coral, Earth tones, Monochrome black"
                    className="h-11"
                    data-testid="input-color-preference"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl font-semibold text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            data-testid="button-generate"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {isSubmitting ? "Generating Your Logos..." : "Generate Logos"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Takes about 30-60 seconds to generate all concepts
          </p>
        </form>
      </Form>
    </div>
  );
};

export default HeroForm;
