"use client";
import {
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { Widget, LineChartDefinition, GetMetricDataParams } from "../domain/types";
import { useMetricData } from "../application/hooks/useMetricData";
import { LineChart } from "@/modules/chart/ui/lineChart";
import { IframeWidget } from "./iframeWidget";

interface MetricWidgetProps {
  widget: Widget;
  params: GetMetricDataParams;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({ widget, params }) => {
  const { data, isLoading, error } = useMetricData(
    widget.endpointUrl,
    widget.id,
    params
  );

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h3>{widget.displayName}</h3>
          {widget.tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <InfoCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{widget.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[400px] text-destructive">
            <p>Failed to load data</p>
          </div>
        ) : widget.type === "CHART" && data ? (
          <LineChart
            data={data}
            definition={widget as LineChartDefinition}
            displayName={widget.displayName}
            projectIdProperty="model_id"
          />
        ) : widget.type === "IFRAME" ? (
          <IframeWidget
            displayName={widget.displayName}
            url={widget.endpointUrl}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
