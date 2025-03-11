declare module '@ministryofjustice/frontend/moj/filters/all.js' {
  const mojFilters: () => Record<string, (...args: unknown[]) => unknown>
  export = mojFilters
}
