# DayHug synthetic prototype

DayHug demonstrates source review, caregiver assignment and explicit completion using fictional childcare notices. This source package is a review candidate, not a production service or a claim of hackathon eligibility.

## Run locally

Use Node.js 24 or later. No external npm dependencies are required.

    npm test
    npm start

Open http://127.0.0.1:3000. The local server listens on loopback only and creates its synthetic SQLite data under .local/. Do not expose this development server to the internet. Its A/B login is a test mechanism, not production authentication.

Alternatively, open dist/harupoom-offline.html in a modern browser. Browser storage and device speech depend on the browser. Reload clears source-extraction review data, but other prototype sections may retain browser-local records.

Rebuild the offline HTML after editing source:

    node scripts/build-visual.mjs

## Implemented scope

- Synthetic notices, fixed example revisions, source quotations and explicit review.
- Separate purchase and packing records; caregiver proposals, acceptance and confirmation.
- Child-day source extraction using local keyword rules. Matching source lines are preserved literally; the parent verifies each line before a same-tab caregiver B preview.
- Meal and fridge inputs with a fixed recipe library and rule-based suggestions. This does not establish nutritional adequacy or allergy safety.
- Local development server tests and same-browser role demonstrations.

## Not implemented

This build makes no live Meta call and has no real childcare-app ingestion, authenticated family account sharing, cross-device synchronization, payment execution, medical verification, or automated child diagnosis. The caregiver B preview sends nothing. A separate model Playground experiment is not an integration in this source.

Use fictional data only. Do not enter actual child names, health records, credentials or payment information. Do not describe a keyword classification as model reasoning.

## Demo cautions

The full-flow walkthrough automatically creates synthetic completion records as it advances. Use manual task controls when demonstrating a parent making a decision. Packing drag and checkbox actions directly record completion; they are not merely a temporary placement animation. The task screen supports a separate confirmation dialog.

## Verification

This repaired review candidate passes 70 of 72 Node tests, with zero failures and two pre-existing skips (real push delivery and expanded DST coverage). The added HTTP regression test launches the documented start target in an isolated temporary copy and verifies the entry page, stylesheet, imported modules, offline HTML download and rejection of private or unknown file paths. A separate actual `npm start` probe also verified these routes on Node.js v24.22.1.

The repair adds the missing local server routes for meal-core.mjs and harupoom-offline.html. Browser source and the generated offline HTML are unchanged. The new regression fails on an isolated copy of the previous candidate at both missing routes.

These checks include DOM stubs and do not certify production browser rendering, actual audio, clinical safety or real family authentication. No interactive browser QA was performed for this repair. See TEST_RESULTS.txt for this package's full test run.

## Source and licensing review

This candidate is derived from source revision 51bd78bc79a54da3d672b2734748d7affea51631. Deployment metadata, git history, internal handoff documents, local databases and nested source archives are excluded. The earlier review package removed private deployment links or made them relative and regenerated the offline build. This review copy adds only the local server route repair, its regression test and updated verification documentation; it is not byte-identical to the original revision.

The owner must confirm rights to publish the source and assets, choose any intended license, and verify competition reuse and eligibility rules before publication. No license grant is implied by this package. No remote repository has been created or pushed.
