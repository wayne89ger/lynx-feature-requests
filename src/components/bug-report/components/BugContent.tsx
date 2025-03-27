
interface BugContentProps {
  title: string;
  description: string;
  reporter: string;
}

export const BugContent = ({ title, description, reporter }: BugContentProps) => {
  return (
    <div className="space-y-2 mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-xs text-gray-500">
        Reported by: {reporter}
      </p>
    </div>
  );
};
