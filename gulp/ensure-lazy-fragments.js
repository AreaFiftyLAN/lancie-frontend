'use strict';

const Analyzer = require('polymer-analyzer').Analyzer;
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver = require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;
const HtmlCustomElementReferenceScanner = require('polymer-analyzer/lib/html/html-element-reference-scanner').HtmlCustomElementReferenceScanner;
const dom5 = require('dom5');
const fragments = require('./polymer.json').fragments;

const analyzer = new Analyzer({
  urlLoader: new FSUrlLoader('./'),
  urlResolver: new PackageUrlResolver(),
  scanners: new Map([['html', [new HtmlCustomElementReferenceScanner()]]])
});

module.exports = () => new Promise((resolve, reject) => {
  analyzer.analyze('src/lancie-content.html')
  .then((document) => {
    for (const element of document.getByKind('element-reference')) {
      const astNode = element.astNode;
      if (astNode.parentNode.tagName === 'iron-lazy-pages') {
        const childLocation = dom5.getAttribute(astNode, 'data-path');
        if (!fragments.find(e => e === `src/${childLocation}`)) {
          reject(`Could not find fragment "src/${childLocation}" in polymer.json!`);
          return;
        }
      }
    }
    resolve();
  });
});
