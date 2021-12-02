module.exports = {
  root: true,
  extends: '@clark',
  overrides: [
    {
      files: '.eslintrc.cjs',
      extends: '@clark/node'
    },
    {
      files: '*.ts',
      extends: '@clark/typescript'
    }
  ]
};
