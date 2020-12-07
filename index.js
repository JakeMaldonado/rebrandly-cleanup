const axios = require("axios");

module.exports = {
  cleanupOldLinks,
};

async function cleanupOldLinks(
  REBRANDLY_API_KEY,
  daysAgo = null,
  customFilter = null
) {
  if (!daysAgo && !customFilter) {
    throw "Must provide daysAgo or customFilter";
  }

  // get all links
  let links = await getAllLinks(REBRANDLY_API_KEY);
  console.log(links.length);

  let linksToDelete;
  if (customFilter) {
    linksToDelete = await customFilter(links);
  } else {
    linksToDelete = dateFilter(links, daysAgo);
  }

  // return deleted links
  for (let i = 0; i < linksToDelete.length; i++) {
    link = linksToDelete[i];
    await deleteLink(link, REBRANDLY_API_KEY);
  }

  return linksToDelete;
}

async function getAllLinks(REBRANDLY_API_KEY) {
  let moreLinks = true;

  let response = await axios({
    method: "get",
    url: "https://api.rebrandly.com/v1/links",
    headers: {
      "Content-Type": "application/json",
      apikey: REBRANDLY_API_KEY,
    },
  });

  const links = response.data;
  let lastLink = links[links.length - 1];

  while (moreLinks) {
    response = await axios({
      method: "get",
      url: `https://api.rebrandly.com/v1/links?last=${lastLink.id}`,
      headers: {
        "Content-Type": "application/json",
        apikey: REBRANDLY_API_KEY,
      },
    });

    links.push(...response.data);

    if (lastLink.id === links[links.length - 1].id) {
      moreLinks = false;
    } else {
      lastLink = links[links.length - 1];
    }
  }

  return links;
}

function dateFilter(links, daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);

  const toDelete = [];

  for (let i = 0; i < links.length; i++) {
    link = links[i];
    const createdAtDate = new Date(link.createdAt);
    if (createdAtDate < d) {
      toDelete.push(link);
    }
  }

  return toDelete;
}

async function deleteLink(link, REBRANDLY_API_KEY) {
  response = await axios({
    method: "delete",
    url: `https://api.rebrandly.com/v1/links/${link.id}`,
    headers: {
      "Content-Type": "application/json",
      apikey: REBRANDLY_API_KEY,
    },
  });
}
