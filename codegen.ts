import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * Generates TypeScript types for every `.graphql` document from the Contentful
 * schema. Nothing in the app hand-writes a response interface.
 *
 * By default this runs against the checked-in schema snapshot, so codegen works
 * with no credentials and CI stays hermetic. Set `CONTENTFUL_SCHEMA_FROM_API=1`
 * (with real tokens) to introspect the live endpoint instead — the resulting
 * diff is the drift report between the snapshot and the actual space.
 */

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT = 'master',
  CONTENTFUL_DELIVERY_TOKEN,
  CONTENTFUL_SCHEMA_FROM_API,
} = process.env

const LOCAL_SCHEMA = 'src/lib/contentful/schema.graphql'

function resolveSchema(): NonNullable<CodegenConfig['schema']> {
  if (CONTENTFUL_SCHEMA_FROM_API !== '1') return LOCAL_SCHEMA

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_DELIVERY_TOKEN) {
    throw new Error(
      'CONTENTFUL_SCHEMA_FROM_API=1 needs CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN.',
    )
  }

  return [
    {
      [`https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`]:
        { headers: { Authorization: `Bearer ${CONTENTFUL_DELIVERY_TOKEN}` } },
    },
  ]
}

const config: CodegenConfig = {
  schema: resolveSchema(),
  documents: ['src/lib/contentful/documents/**/*.graphql'],
  ignoreNoDocuments: false,
  generates: {
    'src/lib/contentful/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        // Contentful returns `items: [Plant]!` — nullable members in a non-null
        // list. Modelling that faithfully is what forces the app to handle an
        // unpublished or partially-filled entry instead of assuming it away.
        avoidOptionals: { field: true, inputValue: false, object: false },
        maybeValue: 'T | null',
        scalars: {
          DateTime: 'string',
          Dimension: 'number',
          HexColor: 'string',
          JSON: 'unknown',
          Quality: 'number',
        },
        // Emits each operation as a `TypedDocumentString` — a plain string that
        // carries its result and variable types. That means the runtime needs no
        // GraphQL client at all: `fetch` sends the string, and the response is
        // typed end to end.
        documentMode: 'string',
        skipTypename: false,
        enumsAsTypes: true,
        useTypeImports: true,
        dedupeOperationSuffix: true,
        immutableTypes: false,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
