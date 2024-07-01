import { defineConfig } from 'sanity'
import { BASE_URL, projectId } from './src/env'
import { structureTool } from 'sanity/structure'
import structure from './src/structure'
import { locations } from './src/presentation'
import { presentationTool } from 'sanity/presentation'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { vercelWidget } from 'sanity-plugin-dashboard-widget-vercel'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemas'
import { documentInternationalization } from '@sanity/document-internationalization'

const singletonTypes = ['site']

export default defineConfig({
	name: 'default',
	title: 'SanityPress',

	projectId: "vjcvvsga",
	dataset: 'random-testing',

	plugins: [
		structureTool({
			title: 'Content',
			structure,
		}),
		presentationTool({
			title: 'Editor',
			previewUrl: {
				draftMode: {
					enable: `${BASE_URL}/api/draft`,
				},
			},
			resolve: { locations },
		}),
		dashboardTool({
			title: 'Deployment',
			widgets: [projectInfoWidget(), projectUsersWidget(), vercelWidget()],
		}),
		visionTool({ title: 'GROQ' }),
		codeInput(),
		documentInternationalization({
			// Required configuration
			supportedLanguages: [
				{ id: 'ar', title: 'Arabic' },
				{ id: 'en', title: 'English' }
			],
			schemaTypes: ['site', 'page'],
		})
	],

	scheduledPublishing: {
		enabled: false,
	},

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(
				({ schemaType }) => !singletonTypes.includes(schemaType),
			),
	},

	document: {
		actions: (input, { schemaType }) =>
			singletonTypes.includes(schemaType)
				? input.filter(
					({ action }) =>
						action &&
						['publish', 'discardChanges', 'restore'].includes(action),
				)
				: input,
	},
})
