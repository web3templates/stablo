module.exports = function contrast(color) {
  // http://www.w3.org/TR/WCAG20/#contrast-ratiodef

  color.use(require('./luminance'));

  color.installMethod('contrast', function (color2) {
    var lum1 = this.luminance();
    var lum2 = color2.luminance();
    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }

    return (lum2 + 0.05) / (lum1 + 0.05);
  });
};
