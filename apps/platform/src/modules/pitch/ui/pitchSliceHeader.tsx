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
import { Season } from "@/modules/season/domain/types";

interface PitchSliceHeaderProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  seasons: Season[];
  selectedSeasonNumber: number | undefined;
  onSeasonChange: (seasonNumber: number) => void;
}

export const PitchSliceHeader: React.FC<PitchSliceHeaderProps> = ({
  locale,
  setLocale,
  seasons,
  selectedSeasonNumber,
  onSeasonChange,
}) => {
  return (
    <CardHeader>
      <div className="flex flex-1 flex-wrap justify-between items-center">
        <CardTitle>Pitch</CardTitle>
        <div className="flex gap-2">
          <Select
            value={selectedSeasonNumber ? String(selectedSeasonNumber) : ""}
            onValueChange={(value) => onSeasonChange(Number(value))}
            disabled={!seasons.length}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.number} value={String(season.number)}>
                  {season.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        Create your pitch to present your Crunch to potential participants and
        stakers.
      </CardDescription>
    </CardHeader>
  );
};
