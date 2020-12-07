# Rebrandly cleanup

### Install

Install using this command

```bash
npm i rebrandly-cleanup
```

### Usage

cleanupOldLinks accepts a rebrandly api key and either daysAgo or a custom filter as params.

daysAgo: If this is provided, any links created before X days ago will be deleted. This will delete daysAgo at the current time it is run, not the beginning of the day.

customFilter: a custom filter function for links to delete (this function can be asynchronous).

```js
const { cleanupOldLinks } = require("rebrandly-cleanup");

(async function() {
  // Delete links made before 2 days ago
  const linksOlderThanTwoDays = await cleanupOldLinks(REBRANDLY_API_KEY, 2); // returns links that were deleted

  // Use a custom filter (can be async)
  const customFilteredLinks = await cleanupOldLinks(REBRANDLY_API_KEY, null, customFilterFunction);
})()
```
