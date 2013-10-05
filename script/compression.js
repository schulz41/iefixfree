var compressCSS = function (code) {
  return code.replace(/\n/g, '')
    .replace(/\s{1,}/g, ' ')
    .replace(/,\s/g, ',')
    .replace(/\s\{/g, '{')
    .replace(/\s\}/g, '}')
    .replace(/\{\s/g, '{')
    .replace(/\}\s/g, '}')
    .replace(/\:\s/g, ':');
};
