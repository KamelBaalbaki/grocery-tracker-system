module.exports = (items) =>
  items
    .map(i => i.toLowerCase().trim())
    .filter(Boolean);
