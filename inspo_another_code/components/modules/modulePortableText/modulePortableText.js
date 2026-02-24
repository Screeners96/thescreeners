import { PortableText } from '@portabletext/react'

const components = {
    marks: {

      link: ({value, children}) => {
        const target = (value?.url || '').startsWith('http') ? '_blank' : undefined
        return (
          <a href={value?.url || '#'} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
            {children}
          </a>
        )
      },
      

      emailLink: ({value, children}) => {
        const { email, subject } = value;
        const mailtoUrl = subject 
          ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
          : `mailto:${email}`;
        
        return (
          <a href={mailtoUrl}>{children}</a>
        );
      },
      

      internalLink: ({value, children}) => {
        if (!value?.reference) return <span>{children}</span>;
        
        const slug = value.reference.slug?.current;
        const docType = value.reference._type;
        
        const href = docType === 'page' 
          ? `/${slug || ''}` 
          : `/${docType}/${slug || ''}`;
        
        return <a href={href}>{children}</a>;
      }
    }
  }
  
  export default function ModulePortableText({ content, locale = 'en' }) {
    const localizedContent = content?.[locale] || content?.en || content;
    
    if (!localizedContent) return null;
    
    return (
      <div className="portable-text" data-readable="true">
        <PortableText value={localizedContent} components={components} />
      </div>
    );
  }