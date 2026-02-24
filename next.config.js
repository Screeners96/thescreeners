module.exports = {
    // Exclude API routes from static generation
    excludeDefaultMomentLocales: true,
    trailingSlash: false,
    reactStrictMode: true,
    
    // This is the important part
    exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
      // Remove API routes from static export
      const pathMap = { ...defaultPathMap };
      Object.keys(pathMap).forEach(path => {
        if (path.includes('/api/')) {
          delete pathMap[path];
        }
      });
      return pathMap;
    }
  }