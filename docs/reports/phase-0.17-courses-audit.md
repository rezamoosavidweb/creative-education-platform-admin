# Phase 0.17 Courses Audit

## Scope

Implemented the first backend-backed Courses Admin surface from the Learning
contracts.

## Backend Contracts

Used the existing `/courses` contracts:

- `GET /courses` for the published catalog.
- `GET /courses/mine` for the current user's authored courses.
- `POST /courses` to create a draft course.
- `POST /courses/{id}/publish` for owner-only publish.
- `POST /courses/{id}/unpublish` for owner-only unpublish.
- `POST /courses/{id}/archive` for owner-only archive.

The backend does not expose a global course moderation queue. The Admin UI
therefore presents Courses as current-user authoring and catalog visibility,
not global platform course administration.

## Changes

- Added `/courses` route and sidebar entry under Learning.
- Added authored and catalog tabs with loading, error, empty, and table states.
- Added a draft-course creation dialog using backend validation constraints for
  title, description, and generated language values.
- Added lifecycle actions for publish, unpublish, and archive.
- Added focused unit coverage for course formatting, status tones, and taxonomy
  counting.

## Follow-Up

Course section, lesson, localization, FAQ, attachment, caption, enrollment,
playback, and certificate workflows remain backend-supported but are separate
feature slices. They should be implemented from the generated contracts rather
than folded into the initial course list/lifecycle surface.
