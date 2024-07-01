import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'metadata',
	title: 'Metadata',
	type: 'object',
	fields: [
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: (doc: any) => doc.metadata.title || doc.name || doc.title,
				isUnique: isUniqueOtherThanLanguage
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.max(60).warning(),
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.max(160).warning(),
		}),
		defineField({
			name: 'image',
			description: 'Used for social sharing previews',
			type: 'image',
		}),
		defineField({
			name: 'noIndex',
			description: 'Prevent search engines from indexing this page.',
			type: 'boolean',
			initialValue: false,
		}),
	],
})
export async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document?.language) {
    return true
  }
  const client = getClient({apiVersion: '2023-04-24'})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  const result = await client.fetch(query, params)
  return result
}