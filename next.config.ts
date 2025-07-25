const nextConfig = {
  // Untuk development saja
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  
  // Tambahkan ini untuk handle GLB files
  webpack: (config: any, { buildId, dev, isServer, defaultLoaders, webpack }: { buildId: any, dev: any, isServer: any, defaultLoaders: any, webpack: any }) => {
    // Handle GLB/GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/models/',
          outputPath: 'static/models/',
          esModule: false,
          
        },
      },
    });

    return config;
  },
}

export default nextConfig