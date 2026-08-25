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
  /**
   * Snapshot of the Contentful GraphQL Content Delivery schema for this space.
   *
   * Contentful generates this schema from the content model in
   * `contentful/migrations/001-initial-content-model.cjs`. The snapshot exists so
   * that codegen — and therefore every type the app is built against — works before
   * the space exists, and so that schema drift is a reviewable diff rather than a
   * runtime surprise.
   *
   * Keeping it honest: once real credentials land, run
   *
   *     CONTENTFUL_SCHEMA_FROM_API=1 npm run codegen
   *
   * which introspects the live endpoint instead. Any difference between the live
   * schema and this file shows up immediately as a codegen or typecheck failure.
   *
   * Only the subset the app actually queries is modelled. Required model fields are
   * non-null here, matching how Contentful marks them; optional fields stay nullable
   * — which is exactly what makes the "before image absent" case (a documented
   * acceptance criterion) impossible to forget.
   */
  DateTime: { input: string; output: string; }
  Dimension: { input: number; output: number; }
  HexColor: { input: string; output: string; }
  JSON: { input: unknown; output: unknown; }
  Quality: { input: number; output: number; }
};

export type Asset = {
  __typename?: 'Asset';
  contentType: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  fileName: Maybe<Scalars['String']['output']>;
  height: Maybe<Scalars['Int']['output']>;
  size: Maybe<Scalars['Int']['output']>;
  sys: Sys;
  title: Maybe<Scalars['String']['output']>;
  url: Maybe<Scalars['String']['output']>;
  width: Maybe<Scalars['Int']['output']>;
};


export type AssetUrlArgs = {
  transform?: InputMaybe<ImageTransformOptions>;
};

