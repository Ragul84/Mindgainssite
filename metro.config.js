const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require(path.join(__dirname, 'node_modules', 'metro-config', 'src', 'defaults', 'exclusionList')).default;

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

const ignorePaths = [
  path.join(__dirname, 'bot', 'venv'),
  path.join(__dirname, 'bot', 'venv_wsl'),
  path.join(__dirname, 'bot', '__pycache__'),
  path.join(__dirname, 'bot', 'uploads'),
  path.join(__dirname, 'bot', 'chroma_db')
].map((p) => new RegExp(p.replace(/[/\\]/g, '\\\\') + '.*'));

config.resolver = {
  ...resolver,
  assetExts: [
    ...resolver.assetExts.filter((ext) => ext !== 'svg'),
    'moc3',
    'model3',
    'physics3',
    'cdi3',
    'exp3',
  ],
  sourceExts: [...resolver.sourceExts, 'svg'],
  alias: {
    'react-native/Libraries/Utilities/LoadingView': require.resolve('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator'),
  },
  blockList: exclusionList(ignorePaths),
  extraNodeModules: {
  }
};

// Web-specific fixes
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Fix MIME type for JS bundles
      if (req.url && req.url.includes('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
