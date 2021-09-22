module.exports = function isLight(color) {

  color.use(require('./isDark'));

  color.installMethod('isLight', function () {
    return !this.isDark();
  });
};
