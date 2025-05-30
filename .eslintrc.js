module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		// tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', '@stylistic'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js', 'dist/**/*'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true, 'varsIgnorePattern': '^_' }],
		// '@typescript-eslint/interface-name-prefix': 'off',
		// '@typescript-eslint/explicit-function-return-type': 'off',
		// '@typescript-eslint/explicit-module-boundary-types': 'off',
		
		'@stylistic/indent': ['error', 'tab'],
		'@stylistic/comma-spacing': 'error',
		'@stylistic/comma-dangle': 'error',
		'@stylistic/space-before-blocks': 'error',
		'@stylistic/comma-spacing': 'error',
		'@stylistic/quotes': ['error', 'single'],
		'@stylistic/semi': 'error',
		'@stylistic/semi-spacing': ['error', { before: false, after: false }],
		'@stylistic/block-spacing': 'error',
		'@stylistic/no-whitespace-before-property': 'error',
		'@stylistic/keyword-spacing': ['error', { before: true }],
		'@stylistic/object-curly-spacing': ['error', 'always'],
		'@stylistic/array-bracket-spacing': ['error', 'always'],
		'@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
		'@stylistic/no-trailing-spaces': 'error',
		'@stylistic/no-multi-spaces': 'error',
	},
	overrides: [
		{
			files: ['**/*.spec.ts', '**/*.test.ts'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off'
			}
		}
	]
};
