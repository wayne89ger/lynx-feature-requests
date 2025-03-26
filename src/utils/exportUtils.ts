
import { Feature } from "@/types/feature";

/**
 * Converts an array of features to CSV format and triggers a download
 */
export const exportFeaturesAsCSV = (features: Feature[]) => {
  // Define CSV headers
  const headers = [
    "ID",
    "Title",
    "Description",
    "Status",
    "Product",
    "Location",
    "Votes",
    "Reporter",
    "Urgency",
    "Experiment Owner",
    "Created At",
    "Updated At"
  ];

  // Create CSV rows from features
  const rows = features.map(feature => [
    feature.id,
    `"${feature.title.replace(/"/g, '""')}"`, // Escape quotes in text fields
    `"${feature.description.replace(/"/g, '""')}"`,
    feature.status,
    feature.product,
    feature.location || "",
    feature.votes,
    feature.reporter,
    feature.urgency,
    feature.experiment_owner || "",
    feature.created_at || "",
    feature.updated_at || ""
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `feature-requests-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
