"use client";

import { createReactInlineContentSpec } from "@blocknote/react";

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      // @ts-ignore @typescript-eslint/ban-ts-comment
      <span style={{ backgroundColor: "#73b9a1" }}>
        @{props.inlineContent.props.user}
      </span>
    ),
  }
);
