import type { MDXComponents } from "mdx/types"

// Helper function to create MDX components with custom overrides
export function createMDXComponents(customComponents: MDXComponents | (() => MDXComponents)): (components: MDXComponents) => MDXComponents {
  return (components: MDXComponents) => ({
    ...components,
    ...(typeof customComponents === 'function' ? customComponents() : customComponents)
  })
}