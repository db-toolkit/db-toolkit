/**
 * MDX Renderer Utility
 * Loads and renders MDX files from /data folder
 */
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export interface DocSection {
  heading: string;
  content: string;
}

export interface ParsedDoc {
  title: string;
  sections: DocSection[];
}

/**
 * Load and compile MDX file
 * @param {string} filename - MDX filename (e.g., 'getting-started.mdx')
 * @returns {Promise<string>} Compiled MDX code
 */
export async function loadMDX(filename: string) {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    
    const mdxSource = await response.text();
    
    const compiled = await compile(mdxSource, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
      outputFormat: 'function-body',
    });
    
    return String(compiled);
  } catch (error) {
    console.error('Error loading MDX:', error);
    throw error;
  }
}

/**
 * Parse MDX content and extract metadata
 * @param {string} mdxContent - Raw MDX content
 * @returns {Object} { title, sections }
 */
export function parseMDXContent(mdxContent: string): ParsedDoc {
  const lines = mdxContent.split('\n');
  const sections: DocSection[] = [];
  let currentSection: DocSection | null = null;
  let title = '';
  let preContent = '';
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentSection) {
        currentSection.content += line + '\n';
      } else {
        preContent += line + '\n';
      }
      continue;
    }

    if (!inCodeBlock) {
      if (line.startsWith('# ') && !title) {
        title = line.replace('# ', '').trim();
        continue;
      }

      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          heading: line.replace('## ', '').trim(),
          content: '',
        };
        continue;
      }
    }

    if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      preContent += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  const trimmedPre = preContent.trim();
  if (trimmedPre) {
    if (sections.length === 0) {
      sections.push({ heading: 'Overview', content: preContent });
    } else {
      sections[0].content = `${preContent}\n${sections[0].content}`.trimEnd() + '\n';
    }
  }

  return { title, sections };
}

/**
 * Get list of available MDX files
 * @returns {Array<Object>} List of documentation files
 */
export function getDocumentationFiles() {
  return [
    { id: 'getting-started', title: 'Getting Started', file: 'getting-started.mdx' },
    { id: 'connections', title: 'Connections', file: 'connections.mdx' },
    { id: 'query-editor', title: 'Query Editor', file: 'query-editor.mdx' },
    { id: 'data-explorer', title: 'Data Explorer', file: 'data-explorer.mdx' },
    { id: 'schema-explorer', title: 'Schema Explorer', file: 'schema-explorer.mdx' },
    { id: 'migrations', title: 'Migrations', file: 'migrations.mdx' },
    { id: 'backups', title: 'Backups', file: 'backups.mdx' },
    { id: 'settings', title: 'Settings', file: 'settings.mdx' },
    { id: 'workspaces', title: 'Workspaces', file: 'workspaces.mdx' },
    { id: 'documentation', title: 'SQL Reference', file: 'documentation.mdx' },
    { id: 'changelog', title: 'Changelog', file: 'changelog.mdx' },
  ];
}
