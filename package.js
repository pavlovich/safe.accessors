// package metadata file for Meteor.js

Package.describe({
  name: 'safe.accessors:safe.accessors',
  summary: 'safe.accessors (official): Safely get and set attribute values and execute functions.',
  version: '1.0.1',
  git: 'https://github.com/pavlovich/safe.accessors.git',
  documentation: 'README.markdown'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.addFiles(['dist/safe.accessors.js']);
  api.export("sa");
});
