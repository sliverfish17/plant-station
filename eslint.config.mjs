import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'design/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      'src/lib/contentful/generated/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // Only the .mjs build tooling sits outside the tsconfig program;
          // the .config.ts files are already in it.
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      /**
       * "Zero casts used to silence errors" — but `as const` is not that cast.
       * `consistent-type-assertions: never` cannot tell the two apart, so the
       * ban is expressed structurally instead: every `as` is an error except a
       * const assertion, and angle-bracket assertions are gone entirely.
       */
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression:not([typeAnnotation.typeName.name="const"])',
          message:
            'Type assertions are banned. Narrow with a type guard, a discriminated union, or a Zod schema instead.',
        },
        {
          selector: 'TSTypeAssertion',
          message: 'Angle-bracket type assertions are banned.',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Discriminated unions are the project's modelling primitive; `interface`
      // cannot express them, so type aliases are the house style throughout.
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // Framework config files are declarative and are not part of the app graph.
  {
    files: ['*.config.{ts,mjs}', 'codegen.ts'],
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // Tests reach into internals and assert shapes the strictest rules resist.
  {
    files: ['**/*.test.{ts,tsx}', 'e2e/**/*.ts', 'vitest.setup.ts'],
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'no-restricted-syntax': 'off',
    },
  },
)
