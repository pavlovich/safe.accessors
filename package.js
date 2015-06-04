// package metadata file for Meteor.js

Package.describe({
  name: 'safeaccessors:safeaccessors',
  summary: 'safeaccessors (official): Safely get and set attribute values and execute functions.',
  version: '1.0.0',
  git: 'https://github.com/pavlovich/safeaccessors.git',
  documentation: 'README.markdown'
});


Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.addFiles(['meteor-pre.js','dist/underscore.string.js','meteor-post.js']);
  api.export("s");
});