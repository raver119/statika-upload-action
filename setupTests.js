import {XMLHttpRequest} from 'w3c-xmlhttprequest'
const util = require('util')

global.XMLHttpRequest = XMLHttpRequest;

global.TextDecoder = util.TextDecoder
global.TextEncoder = util.TextEncoder