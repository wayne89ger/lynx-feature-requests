
import { PageHeader } from "@/components/feature-request/PageHeader";
import { DataManager } from "@/components/feature-request/DataManager";
import { useState } from "react";

const Index = () => {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-5xl">
      <PageHeader />
      <DataManager globalSearchTerm={globalSearchTerm} setGlobalSearchTerm={setGlobalSearchTerm} />
    </div>
  );
};

export default Index;
