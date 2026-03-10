import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { WidgetFormData } from "../application/schemas/widgetFormSchema";
import { FilterConfigEditor } from "./filterConfigEditor";

interface MatrixFieldsProps {
  form: UseFormReturn<WidgetFormData>;
}

export const MatrixFields: React.FC<MatrixFieldsProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "matrixSections",
  });

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Matrix Configuration</h3>

      <FormField
        control={form.control}
        name="scopeProperty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Scope Property
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  The data field used to group rows by scope
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., scope" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Sections</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                title: "",
                scopeFilter: "",
                rowProperty: "",
                columnProperty: "",
                displayValues: [{ property: "", format: "", label: "" }],
                tooltipValues: [],
              })
            }
          >
            Add Section
          </Button>
        </div>

        {fields.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="space-y-3 border rounded-md p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Section {sectionIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(sectionIndex)}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name={`matrixSections.${sectionIndex}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Section title" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`matrixSections.${sectionIndex}.scopeFilter`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope Filter</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., overall" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`matrixSections.${sectionIndex}.rowProperty`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Row Property</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., horizon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`matrixSections.${sectionIndex}.columnProperty`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Column Property</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., asset" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <MatrixDisplayValues
              form={form}
              sectionIndex={sectionIndex}
            />
          </div>
        ))}
      </div>

      <FormField
        control={form.control}
        name="noDataMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No Data Message</FormLabel>
            <FormControl>
              <Input {...field} placeholder="No data available" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 border-t pt-4">
        <FilterConfigEditor form={form} />
      </div>
    </div>
  );
};

function MatrixDisplayValues({
  form,
  sectionIndex,
}: {
  form: UseFormReturn<WidgetFormData>;
  sectionIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `matrixSections.${sectionIndex}.displayValues`,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Display Values</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ property: "", format: "", label: "" })}
        >
          Add Value
        </Button>
      </div>
      {fields.map((field, valueIndex) => (
        <div key={field.id} className="flex items-end gap-2">
          <FormField
            control={form.control}
            name={`matrixSections.${sectionIndex}.displayValues.${valueIndex}.property`}
            render={({ field }) => (
              <FormItem className="flex-1">
                {valueIndex === 0 && <FormLabel>Property</FormLabel>}
                <FormControl>
                  <Input {...field} placeholder="e.g., rank" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`matrixSections.${sectionIndex}.displayValues.${valueIndex}.format`}
            render={({ field }) => (
              <FormItem className="flex-1">
                {valueIndex === 0 && <FormLabel>Format</FormLabel>}
                <FormControl>
                  <Input {...field} placeholder="e.g., integer" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`matrixSections.${sectionIndex}.displayValues.${valueIndex}.label`}
            render={({ field }) => (
              <FormItem className="flex-1">
                {valueIndex === 0 && <FormLabel>Label</FormLabel>}
                <FormControl>
                  <Input {...field} placeholder="Optional label" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(valueIndex)}
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
}
