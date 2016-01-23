// package metadata file for Meteor.js

Package.describe({
  name: 'safeaccessors:safe.accessors',
  summary: 'safe.accessors (official): Safely get and set attribute values and execute functions.',
  version: '1.0.9',
  git: 'https://github.com/pavlovich/safe.accessors.git',
  documentation: 'README.markdown'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('stevezhu:lodash@3.9.3');
  api.addFiles(['dist/safe.accessors.js']);
  api.export('sa');
  api.export('_');
  api.export('lodash');
});
