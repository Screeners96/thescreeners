// Global heading manager to track and control h1 elements across the entire page
class HeadingManager {
  constructor() {
    this.h1Rendered = false
    this.exceptions = new Set()
    this.initialized = false
  }

  // Initialize by checking if h1 already exists on the page
  initialize() {
    if (this.initialized) return

    // Check if there's already an h1 on the page
    const existingH1 = document.querySelector("h1")
    if (existingH1) {
      this.h1Rendered = true
      console.log("HeadingManager: Found existing h1 on page, preventing additional h1 elements")
    }

    this.initialized = true
  }

  // Check if we can render an h1
  canRenderH1(componentId) {
    // Initialize on first use
    this.initialize()

    // If there's a specific exception for this component, allow it
    if (componentId && this.exceptions.has(componentId)) {
      console.log(`HeadingManager: Allowing h1 for exception component: ${componentId}`)
      return true
    }

    // Otherwise, only allow if no h1 has been rendered yet
    if (!this.h1Rendered) {
      this.h1Rendered = true
      console.log("HeadingManager: Allowing first h1 element")
      return true
    }

    console.log("HeadingManager: Converting h1 to h2 (h1 already exists)")
    return false
  }

  // Add an exception for a specific component
  addException(componentId) {
    this.exceptions.add(componentId)
    console.log(`HeadingManager: Added exception for component: ${componentId}`)
  }

  // Remove an exception
  removeException(componentId) {
    this.exceptions.delete(componentId)
    console.log(`HeadingManager: Removed exception for component: ${componentId}`)
  }

  // Reset the manager (useful for page navigation)
  reset() {
    this.h1Rendered = false
    this.exceptions.clear()
    this.initialized = false
    console.log("HeadingManager: Reset all state")
  }

  // Force set that h1 has been rendered (useful if you have a manual h1)
  setH1Rendered(rendered = true) {
    this.h1Rendered = rendered
    console.log(`HeadingManager: Manually set h1Rendered to ${rendered}`)
  }

  // Get current state for debugging
  getState() {
    return {
      h1Rendered: this.h1Rendered,
      exceptions: Array.from(this.exceptions),
      initialized: this.initialized,
    }
  }
}

// Global instance
export const headingManager = new HeadingManager()
