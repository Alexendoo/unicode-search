/* eslint-env serviceworker, browser */
"use strict"

const cacheName = "charinfo-1"
const cached = [
  "css/app.css",
  "css/normalize.css",
  "js/app.js",
  "json/blocks.json",
  "json/names.json",
  "index.html",
]

self.addEventListener("install", event => {
  console.log(event)
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cached)
    }),
  )
})

self.addEventListener("activate", event => {
  console.log(event)
})

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    }),
  )
})
