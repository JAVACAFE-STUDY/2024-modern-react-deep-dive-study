const path = require('path');

const createConfig = require('@titicaca/eslint-config-triple');

const { extends: extendConfigs, overrides } = createConfig({
  type: 'frontend',
  project: path.resolve(__dirname, './tsconfig.json'),
});

module.exports = {
  extends: [...extendConfigs, 'next/core-web-vitals'], 
  overrides,
}
