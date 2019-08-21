/*
* CONFIGURATION: ROUTER
* ____________________________________________________________________
* 1. Maps route paths to the handlers, PATH we get from the URL of the REQUEST
* ____________________________________________________________________
*/

// Depenedencies
const handlers = require('./handlers-config');

const router = {};

router.sample  = handlers.sample,
router.ping    = handlers.ping,
router.users   = handlers.users


module.exports = router;