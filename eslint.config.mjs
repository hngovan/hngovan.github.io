import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import astro from 'eslint-plugin-astro'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const stripPrettierRule = config => ({
	...config,
	rules: Object.fromEntries(
		Object.entries(config.rules ?? {}).filter(
			([ruleName]) => ruleName !== 'prettier/prettier'
		)
	)
})

export default defineConfig([
	{
		ignores: [
			'.astro/**',
			'dist/**',
			'node_modules/**',
			'.wrangler/**',
			'coverage/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs['flat/recommended'].map(stripPrettierRule),
	...astro.configs['flat/jsx-a11y-recommended'].map(stripPrettierRule),
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		settings: {
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					alwaysTryTypes: true,
					project: './tsconfig.json'
				})
			]
		},
		rules: {
			'import-x/namespace': 'off',
			'import-x/no-named-as-default': 'off',
			'import-x/no-named-as-default-member': 'off',
			'import-x/no-unresolved': [
				'error',
				{
					ignore: ['^astro:', '^virtual:']
				}
			],
			'import-x/no-duplicates': 'error',
			'import-x/order': 'off',
			'no-empty': 'warn',
			'no-redeclare': 'off',
			'simple-import-sort/imports': 'warn',
			'simple-import-sort/exports': 'warn'
		}
	},
	{
		files: ['**/*.{ts,tsx}'],
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports'
				}
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		files: ['**/*.{tsx,jsx}'],
		...jsxA11y.flatConfigs.recommended,
		plugins: {
			...jsxA11y.flatConfigs.recommended.plugins,
			'react-hooks': reactHooks
		},
		rules: {
			...jsxA11y.flatConfigs.recommended.rules,
			'jsx-a11y/anchor-has-content': 'warn',
			'jsx-a11y/no-static-element-interactions': 'warn',
			'react-hooks/exhaustive-deps': 'warn',
			'react-hooks/rules-of-hooks': 'error'
		}
	},
	{
		files: ['**/*.astro', '**/*.astro/*.ts', '*.astro/*.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-expressions': 'off',
			'astro/jsx-a11y/no-redundant-roles': 'warn'
		}
	},
	{
		files: ['eslint.config.mjs', 'astro.config.ts', 'functions/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	}
])
