import React, { useState } from "react";
import z from "zod";
import Link from "next/link";
import { LinkedIn, World, X } from "@crunch-ui/icons";
import { MdPreview } from "@coordinator/ui/src/md-editor";
import { teamSliceSchema } from "../../application/schemas/pitch";

interface TeamProps {
  slice: z.infer<typeof teamSliceSchema>;
}

const MAX_CHARACTERS = 135;

export const Team: React.FC<TeamProps> = ({ slice }) => {
  const [expandedMembers, setExpandedMembers] = useState<
    Record<number, boolean>
  >({});

  const validationResult = teamSliceSchema.safeParse(slice);

  if (!validationResult.success) {
    console.error("Invalid team slice data:", validationResult.error);
    return null;
  }

  const validatedSlice = validationResult.data;
  const members = validatedSlice.nativeConfiguration.members;

  const toggleExpanded = (index: number) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateDescription = (description: string) => {
    if (description.length <= MAX_CHARACTERS) return description;
    return description.substring(0, MAX_CHARACTERS) + "...";
  };

  return (
    <div className="w-full">
      {validatedSlice.displayName && (
        <h2 className="body font-medium mb-6">{validatedSlice.displayName}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
        {members.map((member, index) => {
          const isExpanded = expandedMembers[index] || false;
          const shouldTruncate =
            member.descriptionMarkdown &&
            member.descriptionMarkdown.length > MAX_CHARACTERS;

          return (
            <div key={index} className="">
              <div className="flex flex-col text-left">
                {member.avatarImageUrl && (
                  <div className="relative w-12 h-12 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.avatarImageUrl}
                      alt={member.fullName}
                      className="rounded-md object-cover absolute w-full"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="body-sm font-medium">{member.fullName}</h3>
                  <div className="flex gap-3 mt-auto">
                    {member.twitterUrl && (
                      <Link
                        href={member.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <X />
                      </Link>
                    )}
                    {member.linkedinUrl && (
                      <Link
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedIn />
                      </Link>
                    )}
                    {member.websiteUrl && (
                      <Link
                        href={member.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <World />
                      </Link>
                    )}
                  </div>
                </div>
                {member.descriptionMarkdown && (
                  <div className="text-muted-foreground [&_h1,&_h2,&_h3]:text-card-foreground [&_h1]:body-lg [&_h2,&_h3]:body">
                    <MdPreview
                      value={
                        shouldTruncate && !isExpanded
                          ? truncateDescription(member.descriptionMarkdown)
                          : member.descriptionMarkdown
                      }
                    />
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="underline body-sm"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
