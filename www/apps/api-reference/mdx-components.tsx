import type { MDXComponents } from "mdx/types"
import getCustomComponents from "./components/MDXComponents"
import { createMDXComponents } from "../shared/mdx-utils"

// This file is required to use MDX in `app` directory.
export const useMDXComponents = createMDXComponents(getCustomComponents)