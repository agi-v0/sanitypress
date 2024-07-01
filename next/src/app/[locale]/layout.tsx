// import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/app.css'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export const metadata: Metadata = {
	icons: {
		icon: `https://fav.farm/🖤`,
	},
}

export default async function RootLayout({
	children,
	params: {locale}
}: {
	children: React.ReactNode;
	params: {locale: string};
}) {
	const messages = await getMessages();

	return (
		<html lang={locale}>
			{/* <GoogleTagManager gtmId='' /> */}

			<body className="bg-canvas text-ink">
				<NextIntlClientProvider messages={messages}>
				<SkipToContent />
				<Announcement />
				<Header />
				<main id="main-content" tabIndex={-1}>
					{children}
				</main>
				<Footer />

				<Analytics />
				<SpeedInsights />
				{draftMode().isEnabled && <VisualEditing />}
        </NextIntlClientProvider>
			</body>
		</html>
	)
}