export type BlogPost = {
  __typename?: 'BlogPost';
  author: Scalars['String']['output'];
  body: BlogPostBody;
  ctaBody: Maybe<Scalars['String']['output']>;
  ctaHeading: Maybe<Scalars['String']['output']>;
  ctaLabel: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTime']['output'];
  excerpt: Scalars['String']['output'];
  metaDescription: Maybe<Scalars['String']['output']>;
  readingMinutes: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  sys: Sys;
  thumbnail: Asset;
  thumbnailAltText: Scalars['String']['output'];
  thumbnailCaption: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
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

export type BlogPostBodyLinks = {
  __typename?: 'BlogPostBodyLinks';
  assets: BlogPostBodyAssets;
};

export type BlogPostCollection = {
  __typename?: 'BlogPostCollection';
  items: Array<Maybe<BlogPost>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type BlogPostFilter = {
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type BlogPostOrder =
  | 'date_ASC'
  | 'date_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'title_ASC'
  | 'title_DESC';

export type ImageFormat =
  | 'AVIF'
  | 'JPG'
  | 'JPG_PROGRESSIVE'
  | 'PNG'
  | 'PNG8'
  | 'WEBP';

export type ImageResizeFocus =
  | 'BOTTOM'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT'
  | 'CENTER'
  | 'FACE'
  | 'FACES'
  | 'LEFT'
  | 'RIGHT'
  | 'TOP'
  | 'TOP_LEFT'
  | 'TOP_RIGHT';

export type ImageResizeStrategy =
  | 'CROP'
  | 'FILL'
  | 'FIT'
  | 'PAD'
  | 'SCALE'
  | 'THUMB';

export type ImageTransformOptions = {
  backgroundColor?: InputMaybe<Scalars['HexColor']['input']>;
  cornerRadius?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<ImageFormat>;
  height?: InputMaybe<Scalars['Dimension']['input']>;
  quality?: InputMaybe<Scalars['Quality']['input']>;
  resizeFocus?: InputMaybe<ImageResizeFocus>;
  resizeStrategy?: InputMaybe<ImageResizeStrategy>;
  width?: InputMaybe<Scalars['Dimension']['input']>;
};

export type Plant = {
  __typename?: 'Plant';
  commonName: Scalars['String']['output'];
  featured: Scalars['Boolean']['output'];
  isNative: Scalars['Boolean']['output'];
  latinName: Scalars['String']['output'];
  lightTag: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  photo: Asset;
  photoAltText: Scalars['String']['output'];
  photoCaption: Maybe<Scalars['String']['output']>;
  sys: Sys;
  waterTag: Scalars['String']['output'];
};

export type PlantCollection = {
  __typename?: 'PlantCollection';
  items: Array<Maybe<Plant>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PlantFilter = {
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  isNative?: InputMaybe<Scalars['Boolean']['input']>;
  lightTag?: InputMaybe<Scalars['String']['input']>;
  lightTag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
  waterTag?: InputMaybe<Scalars['String']['input']>;
  waterTag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlantOrder =
  | 'commonName_ASC'
  | 'commonName_DESC'
  | 'order_ASC'
  | 'order_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC';

export type Project = {
  __typename?: 'Project';
  afterImage: Asset;
  afterImageAltText: Scalars['String']['output'];
  afterImageCaption: Maybe<Scalars['String']['output']>;
  beforeImage: Maybe<Asset>;
  beforeImageAltText: Maybe<Scalars['String']['output']>;
  beforeImageCaption: Maybe<Scalars['String']['output']>;
  body: Maybe<ProjectBody>;
  caption: Scalars['String']['output'];
  ctaBody: Maybe<Scalars['String']['output']>;
  ctaHeading: Maybe<Scalars['String']['output']>;
  ctaLabel: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTime']['output'];
  leadImage: Maybe<Asset>;
  leadImageAltText: Maybe<Scalars['String']['output']>;
  leadImageCaption: Maybe<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  metaDescription: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  summary: Maybe<Scalars['String']['output']>;
  sys: Sys;
  title: Scalars['String']['output'];
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

export type ProjectBodyLinks = {
  __typename?: 'ProjectBodyLinks';
  assets: ProjectBodyAssets;
};

export type ProjectCollection = {
  __typename?: 'ProjectCollection';
  items: Array<Maybe<Project>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ProjectFilter = {
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ProjectOrder =
  | 'date_ASC'
  | 'date_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC'
  | 'title_ASC'
  | 'title_DESC';

export type Query = {
  __typename?: 'Query';
  blogPostCollection: Maybe<BlogPostCollection>;
  plantCollection: Maybe<PlantCollection>;
  projectCollection: Maybe<ProjectCollection>;
  serviceCollection: Maybe<ServiceCollection>;
  siteSettingsCollection: Maybe<SiteSettingsCollection>;
  testimonialCollection: Maybe<TestimonialCollection>;
};


export type QueryBlogPostCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<BlogPostOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BlogPostFilter>;
};


export type QueryPlantCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<PlantOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlantFilter>;
};


export type QueryProjectCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<ProjectOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectFilter>;
};


export type QueryServiceCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<ServiceOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ServiceFilter>;
};


export type QuerySiteSettingsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiteSettingsFilter>;
};


export type QueryTestimonialCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<InputMaybe<TestimonialOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TestimonialFilter>;
};

export type Service = {
  __typename?: 'Service';
  body: Maybe<ServiceBody>;
  ctaBody: Maybe<Scalars['String']['output']>;
  ctaHeading: Maybe<Scalars['String']['output']>;
  iconKey: Scalars['String']['output'];
  intro: Scalars['String']['output'];
  metaDescription: Maybe<Scalars['String']['output']>;
  metaTitle: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  summary: Scalars['String']['output'];
  sys: Sys;
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

export type ServiceBodyLinks = {
  __typename?: 'ServiceBodyLinks';
  assets: ServiceBodyAssets;
};

export type ServiceCollection = {
  __typename?: 'ServiceCollection';
  items: Array<Maybe<Service>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ServiceFilter = {
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ServiceOrder =
  | 'name_ASC'
  | 'name_DESC'
  | 'order_ASC'
  | 'order_DESC';

export type SiteSettings = {
  __typename?: 'SiteSettings';
  heroImageDesktop: Asset;
  heroImageDesktopAltText: Scalars['String']['output'];
  heroImageDesktopCaption: Maybe<Scalars['String']['output']>;
  heroImageMobile: Asset;
  heroImageMobileAltText: Scalars['String']['output'];
  heroImageMobileCaption: Maybe<Scalars['String']['output']>;
  internalName: Scalars['String']['output'];
  portrait: Asset;
  portraitAltText: Scalars['String']['output'];
  portraitCaption: Maybe<Scalars['String']['output']>;
  sys: Sys;
};

export type SiteSettingsCollection = {
  __typename?: 'SiteSettingsCollection';
  items: Array<Maybe<SiteSettings>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type SiteSettingsFilter = {
  sys?: InputMaybe<SysFilter>;
};

export type Sys = {
  __typename?: 'Sys';
  environmentId: Scalars['String']['output'];
  firstPublishedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  publishedVersion: Maybe<Scalars['Int']['output']>;
  spaceId: Scalars['String']['output'];
};

export type SysFilter = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  publishedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Testimonial = {
  __typename?: 'Testimonial';
  attribution: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  quote: Scalars['String']['output'];
  sys: Sys;
  town: Scalars['String']['output'];
};

export type TestimonialCollection = {
  __typename?: 'TestimonialCollection';
  items: Array<Maybe<Testimonial>>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TestimonialFilter = {
  sys?: InputMaybe<SysFilter>;
};

export type TestimonialOrder =
  | 'order_ASC'
  | 'order_DESC'
  | 'sys_publishedAt_ASC'
  | 'sys_publishedAt_DESC';

export type BlogPostCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BlogPostCollectionQuery = { __typename?: 'Query', blogPostCollection: { __typename?: 'BlogPostCollection', total: number, items: Array<{ __typename: 'BlogPost', title: string, slug: string, excerpt: string, date: string, author: string, readingMinutes: number, thumbnailAltText: string, thumbnailCaption: string | null, sys: { __typename?: 'Sys', id: string }, thumbnail: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type BlogPostBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type BlogPostBySlugQuery = { __typename?: 'Query', blogPostCollection: { __typename?: 'BlogPostCollection', items: Array<{ __typename: 'BlogPost', metaDescription: string | null, ctaHeading: string | null, ctaBody: string | null, ctaLabel: string | null, title: string, slug: string, excerpt: string, date: string, author: string, readingMinutes: number, thumbnailAltText: string, thumbnailCaption: string | null, body: { __typename?: 'BlogPostBody', json: unknown, links: { __typename?: 'BlogPostBodyLinks', assets: { __typename?: 'BlogPostBodyAssets', block: Array<{ __typename?: 'Asset', title: string | null, description: string | null, url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null>, hyperlink: Array<{ __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null> } } }, sys: { __typename?: 'Sys', id: string }, thumbnail: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type AssetFieldsFragment = { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } };

export type PlantCardFragment = { __typename: 'Plant', commonName: string, latinName: string, lightTag: string, waterTag: string, isNative: boolean, featured: boolean, order: number, photoAltText: string, photoCaption: string | null, sys: { __typename?: 'Sys', id: string }, photo: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } };

export type ProjectCardFragment = { __typename: 'Project', title: string, slug: string, caption: string, location: string, date: string, beforeImageAltText: string | null, beforeImageCaption: string | null, afterImageAltText: string, afterImageCaption: string | null, sys: { __typename?: 'Sys', id: string }, beforeImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, afterImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } };

export type BlogPostCardFragment = { __typename: 'BlogPost', title: string, slug: string, excerpt: string, date: string, author: string, readingMinutes: number, thumbnailAltText: string, thumbnailCaption: string | null, sys: { __typename?: 'Sys', id: string }, thumbnail: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } };

export type TestimonialFieldsFragment = { __typename: 'Testimonial', quote: string, attribution: string, town: string, order: number, sys: { __typename?: 'Sys', id: string } };

export type ServiceCardFragment = { __typename: 'Service', name: string, slug: string, summary: string, iconKey: string, order: number, sys: { __typename?: 'Sys', id: string } };

export type PlantCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PlantCollectionQuery = { __typename?: 'Query', plantCollection: { __typename?: 'PlantCollection', total: number, items: Array<{ __typename: 'Plant', commonName: string, latinName: string, lightTag: string, waterTag: string, isNative: boolean, featured: boolean, order: number, photoAltText: string, photoCaption: string | null, sys: { __typename?: 'Sys', id: string }, photo: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type FeaturedPlantCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FeaturedPlantCollectionQuery = { __typename?: 'Query', plantCollection: { __typename?: 'PlantCollection', total: number, items: Array<{ __typename: 'Plant', commonName: string, latinName: string, lightTag: string, waterTag: string, isNative: boolean, featured: boolean, order: number, photoAltText: string, photoCaption: string | null, sys: { __typename?: 'Sys', id: string }, photo: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type ProjectCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProjectCollectionQuery = { __typename?: 'Query', projectCollection: { __typename?: 'ProjectCollection', total: number, items: Array<{ __typename: 'Project', title: string, slug: string, caption: string, location: string, date: string, beforeImageAltText: string | null, beforeImageCaption: string | null, afterImageAltText: string, afterImageCaption: string | null, sys: { __typename?: 'Sys', id: string }, beforeImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, afterImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type ProjectBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ProjectBySlugQuery = { __typename?: 'Query', projectCollection: { __typename?: 'ProjectCollection', items: Array<{ __typename: 'Project', summary: string | null, metaDescription: string | null, leadImageAltText: string | null, leadImageCaption: string | null, ctaHeading: string | null, ctaBody: string | null, ctaLabel: string | null, title: string, slug: string, caption: string, location: string, date: string, beforeImageAltText: string | null, beforeImageCaption: string | null, afterImageAltText: string, afterImageCaption: string | null, leadImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, body: { __typename?: 'ProjectBody', json: unknown, links: { __typename?: 'ProjectBodyLinks', assets: { __typename?: 'ProjectBodyAssets', block: Array<{ __typename?: 'Asset', title: string | null, description: string | null, url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null>, hyperlink: Array<{ __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null> } } } | null, sys: { __typename?: 'Sys', id: string }, beforeImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null, afterImage: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type ServiceCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ServiceCollectionQuery = { __typename?: 'Query', serviceCollection: { __typename?: 'ServiceCollection', total: number, items: Array<{ __typename: 'Service', name: string, slug: string, summary: string, iconKey: string, order: number, sys: { __typename?: 'Sys', id: string } } | null> } | null };

export type ServiceBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ServiceBySlugQuery = { __typename?: 'Query', serviceCollection: { __typename?: 'ServiceCollection', items: Array<{ __typename: 'Service', intro: string, metaTitle: string | null, metaDescription: string | null, ctaHeading: string | null, ctaBody: string | null, name: string, slug: string, summary: string, iconKey: string, order: number, body: { __typename?: 'ServiceBody', json: unknown, links: { __typename?: 'ServiceBodyLinks', assets: { __typename?: 'ServiceBodyAssets', block: Array<{ __typename?: 'Asset', title: string | null, description: string | null, url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null>, hyperlink: Array<{ __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } | null> } } } | null, sys: { __typename?: 'Sys', id: string } } | null> } | null };

export type SiteSettingsQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SiteSettingsQuery = { __typename?: 'Query', siteSettingsCollection: { __typename?: 'SiteSettingsCollection', items: Array<{ __typename: 'SiteSettings', internalName: string, heroImageDesktopAltText: string, heroImageDesktopCaption: string | null, heroImageMobileAltText: string, heroImageMobileCaption: string | null, portraitAltText: string, portraitCaption: string | null, sys: { __typename?: 'Sys', id: string }, heroImageDesktop: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } }, heroImageMobile: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } }, portrait: { __typename?: 'Asset', url: string | null, width: number | null, height: number | null, contentType: string | null, sys: { __typename?: 'Sys', id: string } } } | null> } | null };

export type TestimonialCollectionQueryVariables = Exact<{
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TestimonialCollectionQuery = { __typename?: 'Query', testimonialCollection: { __typename?: 'TestimonialCollection', total: number, items: Array<{ __typename: 'Testimonial', quote: string, attribution: string, town: string, order: number, sys: { __typename?: 'Sys', id: string } } | null> } | null };

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