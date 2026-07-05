# Phase 0.26 Learning Administration

## Summary

The Courses page was expanded from the initial authored-course slice into the
backend-supported learning workspace: course detail authoring, localization,
FAQs, section and lesson management, enrollment progress tools, playback lookup,
and certificate listing/verification.

## Implemented Capabilities

- Authored-course builder dialog backed by `GET /courses/{id}` and generated
  course authoring mutations.
- Course metadata editing for title, description, price, requirements,
  audiences, and outcomes.
- Localization upsert for backend-supported language codes and release states.
- FAQ replacement with validated JSON input mapped to the backend DTO shape.
- Section creation and deletion.
- Lesson creation, deletion, preview toggling, and media-list clearing for
  attachments and captions.
- Published-catalog learning panel with enrollment, progress lookup, lesson
  completion, playback-position saving, and playback URL retrieval.
- Certificate panel for current-user certificates and public certificate
  verification.

## Decisions

- Kept learning workflows inside the existing Courses route because course
  authoring, learner progress, and certificates are tightly coupled in the
  backend learning module.
- Wrapped generated learning request functions in feature hooks so query keys,
  invalidation, loading states, and error handling stay consistent with the
  existing Admin architecture.
- Centralized local normalization for generated nested learning arrays because
  the backend returns arrays while the generated schema currently types several
  nested fields as singular DTOs.

## Backend Limitations

- No global course moderation, global enrollment listing, certificate
  revocation, certificate issuance, lesson search, bulk lesson reordering, or
  media picker endpoints are exposed.
- Lesson attachments and captions can be replaced, but the current Admin UI only
  clears those lists because there is no media-library selection workflow yet.
- Catalog and authored-course list pagination/search/filtering remain limited by
  the currently exposed list contracts.

## Verification Notes

- `npm.cmd run generate:api`
- `npm.cmd run validate:api`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run knip`
- `npm.cmd run format:check`
- `npm.cmd run test` with
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- `npm.cmd run build`
- Courses runtime smoke on the production build completed without console errors
  or failed network requests; unauthenticated routing redirected `/courses` to
  `/sign-in?redirect=%2Fcourses` with HTTP 200.
