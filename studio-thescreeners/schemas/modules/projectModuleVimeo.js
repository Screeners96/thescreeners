export default {
    name: "projectModuleVimeo",
    title: "Project Vimeo",
    type: "object",
    fields: [
        {
            name: 'vimeoUrl',
            title: 'Vimeo URL',
            type: 'url',
            description: 'Full Vimeo URL (e.g., https://vimeo.com/123456789 or https://vimeo.com/123456789?h=abc123)',
            validation: Rule => Rule.required().uri({
                scheme: ['https'],
                allowRelative: false
            }).custom((url) => {
                if (!url) return true
                const vimeoPattern = /^https?:\/\/(www\.)?(vimeo\.com|player\.vimeo\.com)/
                return vimeoPattern.test(url) || 'Please enter a valid Vimeo URL'
            })
        },
        {
            name: 'vimeoId',
            title: 'Vimeo Video ID',
            type: 'string',
            description: 'Auto-extracted from URL, or enter manually (e.g., 123456789)',
            validation: Rule => Rule.regex(/^\d+$/, {
                name: 'vimeoId',
                invert: false
            }).error('Please enter a valid Vimeo video ID (numbers only)')
        },
        {
            name: 'autoplay',
            title: 'Autoplay',
            type: 'boolean',
            initialValue: false,
            description: 'Automatically play video when loaded'
        },
        {
            name: 'loop',
            title: 'Loop',
            type: 'boolean',
            initialValue: false,
            description: 'Loop video continuously'
        },
        {
            name: 'muted',
            title: 'Muted',
            type: 'boolean',
            initialValue: true,
            description: 'Play video without sound (required for autoplay in most browsers)'
        },
        {
            name: 'alt',
            title: 'Alt Text',
            type: 'object',
            description: 'Description of the video content for accessibility',
            fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
            ],
        }
    ],
    preview: {
        select: {
            vimeoUrl: 'vimeoUrl',
            vimeoId: 'vimeoId',
            media: 'posterImage'
        },
        prepare({ vimeoUrl, vimeoId, media }) {
            const id = vimeoId || (vimeoUrl ? vimeoUrl.match(/\/(\d+)/)?.[1] : null)
            return {
                title: "Project Vimeo",
                subtitle: id ? `Vimeo ID: ${id}` : 'No Vimeo ID',
                media: media
            }
        }
    }
}
