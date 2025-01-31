import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditBugFormFieldsProps {
  title: string;
  currentSituation: string;
  expectedBehavior: string;
  url: string;
  product: string;
  setTitle: (value: string) => void;
  setCurrentSituation: (value: string) => void;
  setExpectedBehavior: (value: string) => void;
  setUrl: (value: string) => void;
  setProduct: (value: string) => void;
}

export const EditBugFormFields = ({
  title,
  currentSituation,
  expectedBehavior,
  url,
  product,
  setTitle,
  setCurrentSituation,
  setExpectedBehavior,
  setUrl,
  setProduct,
}: EditBugFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
            <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
            <SelectItem value="lynx-plus">LYNX+ / Client Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary of the issue"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentSituation">Current Situation</Label>
        <Textarea
          id="currentSituation"
          value={currentSituation}
          onChange={(e) => setCurrentSituation(e.target.value)}
          placeholder="Describe what's happening"
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectedBehavior">Expected Behavior</Label>
        <Textarea
          id="expectedBehavior"
          value={expectedBehavior}
          onChange={(e) => setExpectedBehavior(e.target.value)}
          placeholder="Describe how it should work"
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Page URL where the issue occurred"
        />
      </div>
    </>
  );
};