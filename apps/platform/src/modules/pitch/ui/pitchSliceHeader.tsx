"use client";

import {
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { Locale } from "../domain/types";

interface PitchSliceHeaderProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const PitchSliceHeader: React.FC<PitchSliceHeaderProps> = ({
  locale,
  setLocale,
}) => {
  return (
    <CardHeader>
      <div className="flex flex-1 flex-wrap justify-between items-center">
        <CardTitle>Pitch</CardTitle>
        <div className="flex gap-2">
          <Select
            value={locale}
            onValueChange={(value) => setLocale(value as Locale)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Locale.ENGLISH}>English</SelectItem>
              <SelectItem value={Locale.CHINESE}>Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <CardDescription>
        Create your pitch content to present your Crunch to potential
        participants and investors.
      </CardDescription>
    </CardHeader>
  );
};
