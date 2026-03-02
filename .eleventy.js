module.exports = function (eleventyConfig) {
  // ── Passthrough copies ──────────────────────────────────────────────────────
  // Images live at the project root (not inside src/)
  eleventyConfig.addPassthroughCopy({ images: "images" });
  // CSS + JS assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // ── Collections ─────────────────────────────────────────────────────────────
  eleventyConfig.addCollection("sermons", function (collection) {
    return collection
      .getFilteredByGlob("src/sermons/*.md")
      .sort((a, b) => b.date - a.date); // newest first
  });

  // ── Filters ─────────────────────────────────────────────────────────────────

  // Format a date for display: "January 14, 2024"
  eleventyConfig.addFilter("dateFormat", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  // Group an array of collection items by a data key (e.g. "series")
  eleventyConfig.addFilter("groupByKey", function (arr, key) {
    const groups = new Map();
    (arr || []).forEach((item) => {
      const val = (item.data && item.data[key]) || "Uncategorized";
      if (!groups.has(val)) groups.set(val, []);
      groups.get(val).push(item);
    });
    return Array.from(groups.entries()).map(([name, items]) => ({
      name,
      items,
    }));
  });

  // Mark a nav link as active when its href matches the current page URL
  eleventyConfig.addFilter("activeIf", function (currentUrl, linkHref) {
    if (linkHref === "/") return currentUrl === "/" ? "active" : "";
    return currentUrl && currentUrl.startsWith(linkHref) ? "active" : "";
  });

  // ── Eleventy config ─────────────────────────────────────────────────────────
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
