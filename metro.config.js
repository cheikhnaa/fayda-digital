const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configuration pour supporter les assets et les modules natifs sur web
config.resolver.assetExts.push(
  'mp3',
  'mp4',
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg'
);

module.exports = config;

