```
git clone git@github.com:AreaFiftyLAN/lancie-frontend.git
git submodule update --init
npm install
bower install
```

Still got submodules? We moved away from those. To fix: 

1. Checkout the branch
* Fix the git submodules. Presumably it should work on checkout. If not, remove all directories and `.gitmodules` and then `git reset --hard` while on the branch
* Move `bower_components` to `app/bower_components`
* Run `bower update`
* Run `npm install` and `npm update`
* Run `gulp serve:dist`
* Open the website in your browser (preferably Chrome)
* Enable throttling to various throttling levels (regular 4G, good 3G and regular 3G)
