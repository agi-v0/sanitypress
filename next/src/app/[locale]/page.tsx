import { fetchSanity, groq } from '@/lib/sanity/fetch'
import { modulesQuery } from '@/lib/sanity/queries'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'

export default async function Page({
	params: { locale },
}: {
	params: { locale: string }
}) {
	const page = await getPage(locale)

	return <Modules modules={page?.modules} />
}

export async function generateMetadata({
	params: {locale},
}: {
	params: {locale: string}
}) {
	const page = await getPage(locale)
	return processMetadata(page)
}

async function getPage(locale: string) {
	console.log("my local is ",locale)
	const page = await fetchSanity<Sanity.Page>(
		groq`*[_type == 'page' && metadata.slug.current == "${locale}" ][0]{
			...,
			modules[]{ ${modulesQuery} },
			metadata {
				...,
				'ogimage': image.asset->url
			}
		}`,{
			tags: ['homepage'],
		},
	)

	if (!page)
		throw new Error(
			"Missing 'page' document with metadata.slug 'index' in Sanity Studio",
		)

	return page
}
