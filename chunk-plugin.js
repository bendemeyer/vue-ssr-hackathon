const path = require('path');
const webpack = require('webpack');
const hash = require('hash-sum');

const PLUGIN_NAME = 'stats-plugin';

function stripModuleIdHash(id) {
  return id.replace(/\|\w+$/, '');
}

class ChunkPlugin {
  constructor() {
    //
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      if (compilation.compiler !== compiler) {
        // ignore child compilers
        return;
      }
      compilation.hooks.processAssets.tap({
        name: PLUGIN_NAME,
        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
      }, () => {
        this.buildStatsFile(compilation);
      });
    });
  }

  buildStatsFile(compilation) {
    const stats = compilation.getStats().toJson();
    const manifest = {};

    // 1. Chunk names for entrypoint chunk(s)
    manifest.initialChunks = stats.chunks.filter((chunk) => chunk.initial).map((chunk) => chunk.id);

    // 2. Map of which file(s) to load for each chunk
    //    Contains both JS, CSS, and any additional assets that should be preloaded
    manifest.chunkFilesMap = {};
    stats.chunks.forEach((chunk) => {
      const chunkFiles = chunk.files.concat(chunk.auxiliaryFiles);
      if (chunkFiles.length) {
        manifest.chunkFilesMap[chunk.id] = chunkFiles;
      }
    });

    // 3. Map of which modules exist in which chunk
    manifest.componentChunkMap = {};
    stats.modules.forEach((module) => {
      const id = stripModuleIdHash(module.identifier);
      // only vue files get tagged by vue-loader, and ignore the other sub-modules (per SFC block type) spun off by it
      if (id.includes('vue-loader') && !id.includes('type=')) {
        const hashId = hash(id); // IMPORTANT! same hashing as vue-loader
        manifest.componentChunkMap[hashId] = module.chunks;
      }
    });

    // 4. Tell webpack to write the manifest
    const manifestJson = JSON.stringify(manifest, null, 2);
    compilation.assets[`ssr-manifest.json`] = {
      source: () => manifestJson,
      size: () => manifestJson.length,
    };
  }
}

module.exports = ChunkPlugin;
