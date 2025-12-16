"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Badge,
} from "@crunch-ui/core";
import { Settings } from "@crunch-ui/icons";
import { useGetModels } from "../application/hooks/useGetModels";
import { AddModelSheet } from "./addModelSheet";

export const ModelSettingsTable: React.FC = () => {
  const { models } = useGetModels();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="model-settings"
        className="border rounded-lg shadow-sm"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Models Configuration</h2>
              <Badge size="sm" variant="secondary" className="ml-2">
                {models?.length || 0} Models
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-6 pb-6 pt-2">
            <div className="flex justify-end">
              <AddModelSheet />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
