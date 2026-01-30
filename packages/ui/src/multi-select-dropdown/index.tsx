import { useState, useMemo, useCallback } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { ChevronDown } from "@crunch-ui/icons";

export interface MultiSelectDropdownProps<T> {
  items: T[];
  values: T[];
  onValuesChange: (values: T[]) => void;
  triggerLabel?: string;

  getItemKey: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
}

function MultiSelectDropdown<T>({
  items,
  values,
  onValuesChange,
  triggerLabel = "Items",
  getItemKey,
  getItemLabel,
  renderItem,
}: MultiSelectDropdownProps<T>) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      getItemLabel(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, getItemLabel]);

  const isItemSelected = useCallback(
    (item: T) =>
      values.some((selected) => getItemKey(selected) === getItemKey(item)),
    [values, getItemKey]
  );

  const toggleItem = useCallback(
    (item: T) => {
      const key = getItemKey(item);
      const isSelected = isItemSelected(item);

      if (isSelected) {
        onValuesChange(
          values.filter((selected) => getItemKey(selected) !== key)
        );
      } else {
        onValuesChange([...values, item]);
      }
    },
    [values, onValuesChange, getItemKey, isItemSelected]
  );

  const displayedCount = values.length
    ? `${values.length}/${items.length}`
    : items.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerLabel} ({displayedCount}) <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-fit max-w-xs max-h-96 overflow-auto p-3 gap-2 grid"
        side="bottom"
        align="end"
      >
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            No items available
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between relative">
              <Button
                className="flex-1 rounded-r-none -mr-px"
                variant="outline"
                size="sm"
                onClick={() => onValuesChange([])}
              >
                Hide all
              </Button>
              <Button
                className="flex-1 rounded-l-none"
                variant="outline"
                size="sm"
                onClick={() => onValuesChange([...items])}
              >
                Display all
              </Button>
            </div>
            <div className={cn(search?.length && "sticky top-0")}>
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                clearable
              />
            </div>
            {filteredItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No matching items
              </p>
            ) : (
              filteredItems.map((item) => {
                const isSelected = isItemSelected(item);

                return (
                  <div
                    key={getItemKey(item)}
                    className="group flex items-center gap-0 text-sm"
                  >
                    {renderItem ? (
                      <div className="flex-1">
                        {renderItem(item, isSelected)}
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleItem(item)}
                        className={cn(
                          "flex-1 flex items-center text-left",
                          isSelected ? "opacity-100" : "opacity-50"
                        )}
                      >
                        <span className={cn("flex-1")}>
                          {getItemLabel(item)}
                        </span>
                      </button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="invisible group-hover:visible text-xs py-0 px-1"
                      onClick={() => onValuesChange([item])}
                    >
                      Only
                    </Button>
                  </div>
                );
              })
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelectDropdown;
