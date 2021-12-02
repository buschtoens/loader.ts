module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  overrides: [
    {
      files: '.eslintrc.cjs',
      "env": {
        "browser": false,
        "node": true
      }
    },
    {
      files: '*.ts',
      "env": {
        "browser": true,
        "node": false
      }
    }
  ]
};
