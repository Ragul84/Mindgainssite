---
name: MindGains QuizHub
description: A calm, focused mobile-first practice experience for high-stakes Indian exam preparation.
colors:
  primary: "#0A0F0D"
  surface: "#101713"
  accent: "#7BE3B0"
  text: "#FFFFFF"
  muted: "rgba(255,255,255,.62)"
typography:
  display:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: 10px
  md: 16px
  lg: 24px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 14px
---

## Overview

QuizHub is a focused practice surface, not a marketing page. The question, answer choices, and next action take priority over decoration.

## Colors

Use the mint accent only for the primary action, progress, and concise labels. Surfaces use subtle borders instead of glow effects.

## Typography

Question prompts are clear and high contrast. Premise cards use compact but readable text; never reduce instructional copy below 13px on mobile.

## Layout

Mobile layouts use one column, a maximum of two compact footer link columns, and no horizontal overflow. Long labels truncate rather than wrap in navigation chips.

## Elevation & Depth

Use one restrained shadow for a contained panel. Do not use animated or multicolour glow shadows on controls.

## Shapes

Controls have consistent rounded corners. Pills are reserved for short status labels and compact navigation.

## Components

Statement questions show every premise as a numbered card followed by a distinct prompt. The footer provides concise navigation and legal information without becoming a second page.

## Do's and Don'ts

Do make the primary next step obvious. Do preserve source question content exactly. Don't replace answer options, rely on animated borders, or allow long tags to wrap into awkward two-line pills.
