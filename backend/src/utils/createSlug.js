/**
 * Creates a URL-friendly slug from a given text.
 *
 * The function:
 * - Converts the text to lowercase.
 * - Removes leading and trailing spaces.
 * - Removes special characters.
 * - Replaces spaces with hyphens (-).
 * - Replaces multiple consecutive hyphens with a single hyphen.
 *
 * Example:
 * "My First Project!" -> "my-first-project"
 *
 * @param {string} text - The input text to convert into a slug.
 * @returns {string} A URL-friendly slug.
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

module.exports = createSlug;