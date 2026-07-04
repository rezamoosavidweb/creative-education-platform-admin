# Phase 0.21 Media Audit

## Scope

Implemented the backend-backed Media module from the media bounded context.

## Backend Contracts

Used generated Media endpoint functions for:

- `POST /media` authenticated media upload with visibility query.
- `GET /media/{id}` public media asset lookup.
- `DELETE /media/{id}` owner-only soft delete.
- `GET /media/{id}/raw` raw public media URL exposure through the returned
  asset DTO.

The generated contract also exposes signed stream access by URL parameters, but
the backend does not expose a signed playback URL creation endpoint in OpenAPI.
The backend does not expose a current-user media library, search, pagination,
foldering, or global moderation endpoint.

## Changes

- Added `/media` route and Learning navigation entry.
- Added upload controls for file and backend visibility.
- Added public asset lookup by backend media UUID.
- Added asset detail card with status, visibility, metadata, raw URL access,
  image preview, and owner delete action.
- Added loading, error, empty, and responsive states.
- Added unit coverage for size formatting, status tones, raw URL handling, and
  image preview detection.

## Follow-Up

If backend media listing, signed playback URL creation, moderation, or
pagination contracts are added later, extend this module from generated
contracts.
