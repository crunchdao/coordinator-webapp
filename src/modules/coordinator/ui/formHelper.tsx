import { InfoCircle } from "@crunch-ui/icons";

interface FormHelperProps {
  focusedField: string | null;
  offsetTop?: number;
}

export const FormHelper: React.FC<FormHelperProps> = ({
  focusedField,
  offsetTop = 0,
}) => {
  const getHelperContent = () => {
    const helperMap: Record<string, { title: string; content: string }> = {
      email: {
        title: "Email",
        content: "",
      },
      discordUsername: {
        title: "Discord Username",
        content:
          "We will add you to the community server, which you must join, so that we can help you with your Crunch.",
      },
      projectName: {
        title: "Project Name",
        content:
          "What would be the ideal title for your Coordinator? This is the title that will be displayed on the platform once everything is official!",
      },
      goal: {
        title: "Crunch goal & domain focus",
        content: "",
      },
      evaluationMethod: {
        title: "Scoring and evaluation method",
        content: "",
      },
      dataSources: {
        title: "Data sources",
        content: "",
      },
      payoutStructure: {
        title: "Payout structure",
        content: "",
      },
      timeline: {
        title: "Execution timeline",
        content: "",
      },
      default: {
        title: "Helper",
        content: "",
      },
    };

    return helperMap[focusedField || "default"] || helperMap.default;
  };

  const helper = getHelperContent();

  return (
    <div
      className="max-lg:hidden w-3xs md:w-2xs p-8 sticky top-8 transition-margin-top duration-300 ease-in-out h-fit"
      style={{ marginTop: `${offsetTop}px` }}
    >
      <div className="space-y-3 body-sm">
        <h3 className="text-foreground">
          <InfoCircle className="inline mb-1 mr-1" /> {helper.title}
        </h3>
        <p className="text-muted-foreground">{helper.content}</p>
      </div>
    </div>
  );
};
