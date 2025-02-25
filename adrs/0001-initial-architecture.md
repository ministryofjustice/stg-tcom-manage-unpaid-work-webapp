# 1. Initial architecture for prototype UR phase

Date: 2025-02-25

## Status

Accepted

## Agreed by

- Angus Montgomery
- Ben Pirt
- Tess Barnes
- Geoff Ofori

## Context

We are expecting to develop the first phase of a prototype to support user research into management of unpaid work.
This should be hosted where participants can access it.
Participants can be staff members or members of the public involved in unpaid work or supervision.

Any website should not be generally available to the public to avoid confusion with real services.

## Decision

We will use the standard MoJ front end stack = Nunjucks, typescript and express, server-side rendered and MOJ design libraries for consistent styling to reduce handover friction and support future phases.

Auth: we will start with a basic site lock auth and bring in standard authentication approaches when needed.

GitHub: use feature branches merged into default branch (main) and deploy to public environment on releases

Main will be protected by peer review process

All write access and pushes to repo will be protected by github teams membership

ESlint and tests will be run on every PR

Regular and automated dependency checking will be in place

Cloud platform hosting will be adopted

CI/CD will be enabled to public site via automated pipelines

## Consequences

1. Engineering team members will manage the hosting and infrastructure with MOJ tooling and devops expertise
2. Shared email boxes and slack channels will be set up to handle expected communication with platform tooling
3. Authentication in hosted environments for future phases will need to be added later
