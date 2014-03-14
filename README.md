#Wakanda Analytics Proxy#

[![Analytics](http://analytics-proxy.waktest.com/UA-48954928-1)](https://github.com/AMorgaut/Wakanda-Analytics-Proxy)
![Analytics](http://analytics-proxy.waktest.com/UA-48954928-1?test)

##Disclaimer##

**WARNING - It is still experimental**

##Credits##

This solution is originaly a port to [Wakanda](http://wakanda.org) of [Google Analytics Beacon](https://github.com/igrigorik/ga-beacon) from **[Ilya Grigorik](https://github.com/igrigorik)** (Google).

*Note: The original version was using the [GO Programming Language](http://golang.org/) and did run on [Google App Engine](https://cloud.google.com/products/app-engine).*

In this version I prefered to use the `Referer` HTTP header instead of having to manually set custom paths. It makes, in my opinion, it easier to integrate and makes the stats more relevant if a readme file is opened from different origins (like a fork). I also started to prepare an abstraction layer to support other Analytics tools like [Marketo](http://marketo.com).

##About##

Sometimes it is impossible to embed the JavaScript tracking code provided by Analytics Tools like Google Analytics: the host page does not allow arbitrary JavaScript, and there is no native integration. However, not all is lost! **If you can embed a simple image (pixel tracker), then you can beacon data to most of those Analytics Tools**. 

For a great, hands-on explanation, check out [Using a Beacon Image for GitHub, Website and Email Analytics](http://www.sitepoint.com/using-beacon-image-github-website-email-analytics/) describing how [ga-beacon](https://github.com/igrigorik/ga-beacon) (see [Credits](#credits)) works. 

This Analytics Proxy has some few changes compared to the original one but the main principles are the same.


### Hands-on example: Google Analytics for GitHub 

[![GA Dashboard](https://lh5.googleusercontent.com/-Zu9r9m7Uv0c/UsSQlJ5OoeI/AAAAAAAAHwo/fvH_lrVUV0w/w1007-h467-no/skitch.png)](https://lh5.googleusercontent.com/-Zu9r9m7Uv0c/UsSQlJ5OoeI/AAAAAAAAHwo/fvH_lrVUV0w/w1007-h467-no/skitch.png)

**Curious which of your GitHub projects are getting all the traffic, or if anyone is reading your GitHub wiki pages?** Well, that's what Google Analytics is for! GitHub does not allow us to install arbitrary analytics, but we can still use a simple tracking image to log visits in real-time to Google Analytics - for full details, follow the instructions below. Once everything is setup, install [this custom dashboard](https://www.google.com/analytics/web/template?uid=MQS4cmZdSh2OWUVqRntqXQ) in your account for a nice real-time overview (as shown in above screenshot).

_Note: GitHub [finally released traffic analytics](https://github.com/blog/1672-introducing-github-traffic-analytics) on Jan 7, 2014 -- wohoo! As a result, you can get most of the important insights by simply using that. If you still want real-time analytics, or an integration with your existing GA analytics, then you can use both the tracking pixel and built-in analytics._


### Setup instructions

First, log in to your Google Analytics account and [set up a new property](https://support.google.com/analytics/answer/1042508?hl=en):

* Select "Website", use new "Universal Analytics" tracking
* **Website name:** anything you want (e.g. `GitHub projects`)
* **WebSite URL:** `{your Wakanda Analytics Proxy Server address}`
* Click "Get Tracking ID", copy the `UA-XXXXX-X` ID on next page

Next, add a tracking image to the pages you want to track:

* `UA-XXXXX-X` should be your tracking ID

Example tracker markup if you are using Markdown:

```markdown
[![Analytics](https://foo.com/UA-XXXXX-X)](https://github.com/AMorgaut/Wakanda-Analytics-Proxy)
```

Or RDoc:

```rdoc
{<img src="https://foo.com/UA-XXXXX-X" />}[https://github.com/AMorgaut/Wakanda-Analytics-Proxy]
```

If you prefer, you can skip the badge and use a transparent pixel. To do so, simply append `?pixel` to the image URL and remove the link.


In Markdown:

```markdown
![Analytics](https://foo.com/UA-XXXXX-X?pixel)
```

Or RDoc:

```rdoc
<img src="https://foo.com/UA-XXXXX-X?pixel" />
```

And that's it, add the tracker image to the pages you want to track and then head to your Google Analytics account to see real-time and aggregated visit analytics for your projects!


### FAQ ###

- **How does this work?** GitHub, as few others, does not allow arbitrary JavaScript to run on its pages. As a result, we can't use standard analytics snippets to track visitors and pageviews. However, Google Analytics provides a [measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide) which allows us to POST the visit data directly to Google servers, and that's exactly what [GA Beacon](https://github.com/igrigorik/ga-beacon) does, and therefore what Wakanda Analytics Proxy does too: we include an image request on our pages which hits the GA Beacon service, and GA Beacon POST's the visit to Google Analytics to record the visit.

- **Why do we need to proxy?** Google Analytics supports reporting of visit data [via GET requests](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference#transport), but unfortunately we can't use that directly because we need to generate and report a unique visitor ID for each hit - GitHub does not allow us to run JS on the client to generate the ID. To address this, we proxy the request through a proxy server, which in turn is responsible for generating the unique visitor ID (server generated UUID) and reporting the hit to Google Analytics.

- **What about referrals and other visitor information?** Unfortunately the static tracking pixel approach limits the information we can collect about the visit. For example, referral information is only available on the GitHub page itself and can't be passed to the tracking pixel (for which the referer is the github page itself). As a result, the available metrics are restricted to unique visitors, pageviews, and the User-Agent of the visitor.

- **Can I use this outside of GitHub?** Yep, [you certainly can](http://www.sitepoint.com/using-beacon-image-github-website-email-analytics/). It's a generic beacon service.


##License##

The MIT License (MIT)

Copyright (c) 2014 Alexandre Morgaut

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
