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
    const manifest = {};

  }
}

module.exports = ChunkPlugin;
