
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

interface BasicInformationProps {
  title: string;
  description: string;
  expectedBehavior?: string;
  url?: string;
  product: string;
  location: string;
  isBug: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setExpectedBehavior?: (value: string) => void;
  setUrl?: (value: string) => void;
  setProduct: (value: string) => void;
  setLocation: (value: string) => void;
}

export const BasicInformation = ({
  title,
  description,
  expectedBehavior,
  url,
  product,
  location,
  isBug,
  setTitle,
  setDescription,
  setExpectedBehavior,
  setUrl,
  setProduct,
  setLocation,
}: BasicInformationProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          {isBug ? "Current Situation" : "Description"}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      {isBug && (
        <>
          <div className="space-y-2">
            <Label htmlFor="expectedBehavior">Expected Behavior</Label>
            <Textarea
              id="expectedBehavior"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior?.(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl?.(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
            <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
            <SelectItem value="lynx-plus">LYNX+ / Product Discovery</SelectItem>
            <SelectItem value="proactive-service">Proactive Service</SelectItem>
            <SelectItem value="operational-efficiency">Operational Efficiency</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!isBug && product === "website-demand-capture" && (
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="knowledge-portal">Knowledge Portal</SelectItem>
              <SelectItem value="marketing-section">Marketing Section</SelectItem>
              <SelectItem value="service-portal">Service Portal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};
