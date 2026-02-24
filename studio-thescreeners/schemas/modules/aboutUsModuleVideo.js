export default {
    name: "aboutUsModuleVideo",
    title: "About Us - Video (Video Wrapper)",
    type: "object",
    fields: [
        {
            name: 'video',
            title: 'Video File',
            type: 'file',
            options: {
                accept: 'video/*'
            },
            description: 'Video file: Cinematic format (wide aspect ratio). Recommended dimensions: 2560x1080 or similar wide format. Maximum file size: 50MB. Supported formats: MP4, WebM, MOV.',
            fields: [
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'object',
                    fields: [
                        { name: "en", title: "English", type: "string" },
                        { name: "de", title: "German", type: "string" },
                    ],
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'posterImage',
            title: 'Poster Image',
            type: 'image',
            description: 'Thumbnail image shown before video plays. Cinematic format (wide aspect ratio).',
            options: {
                hotspot: true
            },
            fields: [
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'object',
                    fields: [
                        { name: "en", title: "English", type: "string" },
                        { name: "de", title: "German", type: "string" },
                    ],
                }
            ]
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
        }
    ],
    preview: {
        select: {
            video: 'video',
            media: 'posterImage'
        },
        prepare({ video, media }) {
            const fileName = video?.asset?.originalFilename || 'No video'
            return {
                title: "Video (Video Wrapper)",
                subtitle: fileName,
                media: media
            }
        }
    }
}
