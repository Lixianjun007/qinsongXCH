require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/user/user');
require('../../pages/myorder/myorder');
require('../../pages/paytips/paytips');
require('../../pages/agreement/agreement');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
