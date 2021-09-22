module.exports = function luminance(color) {
  // http://www.w3.org/TR/WCAG20/#relativeluminancedef

  function channelLuminance(value) {
    return (value <= 0.03928) ? value / 12.92 : Math.pow(((value + 0.055) / 1.055), 2.4);
  }

  color.installMethod('luminance', function () {
    var rgb = this.rgb();
    return 0.2126 * channelLuminance(rgb._red) + 0.7152 * channelLuminance(rgb._green) + 0.0722 * channelLuminance(rgb._blue);
  });
};
