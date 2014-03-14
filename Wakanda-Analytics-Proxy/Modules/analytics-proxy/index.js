﻿/** * @module analytics-proxy **/var    BASE_PATH,    ANALYTICS_ID_REGEX,	pixel,	badge,	pageTemplate;BASE_PATH          = File(module.id).parent.path,pixel              = File(BASE_PATH + 'static/pixel.gif'),badge              = File(BASE_PATH + 'static/badge.gif'),analyticsTools = [];var googleAnalytics = require('./plugins/google-analytics');// currently hardcoded load of Google AnalyticsanalyticsTools.push(googleAnalytics);exports.start = function start() {    var        regex;    // currently hardcoded    //regex = '^/' + googleAnalytics.REGEX;    regex = [];    analyticsTools.forEach(function sendHit(tool) {        regex.push(tool.REGEX);    });    if (regex.length > 1) {        regex = '^/((' + regex.join(')|(') + '))';    } else {        regex = '^/' + regex;    }    regex = '^/\\bUA-\\d{4,10}-\\d{1,4}';	addHttpRequestHandler(regex, 'analytics-proxy', 'imageRequestHandler');};function generateCookie(name, value, path) {    var        cookie;        cookie = name + '=' + value;    if (path) {        cookie += ';path=' + path;    }        return cookie;}function getCookieValue(cookies, name) {    var        value;    if (!cookies || !cookies.length) {        return '';    }        cookies = cookies.split('\n');    cookies.some(function parseCookies(current) {        current = current.split('=');        if (current[0] !== name) {            return false;        }        value = current[1].split(';')[0];        return true;    });        return value;}exports.imageRequestHandler = function imageRequestHandler(request, response) {    var        accountID,        cookies,        cid,        referrer,        userAgent,        language,        Mustache;	if (request.urlQuery === 'test') {	    ds.HTTPRequest.createEntity({	        requestLine: request.requestLine,	        host: request.headers['HOST'],	        isSSL: request.isSSL,	        accept: request.headers['ACCEPT'],	        userAgent: request.headers['USER_AGENT'],	        acceptLanguage: request.headers['ACCEPT_LANGUAGE'],	        referrer: request.headers['REFERER']	    }).save();	    return badge.toBuffer().toBlob();	}		accountID = request.urlPath.split('/')[1];	response.headers["Cache-Control"] = "no-cache";		if (request.headers['ACCEPT'].split('/')[0] !== 'image') {    	// /account -> account template		response.contentType = 'text/html';		templateParams = {			account: accountID		};        pageTemplate = loadText(BASE_PATH + 'templates/page.html');        html = require('mustache').render(pageTemplate, templateParams);		return html;    }	// Select pixel or badge image based on presence of "pixel" param.    response.body = ((request.urlQuery === 'pixel') ? pixel : badge).toBuffer().toBlob();    referrer = request.headers["REFERER"];    if (!referrer) {        // request not coming from an online website        return;    }        userAgent = request.headers["User-Agent"];    // not perfect but usually enough (should check best quality)    language = request.headers["Accept-Language"].split(',')[0];	// /account/page -> GIF + log pageview to GA collector	cookies = request.headers.Cookie;    cid = getCookieValue(cookies, 'cid');	if (!cookies) {	    cid = generateUUID();		console.log("Generated new client UUID: %v", cid);		cookies = generateCookie("cid", cid, "/" + params[0]);		response.headers['Set-Cookie'] = cookies;	}    analyticsTools.some(function sendHit(tool) {        var            error;        if (!tool.REGEX.test(accountID)) {            return false;        }        error = tool.sendHit(accountID, cid, referrer, userAgent, language);        if (error) {            console.error(error.message);        }        return true;    });	// Write out pixel or badge, based on presence of "pixel" param.	return;}