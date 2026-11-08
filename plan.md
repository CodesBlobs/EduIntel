# Task: Redesign the HandwritingReadiness Landing Page for Immediate Assessment Engagement

You are working on the existing HandwritingReadiness web application.

Your task is to redesign and implement the landing page to prioritise immediate assessment access, reduce friction for first-time users, and improve long-term user retention.

**This is an implementation task, not a design proposal.** Inspect the existing codebase, understand its architecture, identify the relevant components and routes, and implement the changes directly.

Do not rebuild the application from scratch.

---

## 1. Core Product Objective

Transform the landing page from an informational assessment dashboard into an interactive assessment entry point.

The desired user journey is:

1. User visits the website.
2. User immediately sees the latest NAPLAN handwriting news.
3. User selects their year level.
4. User starts an assessment immediately.
5. User receives their results.
6. User is encouraged to explore further assessments, practice activities and progress tracking.

The first assessment should be accessible within approximately 10–15 seconds of arriving.

Prioritise usability over unnecessary marketing content.

## 2. Top Announcement / News Bar

Add a slim announcement bar at the absolute top of the page, above the main navigation.

Announcement content:

Label: LATEST EDUCATION NEWS

Headline:
"NSW pushes for handwritten NAPLAN writing tests from 2028."

Supporting link:
"Read the announcement →"

Source:
https://www.nsw.gov.au/ministerial-releases/new-south-wales-leads-push-for-return-to-pen-and-paper-naplan-writing-tests

Date: 1 November 2026.

Design requirements:
- Slim horizontal announcement strip.
- Muted charcoal or warm dark neutral background.
- White or near-white text.
- Small amber news indicator.
- Subtle hover interaction on the link.
- Responsive layout for mobile and desktop.
- Dismissible announcement.
- Persist dismissal appropriately so it does not reappear on every navigation.
- Ensure the text wraps gracefully on smaller screens.

IMPORTANT: The announcement concerns a government proposal requiring national agreement. Do not communicate it as an already implemented nationwide change.

Keep this announcement visually noticeable without allowing it to dominate the page.

## 3. Navigation Redesign

Retain the existing navigation structure and functionality wherever possible.

The navigation should include:

- HandwritingReadiness branding on the left.
- Test Lab
- Speed Norms
- Legibility Audit
- Methods
- Reports
- Start Test CTA on the right.

Requirements:
- Compact single-row navigation on desktop.
- Responsive mobile navigation.
- Clear active-page indicators.
- Preserve existing route destinations.
- Avoid unnecessary navigation redesign.

The Start Test action should be visually prominent.

## 4. Hero Section — Immediate Assessment

Replace the current large, research-heavy introductory hero with a compact, action-oriented hero.

Headline:

"Ready for the return to handwriting?"

Supporting text:

"Measure your handwriting speed, legibility and writing fluency with standardised assessments."

The hero must contain:

### Year-level selector

- Year 3–4
- Year 5–6
- Year 7–9

Use a clean segmented selector or similarly intuitive component.

The selected year level must influence the recommended assessment and relevant norms throughout the existing application.

### Primary CTA

"Start Your Assessment"

This must launch the actual existing assessment workflow.

Do not create a decorative button or an unrelated mock assessment.

### Assessment preview

Show:
- Recommended first assessment.
- Assessment duration.
- Brief explanation of what it measures.
- Relevant year-level information.

Allow first-time users to begin as guests without requiring account creation before their first assessment.

If authentication is required for saving results, defer that requirement until after the initial assessment.

## 5. Assessment Selection

Below the hero, retain access to all five existing standardised assessment sets.

However, redesign their presentation to prioritise the recommended first assessment.

Requirements:
- Visually distinguish the recommended assessment.
- Display duration and purpose.
- Keep other assessments accessible.
- Avoid overwhelming new users with too many equally prominent choices.
- Preserve the existing assessment functionality and data.

Do not invent new assessment protocols or alter validated assessment criteria.

## 6. First-Time and Returning-User Experiences

The landing page should adapt to the user's existing state.

### First-time visitor

Display:
- Welcome-oriented hero.
- Year-level selector.
- Recommended assessment.
- Immediate start button.
- Guest access.

### Returning user

Display:
- Welcome-back message.
- Resume unfinished assessment, if applicable.
- Recommended next assessment.
- Quick access to previous reports.
- Link to progress dashboard.

Do not force returning users to repeat onboarding.

Use the application's existing authentication and persistence mechanisms.

## 7. Visual Design Direction

Preserve the existing visual identity.

The design should feel like a polished combination of Notion, Apple and ChatGPT.

Use:
- Warm off-white or neutral backgrounds.
- Subtle hairline borders.
- Soft, restrained shadows.
- Consistent rounded corners.
- Clean typography.
- Generous but controlled spacing.
- Subtle hover and transition animations.
- Restrained accent colours.

Avoid:
- Generic AI-generated landing page aesthetics.
- Excessive gradients.
- Neon colours.
- Heavy glassmorphism.
- Oversized marketing headlines.
- Unnecessary decorative illustrations.
- Excessive card nesting.
- Excessive vertical whitespace.

The interface should feel professional, calm, educational and trustworthy.

## 8. Technical Implementation Requirements

Before making changes:

1. Inspect the existing project structure.
2. Identify the frontend framework and styling system.
3. Identify existing navigation components.
4. Locate the five assessment implementations.
5. Understand existing authentication and session persistence.
6. Identify how year-level selection currently works.
7. Reuse existing components and utilities wherever possible.

Implementation rules:

- Do not replace the existing application architecture.
- Do not introduce unnecessary dependencies.
- Do not duplicate existing assessment logic.
- Do not break existing routes.
- Do not replace functional components with static mockups.
- Preserve existing data structures and backend integrations.
- Keep components modular and maintainable.
- Use the existing design system and component conventions.
- Ensure accessibility, keyboard navigation and responsive behaviour.
- Do not hardcode fake user results or progress data.

## 9. Responsive Design

Ensure the redesigned experience works across:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

On mobile:
- Stack the hero elements appropriately.
- Keep the assessment CTA immediately visible.
- Ensure the year-level selector remains usable.
- Prevent announcement text from overflowing.
- Collapse navigation into an appropriate mobile menu.

## 10. Validation and Testing

After implementation:

- Verify the news announcement link.
- Verify announcement dismissal persistence.
- Test all year-level selections.
- Verify that Start Assessment launches the correct existing workflow.
- Verify all five assessment sets remain functional.
- Test guest access.
- Test returning-user behaviour.
- Verify existing navigation routes.
- Check for TypeScript errors.
- Check for broken layouts at different screen sizes.
- Ensure no existing application functionality has regressed.

## 11. Implementation Priority

Follow this order:

P0:
- News announcement bar.
- Compact navigation.
- Redesigned action-oriented hero.
- Functional year-level selector.
- Immediate assessment launch.

P1:
- Recommended assessment presentation.
- First-time versus returning-user states.
- Guest assessment flow.

P2:
- Additional visual refinements.
- Improved mobile interactions.
- Subtle animations and transitions.

---

## Final Instruction

Work directly within the existing codebase.

First understand the existing implementation, then make the changes.

Do not simply return a plan, a Figma mockup or code snippets. Actually implement the redesigned landing page.

Preserve the existing product functionality and visual identity while making the experience significantly faster to use.

The finished result should make the first assessment the obvious next action for every new visitor.
