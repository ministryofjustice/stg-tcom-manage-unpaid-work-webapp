# 0002. Use simpler hosting

Date: 2022-0X-XX

## Status

Proposed

## Agreed by

-
-

## Context

We need to release to the research perticipants before there is a service name and custom domain agreed. Due to the need for a custom domain (and a host domain less than 64 characters) to use the helm deploy method it is impractical to use this without a custom domain.

## Decision

We will implement a simpler deployment approach, creating a namespace and matching deployment files and pipeline to match the pattern for example application in Cloud Platform.
We have already experimented with this approach and been successful with an example project: [namespace](https://github.com/ministryofjustice/cloud-platform-environments/pull/29933) and [deployment](https://github.com/ministryofjustice/stg-cloud-platform-example-app)

## Consequences

1. Hosting will have to be reimplemented once a custom domain name is selected and configured
1. There is a risk that other hosting issues will be discovered later
1. Non functional requirements including monitoring and elastic search / redis for sessions will not be supported out of the box
1. It will be more difficult to support research session issues and troubleshoot if something goes wrong
