import { TagIcon } from '@sanity/icons'
import { GRID, BASIC_BLOCK } from '../../constants'

export default {
    name: "trailerCategory",
    title: "Trailer Category",
    type: "document",
    icon: TagIcon,
    fields: [
        {
            name: 'title',
            title: 'Category Name',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
            ],
            description: 'The name of the category in English and German (e.g., "Kino", "TV", "Digital")',
            validation: Rule => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title.en',
                maxLength: 200,
                slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200)
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'bodyText',
            title: 'Body Text',
            type: "object",
            fields: [
                {
                    name: 'en',
                    title: 'English',
                    type: 'array',
                    of: [BASIC_BLOCK]
                },
                {
                    name: 'de',
                    title: 'German',
                    type: 'array',
                    of: [BASIC_BLOCK]
                },
            ],
            description: 'Intro text displayed for this category'
        },
        {
            title: "Grid",
            name: "grid",
            type: "array",
            of: GRID,
            description: 'Select projects to display in this category'
        }
    ],
    
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de'
        },
        prepare({ titleEn, titleDe }) {
            const title = titleEn || titleDe || 'Untitled Category'
            return {
                title: title
            }
        }
    }
}
