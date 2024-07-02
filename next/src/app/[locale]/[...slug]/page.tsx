import client from '@/lib/sanity/client'
import { fetchSanity, groq } from '@/lib/sanity/fetch'
import { modulesQuery } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'

export default async function Page({ params }: { params: { locale: string } }) {
	const page = await getPage({ params })
	if (!page) notFound()
	return <Modules modules={page?.modules} page={page} />
}

export async function generateMetadata({
	params,
}: {
	params: { locale: string }
}) {
	const page = await getPage({ params })
	if (!page) notFound()
	return processMetadata(page)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[
			_type == 'page' &&
			defined(metadata.slug.current) &&
			!(metadata.slug.current in ['index', '404'])
		].metadata.slug.current`,
	)

	return slugs.map((slug) => ({ slug: slug.split('/') }))
}

async function getPage({ params }: any) {
	return await fetchSanity<Sanity.Page>(
		groq`*[_type == 'page' &&
			metadata.slug.current == $slug && language == $locale &&
			!(metadata.slug.current in ['index', '404'])
		][0]{
			...,
			modules[]{ ${modulesQuery} },
			metadata {
				...,
				'ogimage': image.asset->url
			}
		}`,
		{
			params: { slug: params.slug?.join('/'), locale: params.locale },
			tags: ['pages'],
		},
	)
}

type Props = {
	params: { slug?: string[] }
}
