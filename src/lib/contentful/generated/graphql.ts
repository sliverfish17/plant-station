import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Dimension: { input: number; output: number; }
  HexColor: { input: string; output: string; }
  JSON: { input: unknown; output: unknown; }
  Quality: { input: number; output: number; }
};

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = _Node & {
  __typename?: 'Asset';
  _id: Scalars['ID']['output'];
  contentType: Maybe<Scalars['String']['output']>;
  contentfulMetadata: ContentfulMetadata;
  description: Maybe<Scalars['String']['output']>;
  fileName: Maybe<Scalars['String']['output']>;
  height: Maybe<Scalars['Int']['output']>;
  linkedFrom: Maybe<AssetLinkingCollections>;
  size: Maybe<Scalars['Int']['output']>;
  sys: Sys;
  title: Maybe<Scalars['String']['output']>;
  url: Maybe<Scalars['String']['output']>;
  width: Maybe<Scalars['Int']['output']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetContentTypeArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetFileNameArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetHeightArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetSizeArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetTitleArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  transform?: InputMaybe<ImageTransformOptions>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetWidthArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AssetCollection = {
  __typename?: 'AssetCollection';
  items: Array<Maybe<Asset>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AssetCursorCollection = {
  __typename?: 'AssetCursorCollection';
  items: Array<Maybe<Asset>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type AssetFilter = {
  AND?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  contentType?: InputMaybe<Scalars['String']['input']>;
  contentType_contains?: InputMaybe<Scalars['String']['input']>;
  contentType_exists?: InputMaybe<Scalars['Boolean']['input']>;
  contentType_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contentType_not?: InputMaybe<Scalars['String']['input']>;
  contentType_not_contains?: InputMaybe<Scalars['String']['input']>;
  contentType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  fileName_contains?: InputMaybe<Scalars['String']['input']>;
  fileName_exists?: InputMaybe<Scalars['Boolean']['input']>;
  fileName_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fileName_not?: InputMaybe<Scalars['String']['input']>;
  fileName_not_contains?: InputMaybe<Scalars['String']['input']>;
  fileName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  height?: InputMaybe<Scalars['Int']['input']>;
  height_exists?: InputMaybe<Scalars['Boolean']['input']>;
  height_gt?: InputMaybe<Scalars['Int']['input']>;
  height_gte?: InputMaybe<Scalars['Int']['input']>;
  height_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  height_lt?: InputMaybe<Scalars['Int']['input']>;
  height_lte?: InputMaybe<Scalars['Int']['input']>;
  height_not?: InputMaybe<Scalars['Int']['input']>;
  height_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  size?: InputMaybe<Scalars['Int']['input']>;
  size_exists?: InputMaybe<Scalars['Boolean']['input']>;
  size_gt?: InputMaybe<Scalars['Int']['input']>;
  size_gte?: InputMaybe<Scalars['Int']['input']>;
  size_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  size_lt?: InputMaybe<Scalars['Int']['input']>;
  size_lte?: InputMaybe<Scalars['Int']['input']>;
  size_not?: InputMaybe<Scalars['Int']['input']>;
  size_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_not?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_contains?: InputMaybe<Scalars['String']['input']>;
  url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url_not?: InputMaybe<Scalars['String']['input']>;
  url_not_contains?: InputMaybe<Scalars['String']['input']>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  width?: InputMaybe<Scalars['Int']['input']>;
  width_exists?: InputMaybe<Scalars['Boolean']['input']>;
  width_gt?: InputMaybe<Scalars['Int']['input']>;
  width_gte?: InputMaybe<Scalars['Int']['input']>;
  width_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  width_lt?: InputMaybe<Scalars['Int']['input']>;
  width_lte?: InputMaybe<Scalars['Int']['input']>;
  width_not?: InputMaybe<Scalars['Int']['input']>;
  width_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type AssetLinkingCollections = {
  __typename?: 'AssetLinkingCollections';
  blogPostCollection: Maybe<BlogPostCollection>;
  blogPostCursorCollection: Maybe<BlogPostCursorCollection>;
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
  plantCollection: Maybe<PlantCollection>;
  plantCursorCollection: Maybe<PlantCursorCollection>;
  projectCollection: Maybe<ProjectCollection>;
  projectCursorCollection: Maybe<ProjectCursorCollection>;
  siteSettingsCollection: Maybe<SiteSettingsCollection>;
  siteSettingsCursorCollection: Maybe<SiteSettingsCursorCollection>;
};


export type AssetLinkingCollectionsBlogPostCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsBlogPostCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsPlantCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsPlantCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsProjectCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsProjectCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsSiteSettingsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AssetLinkingCollectionsSiteSettingsCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AssetOrder =
  | 'contentType_ASC'
  | 'contentType_DESC'
  | 'fileName_ASC'
  | 'fileName_DESC'
  | 'height_ASC'
  | 'height_DESC'
  | 'size_ASC'
  | 'size_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC'
  | 'url_ASC'
  | 'url_DESC'
  | 'width_ASC'
  | 'width_DESC';

/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPost = Entry & _Node & {
  __typename?: 'BlogPost';
  _id: Scalars['ID']['output'];
  author: Maybe<Scalars['String']['output']>;
  body: Maybe<BlogPostBody>;
  contentfulMetadata: ContentfulMetadata;
  ctaBody: Maybe<Scalars['String']['output']>;
  ctaHeading: Maybe<Scalars['String']['output']>;
  ctaLabel: Maybe<Scalars['String']['output']>;
  date: Maybe<Scalars['DateTime']['output']>;
  excerpt: Maybe<Scalars['String']['output']>;
  linkedFrom: Maybe<BlogPostLinkingCollections>;
  metaDescription: Maybe<Scalars['String']['output']>;
  readingMinutes: Maybe<Scalars['Int']['output']>;
  slug: Maybe<Scalars['String']['output']>;
  sys: Sys;
  thumbnail: Maybe<Asset>;
  thumbnailAltText: Maybe<Scalars['String']['output']>;
  thumbnailCaption: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostAuthorArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostBodyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostCtaBodyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostCtaHeadingArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostCtaLabelArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostDateArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostExcerptArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostMetaDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostReadingMinutesArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostSlugArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostThumbnailAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostThumbnailCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/blogPost) */
export type BlogPostTitleArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BlogPostBody = {
  __typename?: 'BlogPostBody';
  json: Scalars['JSON']['output'];
  links: BlogPostBodyLinks;
};

export type BlogPostBodyAssets = {
  __typename?: 'BlogPostBodyAssets';
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type BlogPostBodyEntries = {
  __typename?: 'BlogPostBodyEntries';
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type BlogPostBodyLinks = {
  __typename?: 'BlogPostBodyLinks';
  assets: BlogPostBodyAssets;
  entries: BlogPostBodyEntries;
  resources: BlogPostBodyResources;
};

export type BlogPostBodyResources = {
  __typename?: 'BlogPostBodyResources';
  block: Array<BlogPostBodyResourcesBlock>;
  hyperlink: Array<BlogPostBodyResourcesHyperlink>;
  inline: Array<BlogPostBodyResourcesInline>;
};

export type BlogPostBodyResourcesBlock = ResourceLink & {
  __typename?: 'BlogPostBodyResourcesBlock';
  sys: ResourceSys;
};

export type BlogPostBodyResourcesHyperlink = ResourceLink & {
  __typename?: 'BlogPostBodyResourcesHyperlink';
  sys: ResourceSys;
};

export type BlogPostBodyResourcesInline = ResourceLink & {
  __typename?: 'BlogPostBodyResourcesInline';
  sys: ResourceSys;
};

export type BlogPostCollection = {
  __typename?: 'BlogPostCollection';
  items: Array<Maybe<BlogPost>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type BlogPostCursorCollection = {
  __typename?: 'BlogPostCursorCollection';
  items: Array<Maybe<BlogPost>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type BlogPostFilter = {
  AND?: InputMaybe<Array<InputMaybe<BlogPostFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<BlogPostFilter>>>;
  author?: InputMaybe<Scalars['String']['input']>;
  author_contains?: InputMaybe<Scalars['String']['input']>;
  author_exists?: InputMaybe<Scalars['Boolean']['input']>;
  author_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  author_not?: InputMaybe<Scalars['String']['input']>;
  author_not_contains?: InputMaybe<Scalars['String']['input']>;
  author_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  body_contains?: InputMaybe<Scalars['String']['input']>;
  body_exists?: InputMaybe<Scalars['Boolean']['input']>;
  body_not_contains?: InputMaybe<Scalars['String']['input']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  ctaBody?: InputMaybe<Scalars['String']['input']>;
  ctaBody_contains?: InputMaybe<Scalars['String']['input']>;
  ctaBody_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaBody_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaBody_not?: InputMaybe<Scalars['String']['input']>;
  ctaBody_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaBody_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaHeading?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_contains?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaHeading_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaHeading_not?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaLabel?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_contains?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaLabel_not?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  date_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_not?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  excerpt_contains?: InputMaybe<Scalars['String']['input']>;
  excerpt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  excerpt_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  excerpt_not?: InputMaybe<Scalars['String']['input']>;
  excerpt_not_contains?: InputMaybe<Scalars['String']['input']>;
  excerpt_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaDescription_contains?: InputMaybe<Scalars['String']['input']>;
  metaDescription_exists?: InputMaybe<Scalars['Boolean']['input']>;
  metaDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaDescription_not?: InputMaybe<Scalars['String']['input']>;
  metaDescription_not_contains?: InputMaybe<Scalars['String']['input']>;
  metaDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  readingMinutes?: InputMaybe<Scalars['Int']['input']>;
  readingMinutes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  readingMinutes_gt?: InputMaybe<Scalars['Int']['input']>;
  readingMinutes_gte?: InputMaybe<Scalars['Int']['input']>;
  readingMinutes_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  readingMinutes_lt?: InputMaybe<Scalars['Int']['input']>;
  readingMinutes_lte?: InputMaybe<Scalars['Int']['input']>;
  readingMinutes_not?: InputMaybe<Scalars['Int']['input']>;
  readingMinutes_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_exists?: InputMaybe<Scalars['Boolean']['input']>;
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
  thumbnailAltText?: InputMaybe<Scalars['String']['input']>;
  thumbnailAltText_contains?: InputMaybe<Scalars['String']['input']>;
  thumbnailAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  thumbnailAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnailAltText_not?: InputMaybe<Scalars['String']['input']>;
  thumbnailAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  thumbnailAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnailCaption?: InputMaybe<Scalars['String']['input']>;
  thumbnailCaption_contains?: InputMaybe<Scalars['String']['input']>;
  thumbnailCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  thumbnailCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnailCaption_not?: InputMaybe<Scalars['String']['input']>;
  thumbnailCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  thumbnailCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnail_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_not?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type BlogPostLinkingCollections = {
  __typename?: 'BlogPostLinkingCollections';
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
};


export type BlogPostLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type BlogPostLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BlogPostOrder =
  | 'author_ASC'
  | 'author_DESC'
  | 'ctaBody_ASC'
  | 'ctaBody_DESC'
  | 'ctaHeading_ASC'
  | 'ctaHeading_DESC'
  | 'ctaLabel_ASC'
  | 'ctaLabel_DESC'
  | 'date_ASC'
  | 'date_DESC'
  | 'excerpt_ASC'
  | 'excerpt_DESC'
  | 'metaDescription_ASC'
  | 'metaDescription_DESC'
  | 'readingMinutes_ASC'
  | 'readingMinutes_DESC'
  | 'slug_ASC'
  | 'slug_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC'
  | 'thumbnailAltText_ASC'
  | 'thumbnailAltText_DESC'
  | 'thumbnailCaption_ASC'
  | 'thumbnailCaption_DESC'
  | 'title_ASC'
  | 'title_DESC';

export type ContentfulMetadata = {
  __typename?: 'ContentfulMetadata';
  concepts: Array<Maybe<TaxonomyConcept>>;
  tags: Array<Maybe<ContentfulTag>>;
};

export type ContentfulMetadataConceptsDescendantsFilter = {
  id_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ContentfulMetadataConceptsFilter = {
  descendants?: InputMaybe<ContentfulMetadataConceptsDescendantsFilter>;
  id_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ContentfulMetadataFilter = {
  concepts?: InputMaybe<ContentfulMetadataConceptsFilter>;
  concepts_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<ContentfulMetadataTagsFilter>;
  tags_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ContentfulMetadataTagsFilter = {
  id_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/**
 * Represents a tag entity for finding and organizing content easily.
 *       Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags
 */
export type ContentfulTag = {
  __typename?: 'ContentfulTag';
  id: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
};

export type CursorPages = {
  __typename?: 'CursorPages';
  next: Maybe<Scalars['String']['output']>;
  prev: Maybe<Scalars['String']['output']>;
};

export type Entry = {
  contentfulMetadata: ContentfulMetadata;
  sys: Sys;
};

export type EntryCollection = {
  __typename?: 'EntryCollection';
  items: Array<Maybe<Entry>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type EntryCursorCollection = {
  __typename?: 'EntryCursorCollection';
  items: Array<Maybe<Entry>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type EntryFilter = {
  AND?: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
};

export type EntryOrder =
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC';

export type ImageFormat =
  /** AVIF image format. */
  | 'AVIF'
  /** JPG image format. */
  | 'JPG'
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  | 'JPG_PROGRESSIVE'
  /** PNG image format */
  | 'PNG'
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  | 'PNG8'
  /** WebP image format. */
  | 'WEBP';

export type ImageResizeFocus =
  /** Focus the resizing on the bottom. */
  | 'BOTTOM'
  /** Focus the resizing on the bottom left. */
  | 'BOTTOM_LEFT'
  /** Focus the resizing on the bottom right. */
  | 'BOTTOM_RIGHT'
  /** Focus the resizing on the center. */
  | 'CENTER'
  /** Focus the resizing on the largest face. */
  | 'FACE'
  /** Focus the resizing on the area containing all the faces. */
  | 'FACES'
  /** Focus the resizing on the left. */
  | 'LEFT'
  /** Focus the resizing on the right. */
  | 'RIGHT'
  /** Focus the resizing on the top. */
  | 'TOP'
  /** Focus the resizing on the top left. */
  | 'TOP_LEFT'
  /** Focus the resizing on the top right. */
  | 'TOP_RIGHT';

export type ImageResizeStrategy =
  /** Crops a part of the original image to fit into the specified dimensions. */
  | 'CROP'
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  | 'FILL'
  /** Resizes the image to fit into the specified dimensions. */
  | 'FIT'
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  | 'PAD'
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  | 'SCALE'
  /** Creates a thumbnail from the image. */
  | 'THUMB';

export type ImageTransformOptions = {
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: InputMaybe<Scalars['HexColor']['input']>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: InputMaybe<Scalars['Int']['input']>;
  /** Desired image format. Defaults to the original image format. */
  format?: InputMaybe<ImageFormat>;
  /** Desired height in pixels. Defaults to the original image height. */
  height?: InputMaybe<Scalars['Dimension']['input']>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: InputMaybe<Scalars['Quality']['input']>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: InputMaybe<ImageResizeFocus>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: InputMaybe<ImageResizeStrategy>;
  /** Desired width in pixels. Defaults to the original image width. */
  width?: InputMaybe<Scalars['Dimension']['input']>;
};

/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type Plant = Entry & _Node & {
  __typename?: 'Plant';
  _id: Scalars['ID']['output'];
  commonName: Maybe<Scalars['String']['output']>;
  contentfulMetadata: ContentfulMetadata;
  featured: Maybe<Scalars['Boolean']['output']>;
  isNative: Maybe<Scalars['Boolean']['output']>;
  latinName: Maybe<Scalars['String']['output']>;
  lightTag: Maybe<Scalars['String']['output']>;
  linkedFrom: Maybe<PlantLinkingCollections>;
  order: Maybe<Scalars['Int']['output']>;
  photo: Maybe<Asset>;
  photoAltText: Maybe<Scalars['String']['output']>;
  photoCaption: Maybe<Scalars['String']['output']>;
  sys: Sys;
  waterTag: Maybe<Scalars['String']['output']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantCommonNameArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantFeaturedArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantIsNativeArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantLatinNameArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantLightTagArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantOrderArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantPhotoArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantPhotoAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantPhotoCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/plant) */
export type PlantWaterTagArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PlantCollection = {
  __typename?: 'PlantCollection';
  items: Array<Maybe<Plant>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PlantCursorCollection = {
  __typename?: 'PlantCursorCollection';
  items: Array<Maybe<Plant>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type PlantFilter = {
  AND?: InputMaybe<Array<InputMaybe<PlantFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PlantFilter>>>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  commonName_contains?: InputMaybe<Scalars['String']['input']>;
  commonName_exists?: InputMaybe<Scalars['Boolean']['input']>;
  commonName_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commonName_not?: InputMaybe<Scalars['String']['input']>;
  commonName_not_contains?: InputMaybe<Scalars['String']['input']>;
  commonName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  featured_exists?: InputMaybe<Scalars['Boolean']['input']>;
  featured_not?: InputMaybe<Scalars['Boolean']['input']>;
  isNative?: InputMaybe<Scalars['Boolean']['input']>;
  isNative_exists?: InputMaybe<Scalars['Boolean']['input']>;
  isNative_not?: InputMaybe<Scalars['Boolean']['input']>;
  latinName?: InputMaybe<Scalars['String']['input']>;
  latinName_contains?: InputMaybe<Scalars['String']['input']>;
  latinName_exists?: InputMaybe<Scalars['Boolean']['input']>;
  latinName_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  latinName_not?: InputMaybe<Scalars['String']['input']>;
  latinName_not_contains?: InputMaybe<Scalars['String']['input']>;
  latinName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lightTag?: InputMaybe<Scalars['String']['input']>;
  lightTag_contains?: InputMaybe<Scalars['String']['input']>;
  lightTag_exists?: InputMaybe<Scalars['Boolean']['input']>;
  lightTag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lightTag_not?: InputMaybe<Scalars['String']['input']>;
  lightTag_not_contains?: InputMaybe<Scalars['String']['input']>;
  lightTag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_exists?: InputMaybe<Scalars['Boolean']['input']>;
  order_gt?: InputMaybe<Scalars['Int']['input']>;
  order_gte?: InputMaybe<Scalars['Int']['input']>;
  order_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  order_lt?: InputMaybe<Scalars['Int']['input']>;
  order_lte?: InputMaybe<Scalars['Int']['input']>;
  order_not?: InputMaybe<Scalars['Int']['input']>;
  order_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  photoAltText?: InputMaybe<Scalars['String']['input']>;
  photoAltText_contains?: InputMaybe<Scalars['String']['input']>;
  photoAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  photoAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  photoAltText_not?: InputMaybe<Scalars['String']['input']>;
  photoAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  photoAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  photoCaption?: InputMaybe<Scalars['String']['input']>;
  photoCaption_contains?: InputMaybe<Scalars['String']['input']>;
  photoCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  photoCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  photoCaption_not?: InputMaybe<Scalars['String']['input']>;
  photoCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  photoCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  photo_exists?: InputMaybe<Scalars['Boolean']['input']>;
  sys?: InputMaybe<SysFilter>;
  waterTag?: InputMaybe<Scalars['String']['input']>;
  waterTag_contains?: InputMaybe<Scalars['String']['input']>;
  waterTag_exists?: InputMaybe<Scalars['Boolean']['input']>;
  waterTag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  waterTag_not?: InputMaybe<Scalars['String']['input']>;
  waterTag_not_contains?: InputMaybe<Scalars['String']['input']>;
  waterTag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlantLinkingCollections = {
  __typename?: 'PlantLinkingCollections';
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
};


export type PlantLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PlantLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PlantOrder =
  | 'commonName_ASC'
  | 'commonName_DESC'
  | 'featured_ASC'
  | 'featured_DESC'
  | 'isNative_ASC'
  | 'isNative_DESC'
  | 'latinName_ASC'
  | 'latinName_DESC'
  | 'lightTag_ASC'
  | 'lightTag_DESC'
  | 'order_ASC'
  | 'order_DESC'
  | 'photoAltText_ASC'
  | 'photoAltText_DESC'
  | 'photoCaption_ASC'
  | 'photoCaption_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC'
  | 'waterTag_ASC'
  | 'waterTag_DESC';

/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type Project = Entry & _Node & {
  __typename?: 'Project';
  _id: Scalars['ID']['output'];
  afterImage: Maybe<Asset>;
  afterImageAltText: Maybe<Scalars['String']['output']>;
  afterImageCaption: Maybe<Scalars['String']['output']>;
  beforeImage: Maybe<Asset>;
  beforeImageAltText: Maybe<Scalars['String']['output']>;
  beforeImageCaption: Maybe<Scalars['String']['output']>;
  body: Maybe<ProjectBody>;
  caption: Maybe<Scalars['String']['output']>;
  contentfulMetadata: ContentfulMetadata;
  ctaBody: Maybe<Scalars['String']['output']>;
  ctaHeading: Maybe<Scalars['String']['output']>;
  ctaLabel: Maybe<Scalars['String']['output']>;
  date: Maybe<Scalars['DateTime']['output']>;
  leadImage: Maybe<Asset>;
  leadImageAltText: Maybe<Scalars['String']['output']>;
  leadImageCaption: Maybe<Scalars['String']['output']>;
  linkedFrom: Maybe<ProjectLinkingCollections>;
  location: Maybe<Scalars['String']['output']>;
  metaDescription: Maybe<Scalars['String']['output']>;
  slug: Maybe<Scalars['String']['output']>;
  summary: Maybe<Scalars['String']['output']>;
  sys: Sys;
  title: Maybe<Scalars['String']['output']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectAfterImageArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectAfterImageAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectAfterImageCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectBeforeImageArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectBeforeImageAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectBeforeImageCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectBodyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectCtaBodyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectCtaHeadingArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectCtaLabelArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectDateArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectLeadImageArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectLeadImageAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectLeadImageCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectLocationArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectMetaDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectSlugArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectSummaryArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/project) */
export type ProjectTitleArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectBody = {
  __typename?: 'ProjectBody';
  json: Scalars['JSON']['output'];
  links: ProjectBodyLinks;
};

export type ProjectBodyAssets = {
  __typename?: 'ProjectBodyAssets';
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type ProjectBodyEntries = {
  __typename?: 'ProjectBodyEntries';
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type ProjectBodyLinks = {
  __typename?: 'ProjectBodyLinks';
  assets: ProjectBodyAssets;
  entries: ProjectBodyEntries;
  resources: ProjectBodyResources;
};

export type ProjectBodyResources = {
  __typename?: 'ProjectBodyResources';
  block: Array<ProjectBodyResourcesBlock>;
  hyperlink: Array<ProjectBodyResourcesHyperlink>;
  inline: Array<ProjectBodyResourcesInline>;
};

export type ProjectBodyResourcesBlock = ResourceLink & {
  __typename?: 'ProjectBodyResourcesBlock';
  sys: ResourceSys;
};

export type ProjectBodyResourcesHyperlink = ResourceLink & {
  __typename?: 'ProjectBodyResourcesHyperlink';
  sys: ResourceSys;
};

export type ProjectBodyResourcesInline = ResourceLink & {
  __typename?: 'ProjectBodyResourcesInline';
  sys: ResourceSys;
};

export type ProjectCollection = {
  __typename?: 'ProjectCollection';
  items: Array<Maybe<Project>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ProjectCursorCollection = {
  __typename?: 'ProjectCursorCollection';
  items: Array<Maybe<Project>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type ProjectFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProjectFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ProjectFilter>>>;
  afterImageAltText?: InputMaybe<Scalars['String']['input']>;
  afterImageAltText_contains?: InputMaybe<Scalars['String']['input']>;
  afterImageAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  afterImageAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  afterImageAltText_not?: InputMaybe<Scalars['String']['input']>;
  afterImageAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  afterImageAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  afterImageCaption?: InputMaybe<Scalars['String']['input']>;
  afterImageCaption_contains?: InputMaybe<Scalars['String']['input']>;
  afterImageCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  afterImageCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  afterImageCaption_not?: InputMaybe<Scalars['String']['input']>;
  afterImageCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  afterImageCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  afterImage_exists?: InputMaybe<Scalars['Boolean']['input']>;
  beforeImageAltText?: InputMaybe<Scalars['String']['input']>;
  beforeImageAltText_contains?: InputMaybe<Scalars['String']['input']>;
  beforeImageAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  beforeImageAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  beforeImageAltText_not?: InputMaybe<Scalars['String']['input']>;
  beforeImageAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  beforeImageAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  beforeImageCaption?: InputMaybe<Scalars['String']['input']>;
  beforeImageCaption_contains?: InputMaybe<Scalars['String']['input']>;
  beforeImageCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  beforeImageCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  beforeImageCaption_not?: InputMaybe<Scalars['String']['input']>;
  beforeImageCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  beforeImageCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  beforeImage_exists?: InputMaybe<Scalars['Boolean']['input']>;
  body_contains?: InputMaybe<Scalars['String']['input']>;
  body_exists?: InputMaybe<Scalars['Boolean']['input']>;
  body_not_contains?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  caption_contains?: InputMaybe<Scalars['String']['input']>;
  caption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  caption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  caption_not?: InputMaybe<Scalars['String']['input']>;
  caption_not_contains?: InputMaybe<Scalars['String']['input']>;
  caption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  ctaBody?: InputMaybe<Scalars['String']['input']>;
  ctaBody_contains?: InputMaybe<Scalars['String']['input']>;
  ctaBody_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaBody_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaBody_not?: InputMaybe<Scalars['String']['input']>;
  ctaBody_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaBody_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaHeading?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_contains?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaHeading_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaHeading_not?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaLabel?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_contains?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaLabel_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaLabel_not?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaLabel_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  date_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_not?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  leadImageAltText?: InputMaybe<Scalars['String']['input']>;
  leadImageAltText_contains?: InputMaybe<Scalars['String']['input']>;
  leadImageAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  leadImageAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leadImageAltText_not?: InputMaybe<Scalars['String']['input']>;
  leadImageAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  leadImageAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leadImageCaption?: InputMaybe<Scalars['String']['input']>;
  leadImageCaption_contains?: InputMaybe<Scalars['String']['input']>;
  leadImageCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  leadImageCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leadImageCaption_not?: InputMaybe<Scalars['String']['input']>;
  leadImageCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  leadImageCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leadImage_exists?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  location_contains?: InputMaybe<Scalars['String']['input']>;
  location_exists?: InputMaybe<Scalars['Boolean']['input']>;
  location_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location_not?: InputMaybe<Scalars['String']['input']>;
  location_not_contains?: InputMaybe<Scalars['String']['input']>;
  location_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaDescription_contains?: InputMaybe<Scalars['String']['input']>;
  metaDescription_exists?: InputMaybe<Scalars['Boolean']['input']>;
  metaDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaDescription_not?: InputMaybe<Scalars['String']['input']>;
  metaDescription_not_contains?: InputMaybe<Scalars['String']['input']>;
  metaDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_exists?: InputMaybe<Scalars['Boolean']['input']>;
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  summary?: InputMaybe<Scalars['String']['input']>;
  summary_contains?: InputMaybe<Scalars['String']['input']>;
  summary_exists?: InputMaybe<Scalars['Boolean']['input']>;
  summary_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  summary_not?: InputMaybe<Scalars['String']['input']>;
  summary_not_contains?: InputMaybe<Scalars['String']['input']>;
  summary_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_not?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ProjectLinkingCollections = {
  __typename?: 'ProjectLinkingCollections';
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
};


export type ProjectLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ProjectLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectOrder =
  | 'afterImageAltText_ASC'
  | 'afterImageAltText_DESC'
  | 'afterImageCaption_ASC'
  | 'afterImageCaption_DESC'
  | 'beforeImageAltText_ASC'
  | 'beforeImageAltText_DESC'
  | 'beforeImageCaption_ASC'
  | 'beforeImageCaption_DESC'
  | 'caption_ASC'
  | 'caption_DESC'
  | 'ctaBody_ASC'
  | 'ctaBody_DESC'
  | 'ctaHeading_ASC'
  | 'ctaHeading_DESC'
  | 'ctaLabel_ASC'
  | 'ctaLabel_DESC'
  | 'date_ASC'
  | 'date_DESC'
  | 'leadImageAltText_ASC'
  | 'leadImageAltText_DESC'
  | 'leadImageCaption_ASC'
  | 'leadImageCaption_DESC'
  | 'location_ASC'
  | 'location_DESC'
  | 'metaDescription_ASC'
  | 'metaDescription_DESC'
  | 'slug_ASC'
  | 'slug_DESC'
  | 'summary_ASC'
  | 'summary_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC'
  | 'title_ASC'
  | 'title_DESC';

export type Query = {
  __typename?: 'Query';
  _node: Maybe<_Node>;
  _nodes: Array<Maybe<_Node>>;
  asset: Maybe<Asset>;
  assetCollection: Maybe<AssetCollection>;
  assetCursorCollection: Maybe<AssetCursorCollection>;
  blogPost: Maybe<BlogPost>;
  blogPostCollection: Maybe<BlogPostCollection>;
  blogPostCursorCollection: Maybe<BlogPostCursorCollection>;
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
  plant: Maybe<Plant>;
  plantCollection: Maybe<PlantCollection>;
  plantCursorCollection: Maybe<PlantCursorCollection>;
  project: Maybe<Project>;
  projectCollection: Maybe<ProjectCollection>;
  projectCursorCollection: Maybe<ProjectCursorCollection>;
  service: Maybe<Service>;
  serviceCollection: Maybe<ServiceCollection>;
  serviceCursorCollection: Maybe<ServiceCursorCollection>;
  siteSettings: Maybe<SiteSettings>;
  siteSettingsCollection: Maybe<SiteSettingsCollection>;
  siteSettingsCursorCollection: Maybe<SiteSettingsCursorCollection>;
  testimonial: Maybe<Testimonial>;
  testimonialCollection: Maybe<TestimonialCollection>;
  testimonialCursorCollection: Maybe<TestimonialCursorCollection>;
};


export type Query_NodeArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type Query_NodesArgs = {
  ids: Array<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAssetArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<AssetOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssetFilter>;
};


export type QueryAssetCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<AssetOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssetFilter>;
};


export type QueryBlogPostArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryBlogPostCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<BlogPostOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<BlogPostFilter>;
};


export type QueryBlogPostCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<BlogPostOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<BlogPostFilter>;
};


export type QueryEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<EntryOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<EntryFilter>;
};


export type QueryEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<EntryOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<EntryFilter>;
};


export type QueryPlantArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryPlantCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<PlantOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<PlantFilter>;
};


export type QueryPlantCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<PlantOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<PlantFilter>;
};


export type QueryProjectArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryProjectCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<ProjectOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ProjectFilter>;
};


export type QueryProjectCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<ProjectOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ProjectFilter>;
};


export type QueryServiceArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryServiceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<ServiceOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ServiceFilter>;
};


export type QueryServiceCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<ServiceOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<ServiceFilter>;
};


export type QuerySiteSettingsArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySiteSettingsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<SiteSettingsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<SiteSettingsFilter>;
};


export type QuerySiteSettingsCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<SiteSettingsOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<SiteSettingsFilter>;
};


export type QueryTestimonialArgs = {
  id: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTestimonialCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<TestimonialOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<TestimonialFilter>;
};


export type QueryTestimonialCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<TestimonialOrder>>>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<TestimonialFilter>;
};

export type ResourceLink = {
  sys: ResourceSys;
};

export type ResourceSys = {
  __typename?: 'ResourceSys';
  linkType: Scalars['String']['output'];
  urn: Scalars['String']['output'];
};

/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type Service = Entry & _Node & {
  __typename?: 'Service';
  _id: Scalars['ID']['output'];
  body: Maybe<ServiceBody>;
  contentfulMetadata: ContentfulMetadata;
  ctaBody: Maybe<Scalars['String']['output']>;
  ctaHeading: Maybe<Scalars['String']['output']>;
  iconKey: Maybe<Scalars['String']['output']>;
  intro: Maybe<Scalars['String']['output']>;
  linkedFrom: Maybe<ServiceLinkingCollections>;
  metaDescription: Maybe<Scalars['String']['output']>;
  metaTitle: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  slug: Maybe<Scalars['String']['output']>;
  summary: Maybe<Scalars['String']['output']>;
  sys: Sys;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceBodyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceCtaBodyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceCtaHeadingArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceIconKeyArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceIntroArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceMetaDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceMetaTitleArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceNameArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceOrderArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceSlugArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/service) */
export type ServiceSummaryArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ServiceBody = {
  __typename?: 'ServiceBody';
  json: Scalars['JSON']['output'];
  links: ServiceBodyLinks;
};

export type ServiceBodyAssets = {
  __typename?: 'ServiceBodyAssets';
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type ServiceBodyEntries = {
  __typename?: 'ServiceBodyEntries';
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type ServiceBodyLinks = {
  __typename?: 'ServiceBodyLinks';
  assets: ServiceBodyAssets;
  entries: ServiceBodyEntries;
  resources: ServiceBodyResources;
};

export type ServiceBodyResources = {
  __typename?: 'ServiceBodyResources';
  block: Array<ServiceBodyResourcesBlock>;
  hyperlink: Array<ServiceBodyResourcesHyperlink>;
  inline: Array<ServiceBodyResourcesInline>;
};

export type ServiceBodyResourcesBlock = ResourceLink & {
  __typename?: 'ServiceBodyResourcesBlock';
  sys: ResourceSys;
};

export type ServiceBodyResourcesHyperlink = ResourceLink & {
  __typename?: 'ServiceBodyResourcesHyperlink';
  sys: ResourceSys;
};

export type ServiceBodyResourcesInline = ResourceLink & {
  __typename?: 'ServiceBodyResourcesInline';
  sys: ResourceSys;
};

export type ServiceCollection = {
  __typename?: 'ServiceCollection';
  items: Array<Maybe<Service>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ServiceCursorCollection = {
  __typename?: 'ServiceCursorCollection';
  items: Array<Maybe<Service>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type ServiceFilter = {
  AND?: InputMaybe<Array<InputMaybe<ServiceFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ServiceFilter>>>;
  body_contains?: InputMaybe<Scalars['String']['input']>;
  body_exists?: InputMaybe<Scalars['Boolean']['input']>;
  body_not_contains?: InputMaybe<Scalars['String']['input']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  ctaBody?: InputMaybe<Scalars['String']['input']>;
  ctaBody_contains?: InputMaybe<Scalars['String']['input']>;
  ctaBody_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaBody_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaBody_not?: InputMaybe<Scalars['String']['input']>;
  ctaBody_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaBody_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaHeading?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_contains?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_exists?: InputMaybe<Scalars['Boolean']['input']>;
  ctaHeading_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ctaHeading_not?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_not_contains?: InputMaybe<Scalars['String']['input']>;
  ctaHeading_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  iconKey?: InputMaybe<Scalars['String']['input']>;
  iconKey_contains?: InputMaybe<Scalars['String']['input']>;
  iconKey_exists?: InputMaybe<Scalars['Boolean']['input']>;
  iconKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  iconKey_not?: InputMaybe<Scalars['String']['input']>;
  iconKey_not_contains?: InputMaybe<Scalars['String']['input']>;
  iconKey_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  intro?: InputMaybe<Scalars['String']['input']>;
  intro_contains?: InputMaybe<Scalars['String']['input']>;
  intro_exists?: InputMaybe<Scalars['Boolean']['input']>;
  intro_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  intro_not?: InputMaybe<Scalars['String']['input']>;
  intro_not_contains?: InputMaybe<Scalars['String']['input']>;
  intro_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaDescription_contains?: InputMaybe<Scalars['String']['input']>;
  metaDescription_exists?: InputMaybe<Scalars['Boolean']['input']>;
  metaDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaDescription_not?: InputMaybe<Scalars['String']['input']>;
  metaDescription_not_contains?: InputMaybe<Scalars['String']['input']>;
  metaDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  metaTitle_contains?: InputMaybe<Scalars['String']['input']>;
  metaTitle_exists?: InputMaybe<Scalars['Boolean']['input']>;
  metaTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metaTitle_not?: InputMaybe<Scalars['String']['input']>;
  metaTitle_not_contains?: InputMaybe<Scalars['String']['input']>;
  metaTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_exists?: InputMaybe<Scalars['Boolean']['input']>;
  order_gt?: InputMaybe<Scalars['Int']['input']>;
  order_gte?: InputMaybe<Scalars['Int']['input']>;
  order_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  order_lt?: InputMaybe<Scalars['Int']['input']>;
  order_lte?: InputMaybe<Scalars['Int']['input']>;
  order_not?: InputMaybe<Scalars['Int']['input']>;
  order_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_exists?: InputMaybe<Scalars['Boolean']['input']>;
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  summary?: InputMaybe<Scalars['String']['input']>;
  summary_contains?: InputMaybe<Scalars['String']['input']>;
  summary_exists?: InputMaybe<Scalars['Boolean']['input']>;
  summary_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  summary_not?: InputMaybe<Scalars['String']['input']>;
  summary_not_contains?: InputMaybe<Scalars['String']['input']>;
  summary_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ServiceLinkingCollections = {
  __typename?: 'ServiceLinkingCollections';
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
};


export type ServiceLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ServiceLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ServiceOrder =
  | 'ctaBody_ASC'
  | 'ctaBody_DESC'
  | 'ctaHeading_ASC'
  | 'ctaHeading_DESC'
  | 'iconKey_ASC'
  | 'iconKey_DESC'
  | 'metaDescription_ASC'
  | 'metaDescription_DESC'
  | 'metaTitle_ASC'
  | 'metaTitle_DESC'
  | 'name_ASC'
  | 'name_DESC'
  | 'order_ASC'
  | 'order_DESC'
  | 'slug_ASC'
  | 'slug_DESC'
  | 'summary_ASC'
  | 'summary_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC';

/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettings = Entry & _Node & {
  __typename?: 'SiteSettings';
  _id: Scalars['ID']['output'];
  contentfulMetadata: ContentfulMetadata;
  heroImageDesktop: Maybe<Asset>;
  heroImageDesktopAltText: Maybe<Scalars['String']['output']>;
  heroImageDesktopCaption: Maybe<Scalars['String']['output']>;
  heroImageMobile: Maybe<Asset>;
  heroImageMobileAltText: Maybe<Scalars['String']['output']>;
  heroImageMobileCaption: Maybe<Scalars['String']['output']>;
  internalName: Maybe<Scalars['String']['output']>;
  linkedFrom: Maybe<SiteSettingsLinkingCollections>;
  portrait: Maybe<Asset>;
  portraitAltText: Maybe<Scalars['String']['output']>;
  portraitCaption: Maybe<Scalars['String']['output']>;
  sys: Sys;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsHeroImageDesktopArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsHeroImageDesktopAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsHeroImageDesktopCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsHeroImageMobileArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsHeroImageMobileAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsHeroImageMobileCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsInternalNameArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsPortraitArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsPortraitAltTextArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/siteSettings) */
export type SiteSettingsPortraitCaptionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SiteSettingsCollection = {
  __typename?: 'SiteSettingsCollection';
  items: Array<Maybe<SiteSettings>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type SiteSettingsCursorCollection = {
  __typename?: 'SiteSettingsCursorCollection';
  items: Array<Maybe<SiteSettings>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type SiteSettingsFilter = {
  AND?: InputMaybe<Array<InputMaybe<SiteSettingsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<SiteSettingsFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  heroImageDesktopAltText?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopAltText_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  heroImageDesktopAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageDesktopAltText_not?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageDesktopCaption?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopCaption_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  heroImageDesktopCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageDesktopCaption_not?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageDesktopCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageDesktop_exists?: InputMaybe<Scalars['Boolean']['input']>;
  heroImageMobileAltText?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileAltText_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  heroImageMobileAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageMobileAltText_not?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageMobileCaption?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileCaption_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  heroImageMobileCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageMobileCaption_not?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  heroImageMobileCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  heroImageMobile_exists?: InputMaybe<Scalars['Boolean']['input']>;
  internalName?: InputMaybe<Scalars['String']['input']>;
  internalName_contains?: InputMaybe<Scalars['String']['input']>;
  internalName_exists?: InputMaybe<Scalars['Boolean']['input']>;
  internalName_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  internalName_not?: InputMaybe<Scalars['String']['input']>;
  internalName_not_contains?: InputMaybe<Scalars['String']['input']>;
  internalName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  portraitAltText?: InputMaybe<Scalars['String']['input']>;
  portraitAltText_contains?: InputMaybe<Scalars['String']['input']>;
  portraitAltText_exists?: InputMaybe<Scalars['Boolean']['input']>;
  portraitAltText_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  portraitAltText_not?: InputMaybe<Scalars['String']['input']>;
  portraitAltText_not_contains?: InputMaybe<Scalars['String']['input']>;
  portraitAltText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  portraitCaption?: InputMaybe<Scalars['String']['input']>;
  portraitCaption_contains?: InputMaybe<Scalars['String']['input']>;
  portraitCaption_exists?: InputMaybe<Scalars['Boolean']['input']>;
  portraitCaption_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  portraitCaption_not?: InputMaybe<Scalars['String']['input']>;
  portraitCaption_not_contains?: InputMaybe<Scalars['String']['input']>;
  portraitCaption_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  portrait_exists?: InputMaybe<Scalars['Boolean']['input']>;
  sys?: InputMaybe<SysFilter>;
};

export type SiteSettingsLinkingCollections = {
  __typename?: 'SiteSettingsLinkingCollections';
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
};


export type SiteSettingsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SiteSettingsLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SiteSettingsOrder =
  | 'heroImageDesktopAltText_ASC'
  | 'heroImageDesktopAltText_DESC'
  | 'heroImageDesktopCaption_ASC'
  | 'heroImageDesktopCaption_DESC'
  | 'heroImageMobileAltText_ASC'
  | 'heroImageMobileAltText_DESC'
  | 'heroImageMobileCaption_ASC'
  | 'heroImageMobileCaption_DESC'
  | 'internalName_ASC'
  | 'internalName_DESC'
  | 'portraitAltText_ASC'
  | 'portraitAltText_DESC'
  | 'portraitCaption_ASC'
  | 'portraitCaption_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC';

export type Sys = {
  __typename?: 'Sys';
  environmentId: Scalars['String']['output'];
  firstPublishedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  /** The locale that was requested. */
  locale: Maybe<Scalars['String']['output']>;
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  publishedVersion: Maybe<Scalars['Int']['output']>;
  spaceId: Scalars['String']['output'];
};

export type SysFilter = {
  firstPublishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublishedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  firstPublishedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublishedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  firstPublishedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublishedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublishedAt_not?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  publishedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt_not?: InputMaybe<Scalars['DateTime']['input']>;
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  publishedVersion?: InputMaybe<Scalars['Float']['input']>;
  publishedVersion_exists?: InputMaybe<Scalars['Boolean']['input']>;
  publishedVersion_gt?: InputMaybe<Scalars['Float']['input']>;
  publishedVersion_gte?: InputMaybe<Scalars['Float']['input']>;
  publishedVersion_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  publishedVersion_lt?: InputMaybe<Scalars['Float']['input']>;
  publishedVersion_lte?: InputMaybe<Scalars['Float']['input']>;
  publishedVersion_not?: InputMaybe<Scalars['Float']['input']>;
  publishedVersion_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

/**
 * Represents a taxonomy concept entity for finding and organizing content easily.
 *         Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-concepts
 */
export type TaxonomyConcept = {
  __typename?: 'TaxonomyConcept';
  id: Maybe<Scalars['String']['output']>;
};

/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/testimonial) */
export type Testimonial = Entry & _Node & {
  __typename?: 'Testimonial';
  _id: Scalars['ID']['output'];
  attribution: Maybe<Scalars['String']['output']>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom: Maybe<TestimonialLinkingCollections>;
  order: Maybe<Scalars['Int']['output']>;
  quote: Maybe<Scalars['String']['output']>;
  sys: Sys;
  town: Maybe<Scalars['String']['output']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/testimonial) */
export type TestimonialAttributionArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/testimonial) */
export type TestimonialLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/testimonial) */
export type TestimonialOrderArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/testimonial) */
export type TestimonialQuoteArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


/** [See type definition](https://app.contentful.com/spaces/glk8r6a2t8mm/content_types/testimonial) */
export type TestimonialTownArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TestimonialCollection = {
  __typename?: 'TestimonialCollection';
  items: Array<Maybe<Testimonial>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TestimonialCursorCollection = {
  __typename?: 'TestimonialCursorCollection';
  items: Array<Maybe<Testimonial>>;
  limit: Scalars['Int']['output'];
  pages: CursorPages;
};

export type TestimonialFilter = {
  AND?: InputMaybe<Array<InputMaybe<TestimonialFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TestimonialFilter>>>;
  attribution?: InputMaybe<Scalars['String']['input']>;
  attribution_contains?: InputMaybe<Scalars['String']['input']>;
  attribution_exists?: InputMaybe<Scalars['Boolean']['input']>;
  attribution_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  attribution_not?: InputMaybe<Scalars['String']['input']>;
  attribution_not_contains?: InputMaybe<Scalars['String']['input']>;
  attribution_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  order?: InputMaybe<Scalars['Int']['input']>;
  order_exists?: InputMaybe<Scalars['Boolean']['input']>;
  order_gt?: InputMaybe<Scalars['Int']['input']>;
  order_gte?: InputMaybe<Scalars['Int']['input']>;
  order_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  order_lt?: InputMaybe<Scalars['Int']['input']>;
  order_lte?: InputMaybe<Scalars['Int']['input']>;
  order_not?: InputMaybe<Scalars['Int']['input']>;
  order_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  quote?: InputMaybe<Scalars['String']['input']>;
  quote_contains?: InputMaybe<Scalars['String']['input']>;
  quote_exists?: InputMaybe<Scalars['Boolean']['input']>;
  quote_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  quote_not?: InputMaybe<Scalars['String']['input']>;
  quote_not_contains?: InputMaybe<Scalars['String']['input']>;
  quote_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
  town?: InputMaybe<Scalars['String']['input']>;
  town_contains?: InputMaybe<Scalars['String']['input']>;
  town_exists?: InputMaybe<Scalars['Boolean']['input']>;
  town_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  town_not?: InputMaybe<Scalars['String']['input']>;
  town_not_contains?: InputMaybe<Scalars['String']['input']>;
  town_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TestimonialLinkingCollections = {
  __typename?: 'TestimonialLinkingCollections';
  entryCollection: Maybe<EntryCollection>;
  entryCursorCollection: Maybe<EntryCursorCollection>;
};


export type TestimonialLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};


export type TestimonialLinkingCollectionsEntryCursorCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  pageNext?: InputMaybe<Scalars['String']['input']>;
  pagePrev?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  useFallbackLocale?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TestimonialOrder =
  | 'attribution_ASC'
  | 'attribution_DESC'
  | 'order_ASC'
  | 'order_DESC'
  | 'sys_firstPublishedAt_ASC'
  | 'sys_firstPublishedAt_DESC'
  | 'sys_id_ASC'
  | 'sys_id_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'sys_publishedVersion_ASC'
  | 'sys_publishedVersion_DESC'
  | 'town_ASC'
  | 'town_DESC';

export type TimelineFilterInput = {
  /** Preview content starting from a given release date */
  release_lte?: InputMaybe<Scalars['String']['input']>;
  /** Preview content starting from a given timestamp */
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type _Node = {
  _id: Scalars['ID']['output'];
};

export type BlogPostCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BlogPostCollectionQuery = { __typename?: 'Query', blogPostCollection: { __typename?: 'BlogPostCollection', total: number, items: Array<{ __typename: 'BlogPost', title: string | null, slug: string | null, excerpt: string | null, date: string | null, author: string | null, readingMinutes: number | null, thumbnailAltText: string | null, thumbnailCaption: string | null, sys: { __typename?: 'Sys', id: string }, thumbnail: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type BlogPostBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type BlogPostBySlugQuery = { __typename?: 'Query', blogPostCollection: { __typename?: 'BlogPostCollection', items: Array<{ __typename: 'BlogPost', metaDescription: string | null, ctaHeading: string | null, ctaBody: string | null, ctaLabel: string | null, title: string | null, slug: string | null, excerpt: string | null, date: string | null, author: string | null, readingMinutes: number | null, thumbnailAltText: string | null, thumbnailCaption: string | null, body: { __typename?: 'BlogPostBody', json: unknown, links: { __typename?: 'BlogPostBodyLinks', assets: { __typename?: 'BlogPostBodyAssets', block: Array<{ __typename?: 'Asset', title: string | null, description: string | null, url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null>, hyperlink: Array<{ __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null> } } } | null, sys: { __typename?: 'Sys', id: string }, thumbnail: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type AssetFieldsFragment = { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } };

export type PlantCardFragment = { __typename: 'Plant', commonName: string | null, latinName: string | null, lightTag: string | null, waterTag: string | null, isNative: boolean | null, featured: boolean | null, order: number | null, photoAltText: string | null, photoCaption: string | null, sys: { __typename?: 'Sys', id: string }, photo: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null };

export type ProjectCardFragment = { __typename: 'Project', title: string | null, slug: string | null, caption: string | null, location: string | null, date: string | null, beforeImageAltText: string | null, beforeImageCaption: string | null, afterImageAltText: string | null, afterImageCaption: string | null, sys: { __typename?: 'Sys', id: string }, beforeImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, afterImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null };

export type BlogPostCardFragment = { __typename: 'BlogPost', title: string | null, slug: string | null, excerpt: string | null, date: string | null, author: string | null, readingMinutes: number | null, thumbnailAltText: string | null, thumbnailCaption: string | null, sys: { __typename?: 'Sys', id: string }, thumbnail: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null };

export type TestimonialFieldsFragment = { __typename: 'Testimonial', quote: string | null, attribution: string | null, town: string | null, order: number | null, sys: { __typename?: 'Sys', id: string } };

export type ServiceCardFragment = { __typename: 'Service', name: string | null, slug: string | null, summary: string | null, iconKey: string | null, order: number | null, sys: { __typename?: 'Sys', id: string } };

export type PlantCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PlantCollectionQuery = { __typename?: 'Query', plantCollection: { __typename?: 'PlantCollection', total: number, items: Array<{ __typename: 'Plant', commonName: string | null, latinName: string | null, lightTag: string | null, waterTag: string | null, isNative: boolean | null, featured: boolean | null, order: number | null, photoAltText: string | null, photoCaption: string | null, sys: { __typename?: 'Sys', id: string }, photo: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type FeaturedPlantCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FeaturedPlantCollectionQuery = { __typename?: 'Query', plantCollection: { __typename?: 'PlantCollection', total: number, items: Array<{ __typename: 'Plant', commonName: string | null, latinName: string | null, lightTag: string | null, waterTag: string | null, isNative: boolean | null, featured: boolean | null, order: number | null, photoAltText: string | null, photoCaption: string | null, sys: { __typename?: 'Sys', id: string }, photo: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type ProjectCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProjectCollectionQuery = { __typename?: 'Query', projectCollection: { __typename?: 'ProjectCollection', total: number, items: Array<{ __typename: 'Project', title: string | null, slug: string | null, caption: string | null, location: string | null, date: string | null, beforeImageAltText: string | null, beforeImageCaption: string | null, afterImageAltText: string | null, afterImageCaption: string | null, sys: { __typename?: 'Sys', id: string }, beforeImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, afterImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type ProjectBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ProjectBySlugQuery = { __typename?: 'Query', projectCollection: { __typename?: 'ProjectCollection', items: Array<{ __typename: 'Project', summary: string | null, metaDescription: string | null, leadImageAltText: string | null, leadImageCaption: string | null, ctaHeading: string | null, ctaBody: string | null, ctaLabel: string | null, title: string | null, slug: string | null, caption: string | null, location: string | null, date: string | null, beforeImageAltText: string | null, beforeImageCaption: string | null, afterImageAltText: string | null, afterImageCaption: string | null, leadImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, body: { __typename?: 'ProjectBody', json: unknown, links: { __typename?: 'ProjectBodyLinks', assets: { __typename?: 'ProjectBodyAssets', block: Array<{ __typename?: 'Asset', title: string | null, description: string | null, url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null>, hyperlink: Array<{ __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null> } } } | null, sys: { __typename?: 'Sys', id: string }, beforeImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, afterImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type ServiceCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ServiceCollectionQuery = { __typename?: 'Query', serviceCollection: { __typename?: 'ServiceCollection', total: number, items: Array<{ __typename: 'Service', name: string | null, slug: string | null, summary: string | null, iconKey: string | null, order: number | null, sys: { __typename?: 'Sys', id: string } } | null> } | null };

export type ServiceBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ServiceBySlugQuery = { __typename?: 'Query', serviceCollection: { __typename?: 'ServiceCollection', items: Array<{ __typename: 'Service', intro: string | null, metaTitle: string | null, metaDescription: string | null, ctaHeading: string | null, ctaBody: string | null, name: string | null, slug: string | null, summary: string | null, iconKey: string | null, order: number | null, body: { __typename?: 'ServiceBody', json: unknown, links: { __typename?: 'ServiceBodyLinks', assets: { __typename?: 'ServiceBodyAssets', block: Array<{ __typename?: 'Asset', title: string | null, description: string | null, url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null>, hyperlink: Array<{ __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null> } } } | null, sys: { __typename?: 'Sys', id: string } } | null> } | null };

export type SiteSettingsQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SiteSettingsQuery = { __typename?: 'Query', siteSettingsCollection: { __typename?: 'SiteSettingsCollection', items: Array<{ __typename: 'SiteSettings', internalName: string | null, heroImageDesktopAltText: string | null, heroImageDesktopCaption: string | null, heroImageMobileAltText: string | null, heroImageMobileCaption: string | null, portraitAltText: string | null, portraitCaption: string | null, sys: { __typename?: 'Sys', id: string }, heroImageDesktop: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, heroImageMobile: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, portrait: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null } | null> } | null };

export type TestimonialCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TestimonialCollectionQuery = { __typename?: 'Query', testimonialCollection: { __typename?: 'TestimonialCollection', total: number, items: Array<{ __typename: 'Testimonial', quote: string | null, attribution: string | null, town: string | null, order: number | null, sys: { __typename?: 'Sys', id: string } } | null> } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const AssetFieldsFragmentDoc = new TypedDocumentString(`
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
    `, {"fragmentName":"AssetFields"}) as unknown as TypedDocumentString<AssetFieldsFragment, unknown>;
export const PlantCardFragmentDoc = new TypedDocumentString(`
    fragment PlantCard on Plant {
  __typename
  sys {
    id
  }
  commonName
  latinName
  lightTag
  waterTag
  isNative
  featured
  order
  photoAltText
  photoCaption
  photo {
    ...AssetFields
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}`, {"fragmentName":"PlantCard"}) as unknown as TypedDocumentString<PlantCardFragment, unknown>;
export const ProjectCardFragmentDoc = new TypedDocumentString(`
    fragment ProjectCard on Project {
  __typename
  sys {
    id
  }
  title
  slug
  caption
  location
  date
  beforeImageAltText
  beforeImageCaption
  beforeImage {
    ...AssetFields
  }
  afterImageAltText
  afterImageCaption
  afterImage {
    ...AssetFields
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}`, {"fragmentName":"ProjectCard"}) as unknown as TypedDocumentString<ProjectCardFragment, unknown>;
export const BlogPostCardFragmentDoc = new TypedDocumentString(`
    fragment BlogPostCard on BlogPost {
  __typename
  sys {
    id
  }
  title
  slug
  excerpt
  date
  author
  readingMinutes
  thumbnailAltText
  thumbnailCaption
  thumbnail {
    ...AssetFields
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}`, {"fragmentName":"BlogPostCard"}) as unknown as TypedDocumentString<BlogPostCardFragment, unknown>;
export const TestimonialFieldsFragmentDoc = new TypedDocumentString(`
    fragment TestimonialFields on Testimonial {
  __typename
  sys {
    id
  }
  quote
  attribution
  town
  order
}
    `, {"fragmentName":"TestimonialFields"}) as unknown as TypedDocumentString<TestimonialFieldsFragment, unknown>;
export const ServiceCardFragmentDoc = new TypedDocumentString(`
    fragment ServiceCard on Service {
  __typename
  sys {
    id
  }
  name
  slug
  summary
  iconKey
  order
}
    `, {"fragmentName":"ServiceCard"}) as unknown as TypedDocumentString<ServiceCardFragment, unknown>;
export const BlogPostCollectionDocument = new TypedDocumentString(`
    query BlogPostCollection($preview: Boolean = false, $limit: Int = 100) {
  blogPostCollection(preview: $preview, limit: $limit, order: [date_DESC]) {
    total
    items {
      ...BlogPostCard
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment BlogPostCard on BlogPost {
  __typename
  sys {
    id
  }
  title
  slug
  excerpt
  date
  author
  readingMinutes
  thumbnailAltText
  thumbnailCaption
  thumbnail {
    ...AssetFields
  }
}`) as unknown as TypedDocumentString<BlogPostCollectionQuery, BlogPostCollectionQueryVariables>;
export const BlogPostBySlugDocument = new TypedDocumentString(`
    query BlogPostBySlug($slug: String!, $preview: Boolean = false) {
  blogPostCollection(preview: $preview, limit: 1, where: {slug: $slug}) {
    items {
      ...BlogPostCard
      metaDescription
      ctaHeading
      ctaBody
      ctaLabel
      body {
        json
        links {
          assets {
            block {
              ...AssetFields
              title
              description
            }
            hyperlink {
              ...AssetFields
            }
          }
        }
      }
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment BlogPostCard on BlogPost {
  __typename
  sys {
    id
  }
  title
  slug
  excerpt
  date
  author
  readingMinutes
  thumbnailAltText
  thumbnailCaption
  thumbnail {
    ...AssetFields
  }
}`) as unknown as TypedDocumentString<BlogPostBySlugQuery, BlogPostBySlugQueryVariables>;
export const PlantCollectionDocument = new TypedDocumentString(`
    query PlantCollection($preview: Boolean = false, $limit: Int = 100) {
  plantCollection(preview: $preview, limit: $limit, order: [order_ASC]) {
    total
    items {
      ...PlantCard
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment PlantCard on Plant {
  __typename
  sys {
    id
  }
  commonName
  latinName
  lightTag
  waterTag
  isNative
  featured
  order
  photoAltText
  photoCaption
  photo {
    ...AssetFields
  }
}`) as unknown as TypedDocumentString<PlantCollectionQuery, PlantCollectionQueryVariables>;
export const FeaturedPlantCollectionDocument = new TypedDocumentString(`
    query FeaturedPlantCollection($preview: Boolean = false, $limit: Int = 6) {
  plantCollection(
    preview: $preview
    limit: $limit
    where: {featured: true}
    order: [order_ASC]
  ) {
    total
    items {
      ...PlantCard
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment PlantCard on Plant {
  __typename
  sys {
    id
  }
  commonName
  latinName
  lightTag
  waterTag
  isNative
  featured
  order
  photoAltText
  photoCaption
  photo {
    ...AssetFields
  }
}`) as unknown as TypedDocumentString<FeaturedPlantCollectionQuery, FeaturedPlantCollectionQueryVariables>;
export const ProjectCollectionDocument = new TypedDocumentString(`
    query ProjectCollection($preview: Boolean = false, $limit: Int = 100) {
  projectCollection(preview: $preview, limit: $limit, order: [date_DESC]) {
    total
    items {
      ...ProjectCard
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment ProjectCard on Project {
  __typename
  sys {
    id
  }
  title
  slug
  caption
  location
  date
  beforeImageAltText
  beforeImageCaption
  beforeImage {
    ...AssetFields
  }
  afterImageAltText
  afterImageCaption
  afterImage {
    ...AssetFields
  }
}`) as unknown as TypedDocumentString<ProjectCollectionQuery, ProjectCollectionQueryVariables>;
export const ProjectBySlugDocument = new TypedDocumentString(`
    query ProjectBySlug($slug: String!, $preview: Boolean = false) {
  projectCollection(preview: $preview, limit: 1, where: {slug: $slug}) {
    items {
      ...ProjectCard
      summary
      metaDescription
      leadImageAltText
      leadImageCaption
      leadImage {
        ...AssetFields
      }
      ctaHeading
      ctaBody
      ctaLabel
      body {
        json
        links {
          assets {
            block {
              ...AssetFields
              title
              description
            }
            hyperlink {
              ...AssetFields
            }
          }
        }
      }
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment ProjectCard on Project {
  __typename
  sys {
    id
  }
  title
  slug
  caption
  location
  date
  beforeImageAltText
  beforeImageCaption
  beforeImage {
    ...AssetFields
  }
  afterImageAltText
  afterImageCaption
  afterImage {
    ...AssetFields
  }
}`) as unknown as TypedDocumentString<ProjectBySlugQuery, ProjectBySlugQueryVariables>;
export const ServiceCollectionDocument = new TypedDocumentString(`
    query ServiceCollection($preview: Boolean = false) {
  serviceCollection(preview: $preview, limit: 12, order: [order_ASC]) {
    total
    items {
      ...ServiceCard
    }
  }
}
    fragment ServiceCard on Service {
  __typename
  sys {
    id
  }
  name
  slug
  summary
  iconKey
  order
}`) as unknown as TypedDocumentString<ServiceCollectionQuery, ServiceCollectionQueryVariables>;
export const ServiceBySlugDocument = new TypedDocumentString(`
    query ServiceBySlug($slug: String!, $preview: Boolean = false) {
  serviceCollection(preview: $preview, limit: 1, where: {slug: $slug}) {
    items {
      ...ServiceCard
      intro
      metaTitle
      metaDescription
      ctaHeading
      ctaBody
      body {
        json
        links {
          assets {
            block {
              ...AssetFields
              title
              description
            }
            hyperlink {
              ...AssetFields
            }
          }
        }
      }
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}
fragment ServiceCard on Service {
  __typename
  sys {
    id
  }
  name
  slug
  summary
  iconKey
  order
}`) as unknown as TypedDocumentString<ServiceBySlugQuery, ServiceBySlugQueryVariables>;
export const SiteSettingsDocument = new TypedDocumentString(`
    query SiteSettings($preview: Boolean = false) {
  siteSettingsCollection(preview: $preview, limit: 1) {
    items {
      __typename
      sys {
        id
      }
      internalName
      heroImageDesktopAltText
      heroImageDesktopCaption
      heroImageDesktop {
        ...AssetFields
      }
      heroImageMobileAltText
      heroImageMobileCaption
      heroImageMobile {
        ...AssetFields
      }
      portraitAltText
      portraitCaption
      portrait {
        ...AssetFields
      }
    }
  }
}
    fragment AssetFields on Asset {
  sys {
    id
  }
  url
  width
  height
  contentType
}`) as unknown as TypedDocumentString<SiteSettingsQuery, SiteSettingsQueryVariables>;
export const TestimonialCollectionDocument = new TypedDocumentString(`
    query TestimonialCollection($preview: Boolean = false, $limit: Int = 20) {
  testimonialCollection(preview: $preview, limit: $limit, order: [order_ASC]) {
    total
    items {
      ...TestimonialFields
    }
  }
}
    fragment TestimonialFields on Testimonial {
  __typename
  sys {
    id
  }
  quote
  attribution
  town
  order
}`) as unknown as TypedDocumentString<TestimonialCollectionQuery, TestimonialCollectionQueryVariables>;