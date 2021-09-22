module.exports = function isDark(color) {

  color.installMethod('isDark', function () {
    var rgb = this.rgb();

    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var yiq = (rgb._red * 255 * 299 + rgb._green * 255 * 587 + rgb._blue * 255 * 114) / 1000;
    return yiq < 128;
  });
};
