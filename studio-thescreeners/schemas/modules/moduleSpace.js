export default {
    name: "moduleSpace",
    title: "Module Space",
    type: "object",
    fields: [
        {
            name: 'height',
            title: 'Height',
            type: 'number',
            description: 'Height in pixels'
        },
        {
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            description: 'CSS color value (e.g., #000000, white, transparent)',
            initialValue: 'transparent'
        },
    ],
    preview: {
        select: {
            h: 'height',
            bg: 'backgroundColor'
        },
        prepare({h, bg}) {
            return {
                title: "Space",
                subtitle: `${h || 0}px${bg ? ` - ${bg}` : ''}`
            }
        }
    }
}