import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, getCookie, getHeader, setCookie, deleteCookie, sendStream, getMethod, getResponseStatusText } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto$1, { createHmac, createHash } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import bcrypt from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/bcryptjs/index.js';
import nodemailer from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/nodemailer/lib/nodemailer.js';
import { PrismaClient } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/@prisma/client/default.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, encodePath, joinRelativeURL } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/vue/server-renderer/index.mjs';
import destr, { destr as destr$1 } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, defineDriver, prefixStorage } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unstorage/drivers/fs.mjs';
import fsDriver from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unstorage/drivers/fs-lite.mjs';
import lruCache from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unstorage/drivers/lru-cache.mjs';
import { digest, hash as hash$1 } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/errx/dist/index.js';
import { isVNode, isRef, toValue } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/vue/index.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unhead/dist/server.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unhead/dist/plugins.mjs';
import { walkResolver } from 'file:///Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

// @ts-check


/**
 * @param {string} item
 */
function normalizeFsKey (item) {
  const safe = item.replace(/[^\w.-]/g, '_');
  const prefix = safe.slice(0, 20);
  const hash = crypto$1.createHash('sha256').update(item).digest('hex');
  return `${prefix}-${hash}`
}

const _47Users_47blackrubick_47Desktop_47sieeg_45syscom_45nuxt_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js = defineDriver(
  /**
   * @param {{ base?: string }} opts
   */
  (opts) => {
    const fs = fsDriver({ base: opts.base });
    const lru = lruCache({ max: 1000 });

    return {
      ...fs, // fall back to file system - only the bottom three methods are used in renderer
      async setItem (key, value, opts) {
        await Promise.all([
          fs.setItem?.(normalizeFsKey(key), value, opts),
          lru.setItem?.(key, value, opts),
        ]);
      },
      async hasItem (key, opts) {
        return await lru.hasItem(key, opts) || await fs.hasItem(normalizeFsKey(key), opts)
      },
      async getItem (key, opts) {
        return await lru.getItem(key, opts) || await fs.getItem(normalizeFsKey(key), opts)
      },
    }
  },
);

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', _47Users_47blackrubick_47Desktop_47sieeg_45syscom_45nuxt_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js({"driver":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js","base":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/blackrubick/Desktop/sieeg-syscom-nuxt/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {},
  "sessionSecret": "sieeg-syscom-nuxt-secret-2026-cambiar-en-prod",
  "syscomClientId": "JpWbBVgYZt5cFcv7xOVzQEXYCZfGKsCv",
  "syscomClientSecret": "T4O5rDRg0JwgMcIk6DmjCbnYT4hojNESalRzcCfT",
  "smtpHost": "smtp.ionos.mx",
  "smtpPort": "587",
  "smtpUser": "integradores@sieeg.com.mx",
  "smtpPass": "irgYhtRR56%g#$fgbhUIO",
  "smtpAdminTo": "integradores@sieeg.com.mx"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e.data) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const rootDir = "/Users/blackrubick/Desktop/sieeg-syscom-nuxt";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[{"rel":"icon","type":"image/jpeg","href":"/logosieeg.jpg"},{"rel":"preconnect","href":"https://fonts.googleapis.com"},{"rel":"preconnect","href":"https://fonts.gstatic.com","crossorigin":""},{"rel":"stylesheet","href":"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"}],"style":[],"script":[],"noscript":[],"title":"SIEEG INTEGRADORES"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _1lsG8novbxHbeQBjS1bmiipoQYRb1WGiQWsaz83vcjM = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			
			filename,
			
			stack: trace
		};
		
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const plugins = [
  _1lsG8novbxHbeQBjS1bmiipoQYRb1WGiQWsaz83vcjM,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _nEFtRd = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function filterIslandProps(props) {
  if (!props) {
    return {};
  }
  const out = {};
  for (const key in props) {
    if (!key.startsWith("data-v-")) {
      out[key] = props[key];
    }
  }
  return out;
}
function computeIslandHash(name, filteredProps, context, source) {
  return hash$1([name, filteredProps, context, source]).replace(/[-_]/g, "");
}

const NUXT_RUNTIME_PAYLOAD_EXTRACTION = false;

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) {
		return encodePath(path);
	}
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function buildAssetsDir() {
	
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => Promise.resolve().then(function () { return server; }).then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => Promise.resolve().then(function () { return client_manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);

const getSSRRenderer = lazyCachedFunction(async () => {
	
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	
	const precomputed = undefined ;
	
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		
		
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});

const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
		}
	});
	
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);

function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") {
			return {};
		}
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	
	
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) {
			throw createError({
				statusCode: response.statusCode,
				statusMessage: response.statusMessage
			});
		}
		return returnIslandResponse(event, response);
	}
	
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			
			
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	
	islandHead.link ||= [];
	islandHead.style ||= [];
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) {
		setResponseHeader(event, header, response.headers[header]);
	}
	if (response.statusCode) {
		setResponseStatus(event, response.statusCode, response.statusMessage);
	}
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	const rawProps = destr$1(rawContext?.props) || {};
	const filteredProps = filterIslandProps(rawProps);
	
	
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) {
			if (key !== "props") {
				clientContext[key] = rawContext[key];
			}
		}
	}
	
	
	const expectedHash = computeIslandHash(componentName, filteredProps, clientContext, undefined);
	if (!hashId || hashId !== expectedHash) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request hash"
		});
	}
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: rawProps,
		slots: {},
		components: {}
	};
}

const _lazy_93SpQU = () => Promise.resolve().then(function () { return changePassword_post$1; });
const _lazy_voKFNJ = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_2VpqXs = () => Promise.resolve().then(function () { return logout_post$1; });
const _lazy_WR5rR6 = () => Promise.resolve().then(function () { return me_get$1; });
const _lazy_MNqmdh = () => Promise.resolve().then(function () { return request_post$1; });
const _lazy_qwL8Gl = () => Promise.resolve().then(function () { return _format__get$1; });
const _lazy_1XUbIR = () => Promise.resolve().then(function () { return create_post$1; });
const _lazy_DW6K0X = () => Promise.resolve().then(function () { return global_post$1; });
const _lazy_NS3FyY = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_LqKB2H = () => Promise.resolve().then(function () { return _uid__delete$1; });
const _lazy_MvmNDU = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_9uPx_i = () => Promise.resolve().then(function () { return sync_post$1; });
const _lazy_vV8JzI = () => Promise.resolve().then(function () { return orders_get$1; });
const _lazy_T2DVDE = () => Promise.resolve().then(function () { return read_post$1; });
const _lazy_h3o5L9 = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_ppG4SO = () => Promise.resolve().then(function () { return readAll_post$1; });
const _lazy_J3gsYi = () => Promise.resolve().then(function () { return _id__patch$3; });
const _lazy_gZPNlO = () => Promise.resolve().then(function () { return retrySyscom_post$1; });
const _lazy_ILEr0O = () => Promise.resolve().then(function () { return syscomTrack_get$1; });
const _lazy_TsRkZL = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_TaRdrW = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_ucNND9 = () => Promise.resolve().then(function () { return ____path_$1; });
const _lazy_QPdZMX = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_dl_ceO = () => Promise.resolve().then(function () { return _id__patch$1; });
const _lazy_5udnor = () => Promise.resolve().then(function () { return fiscal_patch$1; });
const _lazy_1FQAoA = () => Promise.resolve().then(function () { return fiscalData_patch$1; });
const _lazy_xvYU4H = () => Promise.resolve().then(function () { return fiscal_get$1; });
const _lazy_j67VC0 = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_hrLc8L = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_2raH0F = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _nEFtRd, lazy: false, middleware: true, method: undefined },
  { route: '/api/auth/change-password', handler: _lazy_93SpQU, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_voKFNJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_2VpqXs, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_WR5rR6, lazy: true, middleware: false, method: "get" },
  { route: '/api/contact/request', handler: _lazy_MNqmdh, lazy: true, middleware: false, method: "post" },
  { route: '/api/factura/cfdi/:uid/:format', handler: _lazy_qwL8Gl, lazy: true, middleware: false, method: "get" },
  { route: '/api/factura/cfdi/create', handler: _lazy_1XUbIR, lazy: true, middleware: false, method: "post" },
  { route: '/api/factura/cfdi/global', handler: _lazy_DW6K0X, lazy: true, middleware: false, method: "post" },
  { route: '/api/factura/cfdi', handler: _lazy_NS3FyY, lazy: true, middleware: false, method: "get" },
  { route: '/api/factura/clients/:uid', handler: _lazy_LqKB2H, lazy: true, middleware: false, method: "delete" },
  { route: '/api/factura/clients', handler: _lazy_MvmNDU, lazy: true, middleware: false, method: "get" },
  { route: '/api/factura/clients/sync', handler: _lazy_9uPx_i, lazy: true, middleware: false, method: "post" },
  { route: '/api/factura/orders', handler: _lazy_vV8JzI, lazy: true, middleware: false, method: "get" },
  { route: '/api/notifications/:id/read', handler: _lazy_T2DVDE, lazy: true, middleware: false, method: "post" },
  { route: '/api/notifications', handler: _lazy_h3o5L9, lazy: true, middleware: false, method: "get" },
  { route: '/api/notifications/read-all', handler: _lazy_ppG4SO, lazy: true, middleware: false, method: "post" },
  { route: '/api/orders/:id', handler: _lazy_J3gsYi, lazy: true, middleware: false, method: "patch" },
  { route: '/api/orders/:id/retry-syscom', handler: _lazy_gZPNlO, lazy: true, middleware: false, method: "post" },
  { route: '/api/orders/:id/syscom-track', handler: _lazy_ILEr0O, lazy: true, middleware: false, method: "get" },
  { route: '/api/orders', handler: _lazy_TsRkZL, lazy: true, middleware: false, method: "get" },
  { route: '/api/orders', handler: _lazy_TaRdrW, lazy: true, middleware: false, method: "post" },
  { route: '/api/syscom/**:path', handler: _lazy_ucNND9, lazy: true, middleware: false, method: undefined },
  { route: '/api/users/:id', handler: _lazy_QPdZMX, lazy: true, middleware: false, method: "delete" },
  { route: '/api/users/:id', handler: _lazy_dl_ceO, lazy: true, middleware: false, method: "patch" },
  { route: '/api/users/:id/fiscal', handler: _lazy_5udnor, lazy: true, middleware: false, method: "patch" },
  { route: '/api/users/fiscal-data', handler: _lazy_1FQAoA, lazy: true, middleware: false, method: "patch" },
  { route: '/api/users/fiscal', handler: _lazy_xvYU4H, lazy: true, middleware: false, method: "get" },
  { route: '/api/users', handler: _lazy_j67VC0, lazy: true, middleware: false, method: "get" },
  { route: '/api/users', handler: _lazy_hrLc8L, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_2raH0F, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_2raH0F, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server$1 = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server$1.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server$1.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server$1.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"version": "",
	"status": 500,
	"statusText": "Server error",
	"description": "This page is temporarily unavailable."
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0\" name=\"viewport\"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script></head><body class=\"antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black\"><div class=\"-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight\"></div><div class=\"max-w-520px text-center\"><h1 class=\"font-medium mb-8 sm:text-10xl text-8xl\">" + escapeHtml(messages.status) + "</h1><p class=\"font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = () => viteNodeFetch.getManifest();

const client_manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: client_manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const SESSION_COOKIE = "sieeg_sess";
const TTL_MS = 8 * 60 * 60 * 1e3;
function secret() {
  var _a;
  return (_a = process.env.SESSION_SECRET) != null ? _a : "dev-secret";
}
function sign(data) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}
function createToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TTL_MS })).toString("base64url");
  return `${body}.${sign(body)}`;
}
function verifyToken(token) {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (sign(body) !== sig) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!p.exp || p.exp < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}
function getSession(event) {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) return null;
  return verifyToken(token);
}
function requireSession(event) {
  const session = getSession(event);
  if (!session) throw createError({ statusCode: 401, message: "No autorizado" });
  return session;
}

var _a;
const prisma = (_a = globalThis.__prisma) != null ? _a : new PrismaClient();
globalThis.__prisma = prisma;

const changePassword_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const body = await readBody(event);
  const currentPw = body.currentPassword;
  if (!currentPw || !body.newPassword) {
    throw createError({ statusCode: 400, message: "Contrase\xF1a actual y nueva son requeridas" });
  }
  if (body.newPassword.length < 8) {
    throw createError({ statusCode: 400, message: "La nueva contrase\xF1a debe tener al menos 8 caracteres" });
  }
  if (currentPw === body.newPassword) {
    throw createError({ statusCode: 400, message: "La nueva contrase\xF1a debe ser diferente a la actual" });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true }
  });
  if (!user) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  let valid = false;
  if (user.password.startsWith("$2")) {
    valid = await bcrypt.compare(currentPw, user.password);
  } else {
    valid = createHash("sha256").update(currentPw).digest("hex") === user.password;
  }
  if (!valid) throw createError({ statusCode: 401, message: "La contrase\xF1a actual es incorrecta" });
  const newHash = await bcrypt.hash(body.newPassword, 12);
  await prisma.user.update({ where: { id: session.userId }, data: { password: newHash } });
  return { ok: true };
});

const changePassword_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: changePassword_post
}, Symbol.toStringTag, { value: 'Module' }));

const rateBuckets = /* @__PURE__ */ new Map();
const WINDOW_MS = 15 * 60 * 1e3;
const MAX_TRIES = 10;
function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count++;
  if (bucket.count > MAX_TRIES) {
    const waitMin = Math.ceil((bucket.resetAt - now) / 6e4);
    throw createError({ statusCode: 429, message: `Demasiados intentos. Espera ${waitMin} minuto${waitMin !== 1 ? "s" : ""} e intenta de nuevo.` });
  }
}
function clearRateLimit(ip) {
  rateBuckets.delete(ip);
}
const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const ip = (_d = (_c = (_b = (_a = getHeader(event, "x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) != null ? _c : getHeader(event, "x-real-ip")) != null ? _d : "unknown";
  checkRateLimit(ip);
  const body = await readBody(event);
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Correo y contrase\xF1a son requeridos" });
  }
  const user = await prisma.user.findFirst({
    where: { email: body.email.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
      fiscalCompleted: true,
      password: true
    }
  });
  if (!user) {
    throw createError({ statusCode: 401, message: "Correo o contrase\xF1a incorrectos" });
  }
  if (user.status === "inactive") {
    throw createError({ statusCode: 403, message: "Esta cuenta est\xE1 desactivada. Contacta al administrador." });
  }
  if (user.status === "pending") {
    throw createError({ statusCode: 403, message: "Esta cuenta est\xE1 pendiente de activaci\xF3n." });
  }
  let passwordValid = false;
  let needsRehash = false;
  if (user.password.startsWith("$2")) {
    passwordValid = await bcrypt.compare(body.password, user.password);
  } else {
    const sha = createHash("sha256").update(body.password).digest("hex");
    passwordValid = sha === user.password;
    needsRehash = passwordValid;
  }
  if (!passwordValid) {
    throw createError({ statusCode: 401, message: "Correo o contrase\xF1a incorrectos" });
  }
  clearRateLimit(ip);
  if (needsRehash) {
    const newHash = await bcrypt.hash(body.password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: newHash } });
  }
  const token = createToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  });
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/"
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }
  });
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, SESSION_COOKIE);
  return { ok: true };
});

const logout_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: logout_post
}, Symbol.toStringTag, { value: 'Module' }));

const me_get = defineEventHandler(async (event) => {
  const session = getSession(event);
  if (!session) throw createError({ statusCode: 401, message: "No autorizado" });
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
      fiscalCompleted: true,
      fiscalRfc: true,
      fiscalRazonSocial: true,
      fiscalCodpos: true,
      fiscalEmail: true,
      fiscalUsocfdi: true,
      fiscalRegimen: true,
      fiscalPais: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCiudad: true,
      fiscalDelegacion: true,
      fiscalLocalidad: true,
      fiscalEstado: true,
      fiscalNumregidtrib: true,
      fiscalNombre: true,
      fiscalApellidos: true,
      fiscalTelefono: true
    }
  });
  if (!user) throw createError({ statusCode: 401, message: "No autorizado" });
  return { user };
});

const me_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: me_get
}, Symbol.toStringTag, { value: 'Module' }));

function createTransport() {
  const config = useRuntimeConfig();
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    requireTLS: Number(config.smtpPort) === 587,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: { rejectUnauthorized: false }
  });
}
async function sendAccessRequestEmail(data) {
  const config = useRuntimeConfig();
  if (!config.smtpHost || !config.smtpUser || !config.smtpAdminTo) return;
  const transporter = createTransport();
  const companyLine = data.company ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Empresa</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.company}</td></tr>` : "";
  const phoneLine = data.phone ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Tel\xE9fono</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.phone}</td></tr>` : "";
  await transporter.sendMail({
    from: `"SIEEG INTEGRADORES" <${config.smtpUser}>`,
    to: config.smtpAdminTo,
    subject: `\u{1F64B} Nueva solicitud de acceso \u2014 ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#040C1A;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#0D1B35;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0EA5E9,#0284C7);padding:28px 32px;">
      <div style="font-size:22px;font-weight:700;color:white;">SIEEG INTEGRADORES</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">Nueva solicitud de acceso a la plataforma</div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="font-size:15px;color:#e2e8f0;margin:0 0 20px;">
        Un nuevo prospecto llen\xF3 el formulario en tu sitio web y quiere ser cliente:
      </p>

      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;width:100px;">Nombre</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.name}</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Correo</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#38bdf8;">${data.email}</td></tr>
        ${companyLine}
        ${phoneLine}
      </table>

      <div style="margin-top:24px;padding:14px 16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:10px;font-size:13px;color:#94a3b8;">
        Para activar su acceso, entra al panel de administraci\xF3n \u2192 <strong style="color:#38bdf8;">Usuarios</strong> y cambia su estado a <strong style="color:#34d399;">Activo</strong>.
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:rgba(100,116,139,0.7);">
      Este mensaje fue generado autom\xE1ticamente por la plataforma SIEEG INTEGRADORES.
    </div>
  </div>
</body>
</html>`
  });
}

const request_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const { name, email, company, phone } = body;
  if (!(name == null ? void 0 : name.trim()) || !(email == null ? void 0 : email.trim())) {
    throw createError({ statusCode: 400, message: "Nombre y correo son requeridos" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw createError({ statusCode: 400, message: "El correo no tiene un formato v\xE1lido" });
  }
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    if (existing.status === "pending") {
      throw createError({ statusCode: 409, message: "Ya existe una solicitud de acceso con este correo. Te contactaremos pronto." });
    }
    throw createError({ statusCode: 409, message: "Ya existe una cuenta asociada a este correo." });
  }
  const tempPassword = createHash("sha256").update(`pending-${email}-${Date.now()}-${Math.random()}`).digest("hex");
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: tempPassword,
      role: "buyer",
      status: "pending",
      createdAt: today,
      avatar: name.trim().split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase(),
      fiscalRazonSocial: (company == null ? void 0 : company.trim()) || null,
      fiscalTelefono: (phone == null ? void 0 : phone.trim()) || null
    }
  });
  const admins = await prisma.user.findMany({
    where: { role: "admin", status: "active" },
    select: { id: true }
  });
  if (admins.length > 0) {
    const companyPart = (company == null ? void 0 : company.trim()) ? ` (${company.trim()})` : "";
    const phonePart = (phone == null ? void 0 : phone.trim()) ? ` \xB7 Tel: ${phone.trim()}` : "";
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        type: "alert",
        title: "\u{1F64B} Nueva solicitud de acceso",
        message: `${name.trim()}${companyPart} quiere ser cliente. Correo: ${email.toLowerCase().trim()}${phonePart}. Ve a Usuarios para activarlo.`,
        read: false
      }))
    });
  }
  sendAccessRequestEmail({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    company: (_a = company == null ? void 0 : company.trim()) != null ? _a : "",
    phone: (_b = phone == null ? void 0 : phone.trim()) != null ? _b : ""
  }).catch((err) => console.error("[email] Error enviando notificaci\xF3n:", err));
  return { success: true };
});

const request_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: request_post
}, Symbol.toStringTag, { value: 'Module' }));

const HOSTS = {
  sandbox: "https://sandbox.factura.com/api",
  production: "https://api.factura.com"
};
const F_PLUGIN = "9d4095c8f7ed5785cb14c0e3b033eeb8252416ed";
function getFacturaEnv() {
  var _a;
  const env = (_a = process.env.FACTURA_ENV) != null ? _a : "sandbox";
  return env === "production" ? "production" : "sandbox";
}
function getFacturaHost() {
  return HOSTS[getFacturaEnv()];
}
function getFacturaHeaders() {
  var _a, _b;
  const apiKey = (_a = process.env.FACTURA_API_KEY) != null ? _a : "";
  const secretKey = (_b = process.env.FACTURA_SECRET_KEY) != null ? _b : "";
  if (!apiKey || !secretKey) {
    throw createError({ statusCode: 500, message: "Credenciales de Factura.com no configuradas" });
  }
  return {
    "F-PLUGIN": F_PLUGIN,
    "F-Api-Key": apiKey,
    "F-Secret-Key": secretKey,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}
async function facturaFetch(version, endpoint, options = {}) {
  var _a, _b, _c, _d;
  const host = getFacturaHost();
  const url = `${host}/${version}/${endpoint.replace(/^\//, "")}`;
  const method = (_a = options.method) != null ? _a : "GET";
  const headers = getFacturaHeaders();
  const res = await fetch(url, {
    method,
    headers,
    body: options.body != null ? JSON.stringify(options.body) : void 0
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  const body = data;
  if (!res.ok) {
    const rawMsg = (_b = body == null ? void 0 : body.message) != null ? _b : `Factura.com error ${res.status}`;
    const msg = typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg);
    console.error("[Factura.com HTTP error]", res.status, url, JSON.stringify(body));
    throw createError({ statusCode: res.status, message: msg });
  }
  if ((body == null ? void 0 : body.status) === "error" || (body == null ? void 0 : body.response) === "error") {
    const rawMsg = (_d = (_c = body == null ? void 0 : body.message) != null ? _c : body == null ? void 0 : body.msg) != null ? _d : "Error en Factura.com";
    const msg = typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg);
    console.error("[Factura.com error]", url, JSON.stringify(body));
    throw createError({ statusCode: 422, message: msg });
  }
  return data;
}
async function listarClientes(opts = {}) {
  var _a;
  const params = new URLSearchParams();
  if (opts.razon_social) params.set("razon_social", opts.razon_social);
  if (opts.rfc) params.set("rfc", opts.rfc);
  if (opts.page) params.set("page", String(opts.page));
  if (opts.per_page) params.set("per_page", String(opts.per_page));
  const qs = params.toString();
  const res = await facturaFetch(
    "v1",
    `clients${qs ? `?${qs}` : ""}`
  );
  return { data: (_a = res.data) != null ? _a : [], pagination: res.pagination };
}
async function obtenerCliente(rfc) {
  var _a;
  try {
    const res = await facturaFetch("v1", `clients/${rfc}`);
    return (_a = res.Data) != null ? _a : null;
  } catch {
    return null;
  }
}
async function crearCliente(payload) {
  const res = await facturaFetch(
    "v1",
    "clients/create",
    { method: "POST", body: payload }
  );
  return res.Data;
}
async function actualizarCliente(uid, payload) {
  const res = await facturaFetch(
    "v1",
    `clients/${uid}/update`,
    { method: "POST", body: { UID: uid, ...payload } }
  );
  return res.Data;
}
async function eliminarCliente(uid) {
  return facturaFetch("v1", `clients/destroy/${uid}`, { method: "POST" });
}
function buildCfdiConcepto(item) {
  const base = parseFloat((item.cantidad * item.valorUnitario).toFixed(6));
  const iva = parseFloat((base * 0.16).toFixed(6));
  return {
    ClaveProdServ: item.claveProdServ,
    NoIdentificacion: item.noIdentificacion || void 0,
    Cantidad: item.cantidad.toFixed(6),
    ClaveUnidad: item.claveUnidad,
    Unidad: item.unidad,
    ValorUnitario: item.valorUnitario.toFixed(6),
    Descripcion: item.descripcion,
    ObjetoImp: "02",
    Impuestos: {
      Traslados: [{
        Base: base.toFixed(6),
        Impuesto: "002",
        TipoFactor: "Tasa",
        TasaOCuota: "0.160000",
        Importe: iva.toFixed(6)
      }],
      Retenidos: [],
      Locales: []
    }
  };
}
async function crearCFDI(payload) {
  return facturaFetch("v4", "cfdi40/create", { method: "POST", body: payload });
}
async function listarCFDIs(opts = {}) {
  const body = {};
  if (opts.month) body.month = opts.month;
  if (opts.year) body.year = opts.year;
  if (opts.rfc) body.rfc = opts.rfc;
  if (opts.page) body.page = opts.page;
  if (opts.per_page) body.per_page = opts.per_page;
  return facturaFetch("v4", "cfdi/list", { method: "POST", body });
}

const _format__get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const uid = getRouterParam(event, "uid");
  const format = getRouterParam(event, "format");
  if (!uid) throw createError({ statusCode: 400, message: "uid requerido" });
  if (format !== "pdf" && format !== "xml") throw createError({ statusCode: 400, message: "Formato inv\xE1lido. Usa pdf o xml" });
  const url = `${getFacturaHost()}/v4/cfdi40/${uid}/${format}`;
  const res = await fetch(url, { method: "GET", headers: getFacturaHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw createError({ statusCode: res.status, message: `Factura.com error ${res.status}: ${text.slice(0, 200)}` });
  }
  const contentType = format === "pdf" ? "application/pdf" : "application/xml";
  const disposition = `attachment; filename="cfdi-${uid}.${format}"`;
  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Content-Disposition", disposition);
  return sendStream(event, res.body);
});

const _format__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _format__get
}, Symbol.toStringTag, { value: 'Module' }));

const create_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const body = await readBody(event);
  const { userId, conceptos, formaPago, metodoPago } = body;
  if (!userId) throw createError({ statusCode: 400, message: "userId requerido" });
  if (!(conceptos == null ? void 0 : conceptos.length)) throw createError({ statusCode: 400, message: "Al menos un concepto es requerido" });
  if (!formaPago) throw createError({ statusCode: 400, message: "formaPago requerido" });
  if (!metodoPago) throw createError({ statusCode: 400, message: "metodoPago requerido" });
  const serieId = Number(process.env.FACTURA_SERIE_ID);
  if (!serieId) throw createError({ statusCode: 500, message: "FACTURA_SERIE_ID no est\xE1 configurado en .env \u2014 config\xFAralo con el ID num\xE9rico de tu serie en Factura.com" });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { facturaUid: true, fiscalUsocfdi: true, fiscalCompleted: true, fiscalEmail: true }
  });
  if (!user) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  if (!user.facturaUid) throw createError({ statusCode: 400, message: "El usuario no est\xE1 sincronizado con Factura.com \u2014 sincron\xEDzalo primero" });
  if (!user.fiscalUsocfdi) throw createError({ statusCode: 400, message: "El usuario no tiene Uso de CFDI configurado en sus datos fiscales" });
  for (const [i, c] of conceptos.entries()) {
    if (!((_a = c.descripcion) == null ? void 0 : _a.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: descripci\xF3n requerida` });
    if (!((_b = c.claveProdServ) == null ? void 0 : _b.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: clave de producto/servicio requerida` });
    if (!((_c = c.claveUnidad) == null ? void 0 : _c.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: clave de unidad requerida` });
    if (!((_d = c.unidad) == null ? void 0 : _d.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: unidad requerida` });
    if (!c.cantidad || c.cantidad <= 0) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: cantidad debe ser mayor a 0` });
    if (!c.valorUnitario || c.valorUnitario <= 0) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: valor unitario debe ser mayor a 0` });
  }
  if (body.orderId) {
    const existingOrder = await prisma.order.findUnique({
      where: { id: body.orderId },
      select: { cfdiUid: true }
    });
    if (existingOrder == null ? void 0 : existingOrder.cfdiUid) {
      throw createError({ statusCode: 409, message: "Este pedido ya tiene un CFDI generado. Actualiza la p\xE1gina." });
    }
  }
  const payload = {
    Receptor: { UID: user.facturaUid },
    TipoDocumento: "factura",
    Conceptos: conceptos.map(buildCfdiConcepto),
    UsoCFDI: user.fiscalUsocfdi,
    Serie: serieId,
    FormaPago: formaPago,
    MetodoPago: metodoPago,
    Moneda: (_e = body.moneda) != null ? _e : "MXN",
    Comentarios: ((_f = body.comentarios) == null ? void 0 : _f.trim()) || void 0,
    EnviarCorreo: (_g = body.enviarCorreo) != null ? _g : true
  };
  const result = await crearCFDI(payload);
  if (body.orderId && result.uid) {
    await prisma.order.update({
      where: { id: body.orderId },
      data: { cfdiUid: result.uid }
    }).catch(() => {
    });
  }
  return result;
});

const create_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: create_post
}, Symbol.toStringTag, { value: 'Module' }));

const RFC_PUBLICO = "XAXX010101000";
async function getOrCreatePublicoUid() {
  var _a, _b;
  const existente = await obtenerCliente(RFC_PUBLICO);
  if (existente == null ? void 0 : existente.UID) return existente.UID;
  const nuevo = await crearCliente({
    rfc: RFC_PUBLICO,
    razons: "PUBLICO EN GENERAL",
    codpos: "00000",
    email: (_b = (_a = process.env.FACTURA_ADMIN_EMAIL) != null ? _a : process.env.NUXT_ADMIN_EMAIL) != null ? _b : "admin@empresa.com",
    regimen: "616",
    pais: "MEX"
  });
  return nuevo.UID;
}
const global_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const body = await readBody(event);
  const { periodicidad, meses, a\u00F1o, formaPago, metodoPago, usoCfdi } = body;
  if (!periodicidad) throw createError({ statusCode: 400, message: "Periodicidad requerida" });
  if (!meses) throw createError({ statusCode: 400, message: "Mes requerido" });
  if (!a\u00F1o) throw createError({ statusCode: 400, message: "A\xF1o requerido" });
  if (!formaPago) throw createError({ statusCode: 400, message: "Forma de pago requerida" });
  if (!metodoPago) throw createError({ statusCode: 400, message: "M\xE9todo de pago requerido" });
  if (!usoCfdi) throw createError({ statusCode: 400, message: "Uso de CFDI requerido" });
  const serieId = Number(process.env.FACTURA_SERIE_ID);
  if (!serieId) throw createError({ statusCode: 500, message: "FACTURA_SERIE_ID no configurado en .env" });
  const where = {
    status: { in: ["approved", "processing", "shipped", "delivered"] },
    cfdiUid: null,
    ...((_a = body.orderIds) == null ? void 0 : _a.length) ? { id: { in: body.orderIds } } : {}
  };
  const orders = await prisma.order.findMany({ where });
  if (!orders.length) {
    throw createError({ statusCode: 400, message: "No hay pedidos aprobados pendientes de facturar" });
  }
  const conceptos = [];
  for (const order of orders) {
    const items = order.items;
    for (const item of items) {
      conceptos.push({
        descripcion: item.sku ? `${item.name} (${item.sku})` : item.name,
        claveProdServ: (_b = item.satKey) != null ? _b : "43211500",
        claveUnidad: "H87",
        unidad: "Pieza",
        cantidad: item.quantity,
        valorUnitario: item.price
      });
    }
  }
  const receptorUid = await getOrCreatePublicoUid();
  const payload = {
    Receptor: { UID: receptorUid },
    TipoDocumento: "factura",
    Conceptos: conceptos.map(buildCfdiConcepto),
    UsoCFDI: usoCfdi,
    Serie: serieId,
    FormaPago: formaPago,
    MetodoPago: metodoPago,
    Moneda: (_c = body.moneda) != null ? _c : "MXN",
    EnviarCorreo: false,
    InformacionGlobal: {
      Periodicidad: periodicidad,
      Meses: meses,
      A\u00F1o: a\u00F1o
    }
  };
  const result = await crearCFDI(payload);
  await prisma.order.updateMany({
    where: { id: { in: orders.map((o) => o.id) } },
    data: { cfdiUid: result.uid }
  });
  return { ...result, ordersIncluded: orders.length };
});

const global_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: global_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$8 = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const query = getQuery$1(event);
  const page = query.page ? Number(query.page) : 1;
  const perPage = query.per_page ? Math.min(Number(query.per_page), 100) : 50;
  const result = await listarCFDIs({
    month: query.month ? String(query.month) : void 0,
    year: query.year ? String(query.year) : void 0,
    rfc: query.rfc ? String(query.rfc) : void 0,
    page,
    per_page: perPage
  });
  return result;
});

const index_get$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$8
}, Symbol.toStringTag, { value: 'Module' }));

const _uid__delete = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const uid = getRouterParam(event, "uid");
  if (!uid) throw createError({ statusCode: 400, message: "UID requerido" });
  const result = await eliminarCliente(uid);
  if (result.response === "success") {
    await prisma.user.updateMany({
      where: { facturaUid: uid },
      data: { facturaUid: null }
    });
  }
  return result;
});

const _uid__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _uid__delete
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$6 = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const { razon_social, rfc, page, per_page } = getQuery$1(event);
  const result = await listarClientes({
    razon_social,
    rfc,
    page: page ? Number(page) : void 0,
    per_page: per_page ? Number(per_page) : void 0
  });
  return result;
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const sync_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const { userId } = await readBody(event);
  if (!userId) throw createError({ statusCode: 400, message: "userId requerido" });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      facturaUid: true,
      fiscalCompleted: true,
      fiscalRfc: true,
      fiscalRazonSocial: true,
      fiscalCodpos: true,
      fiscalEmail: true,
      fiscalUsocfdi: true,
      fiscalRegimen: true,
      fiscalPais: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCiudad: true,
      fiscalDelegacion: true,
      fiscalLocalidad: true,
      fiscalEstado: true,
      fiscalNumregidtrib: true,
      fiscalNombre: true,
      fiscalApellidos: true,
      fiscalTelefono: true
    }
  });
  if (!user) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  if (!user.fiscalCompleted || !user.fiscalRfc || !user.fiscalRazonSocial || !user.fiscalCodpos || !user.fiscalEmail || !user.fiscalRegimen || !user.fiscalPais) {
    throw createError({ statusCode: 422, message: "El usuario no tiene datos fiscales completos" });
  }
  const payload = {
    rfc: user.fiscalRfc,
    razons: user.fiscalRazonSocial,
    codpos: user.fiscalCodpos,
    email: user.fiscalEmail,
    regimen: user.fiscalRegimen,
    pais: user.fiscalPais,
    usocfdi: (_a = user.fiscalUsocfdi) != null ? _a : void 0,
    calle: (_b = user.fiscalCalle) != null ? _b : void 0,
    numero_exterior: (_c = user.fiscalNumExt) != null ? _c : void 0,
    numero_interior: (_d = user.fiscalNumInt) != null ? _d : void 0,
    colonia: (_e = user.fiscalColonia) != null ? _e : void 0,
    ciudad: (_f = user.fiscalCiudad) != null ? _f : void 0,
    delegacion: (_g = user.fiscalDelegacion) != null ? _g : void 0,
    localidad: (_h = user.fiscalLocalidad) != null ? _h : void 0,
    estado: (_i = user.fiscalEstado) != null ? _i : void 0,
    numregidtrib: (_j = user.fiscalNumregidtrib) != null ? _j : void 0,
    nombre: (_k = user.fiscalNombre) != null ? _k : void 0,
    apellidos: (_l = user.fiscalApellidos) != null ? _l : void 0,
    telefono: (_m = user.fiscalTelefono) != null ? _m : void 0
  };
  let facturaUid = user.facturaUid;
  let cliente;
  if (facturaUid) {
    cliente = await actualizarCliente(facturaUid, payload);
  } else {
    const existente = await obtenerCliente(user.fiscalRfc);
    if (existente == null ? void 0 : existente.UID) {
      facturaUid = existente.UID;
      cliente = await actualizarCliente(facturaUid, payload);
    } else {
      cliente = await crearCliente(payload);
      facturaUid = cliente.UID;
    }
  }
  await prisma.user.update({
    where: { id: userId },
    data: { facturaUid }
  });
  return { cliente, facturaUid, action: user.facturaUid ? "updated" : "created" };
});

const sync_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sync_post
}, Symbol.toStringTag, { value: 'Module' }));

const orders_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          facturaUid: true,
          fiscalCompleted: true,
          fiscalRfc: true,
          fiscalRazonSocial: true,
          fiscalUsocfdi: true,
          fiscalRegimen: true
        }
      }
    }
  });
  return {
    orders: orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      userName: o.user.name,
      userEmail: o.user.email,
      userFacturaUid: o.user.facturaUid,
      userFiscalCompleted: o.user.fiscalCompleted,
      userFiscalRfc: o.user.fiscalRfc,
      userFiscalRazonSocial: o.user.fiscalRazonSocial,
      userFiscalUsocfdi: o.user.fiscalUsocfdi,
      userFiscalRegimen: o.user.fiscalRegimen,
      status: o.status,
      items: o.items,
      total: o.total,
      priority: o.priority,
      notes: o.notes,
      syscomFolio: o.syscomFolio,
      cfdiUid: o.cfdiUid,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString()
    }))
  };
});

const orders_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: orders_get
}, Symbol.toStringTag, { value: 'Module' }));

const read_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  await prisma.notification.updateMany({
    where: { id, userId: session.userId },
    data: { read: true }
  });
  return { ok: true };
});

const read_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: read_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const q = getQuery$1(event);
  const onlyUnread = q.unread === "true";
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.userId,
      ...onlyUnread ? { read: false } : {}
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  const unreadCount = await prisma.notification.count({
    where: { userId: session.userId, read: false }
  });
  return { notifications, unreadCount };
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const readAll_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  await prisma.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true }
  });
  return { ok: true };
});

const readAll_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: readAll_post
}, Symbol.toStringTag, { value: 'Module' }));

let cache = null;
async function getSyscomToken() {
  var _a, _b;
  if (cache && cache.expiresAt > Date.now() + 6e4) return cache.token;
  const clientId = (_a = process.env.SYSCOM_CLIENT_ID) != null ? _a : "";
  const clientSecret = (_b = process.env.SYSCOM_CLIENT_SECRET) != null ? _b : "";
  const res = await fetch("https://developers.syscom.mx/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  if (!res.ok) throw createError({ statusCode: 502, message: "No se pudo autenticar con SYSCOM" });
  const data = await res.json();
  cache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1e3 };
  return cache.token;
}
async function generateSyscomOrder(opts) {
  var _a, _b, _c, _d, _e;
  const token = await getSyscomToken();
  const url = new URL("https://developers.syscom.mx/api/v1/carrito/generar");
  url.searchParams.set("tipo_entrega", opts.tipo_entrega);
  url.searchParams.set("metodo_pago", opts.metodo_pago);
  url.searchParams.set("moneda", (_a = opts.moneda) != null ? _a : "mxn");
  url.searchParams.set("uso_cfdi", opts.uso_cfdi);
  url.searchParams.set("ordenar", String((_b = opts.ordenar) != null ? _b : false));
  url.searchParams.set("productos", JSON.stringify(opts.productos));
  url.searchParams.set("direccion", JSON.stringify(opts.direccion));
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = (_c = data == null ? void 0 : data.message) != null ? _c : `SYSCOM ${res.status}`;
    return { folio: null, data, error: msg };
  }
  const resumen = data == null ? void 0 : data.resumen;
  const folio = (_e = (_d = resumen == null ? void 0 : resumen.folio) != null ? _d : resumen == null ? void 0 : resumen.folio_pedido) != null ? _e : null;
  return { folio, data };
}

const ALLOWED = ["approved", "rejected", "cancelled", "processing", "shipped", "delivered"];
const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
const _id__patch$2 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const session = requireSession(event);
  const isManager = session.role === "admin" || session.role === "approver";
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const body = await readBody(event);
  if (!ALLOWED.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Estado inv\xE1lido" });
  }
  const existing = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  if (!existing) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  if (!isManager) {
    if (existing.userId !== session.userId) {
      throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
    }
    if (body.status !== "cancelled") {
      throw createError({ statusCode: 403, message: "Solo puedes cancelar tus propios pedidos" });
    }
    if (!["pending", "approved"].includes(existing.status)) {
      throw createError({ statusCode: 400, message: `No se puede cancelar un pedido en estado "${existing.status}"` });
    }
  }
  let syscomFolio = (_a = existing.syscomFolio) != null ? _a : null;
  let syscomData = (_b = existing.syscomData) != null ? _b : void 0;
  let syscomError;
  if (body.status === "approved" && !existing.syscomFolio) {
    const user = await prisma.user.findUnique({
      where: { id: existing.userId },
      select: {
        name: true,
        fiscalRazonSocial: true,
        fiscalCalle: true,
        fiscalNumExt: true,
        fiscalNumInt: true,
        fiscalColonia: true,
        fiscalCodpos: true,
        fiscalCiudad: true,
        fiscalEstado: true,
        fiscalPais: true,
        fiscalTelefono: true,
        fiscalUsocfdi: true,
        fiscalRfc: true
      }
    });
    if ((user == null ? void 0 : user.fiscalRfc) && !RFC_RE.test(user.fiscalRfc.replace(/\s/g, ""))) {
      syscomError = `RFC inv\xE1lido: ${user.fiscalRfc}. Verifica los datos fiscales del usuario.`;
    } else {
      const direccion = {
        atencion_a: (_d = (_c = user == null ? void 0 : user.fiscalRazonSocial) != null ? _c : user == null ? void 0 : user.name) != null ? _d : "N/A",
        calle: (_e = user == null ? void 0 : user.fiscalCalle) != null ? _e : "",
        num_ext: (_f = user == null ? void 0 : user.fiscalNumExt) != null ? _f : "S/N",
        num_int: (_g = user == null ? void 0 : user.fiscalNumInt) != null ? _g : "",
        colonia: (_h = user == null ? void 0 : user.fiscalColonia) != null ? _h : "",
        codigo_postal: (_i = user == null ? void 0 : user.fiscalCodpos) != null ? _i : "",
        ciudad: (_j = user == null ? void 0 : user.fiscalCiudad) != null ? _j : "",
        estado: (_k = user == null ? void 0 : user.fiscalEstado) != null ? _k : "",
        pais: (_l = user == null ? void 0 : user.fiscalPais) != null ? _l : "MEX",
        telefono: (_m = user == null ? void 0 : user.fiscalTelefono) != null ? _m : ""
      };
      const productos = existing.items.map((item) => ({
        id: Number(item.productId),
        tipo: "nuevo",
        cantidad: item.quantity
      }));
      try {
        const result = await generateSyscomOrder({
          tipo_entrega: "domicilio",
          direccion,
          metodo_pago: (_n = process.env.SYSCOM_METODO_PAGO) != null ? _n : "03",
          productos,
          uso_cfdi: (_o = user == null ? void 0 : user.fiscalUsocfdi) != null ? _o : "G03",
          ordenar: process.env.SYSCOM_ORDENAR === "true"
        });
        syscomFolio = result.folio;
        syscomData = (_p = result.data) != null ? _p : void 0;
        syscomError = result.error;
        if (result.error) {
          const errLow = result.error.toLowerCase();
          if (errLow.includes("existencia") || errLow.includes("stock") || errLow.includes("disponible")) {
            syscomError = `Sin existencia suficiente en SYSCOM: ${result.error}`;
          }
        }
      } catch (e) {
        syscomError = e instanceof Error ? e.message : "Error al conectar con SYSCOM";
      }
    }
  }
  const auditEntry = {
    status: body.status,
    by: session.userId,
    byName: session.name,
    at: (/* @__PURE__ */ new Date()).toISOString(),
    ...syscomFolio ? { syscomFolio } : {},
    ...syscomError ? { syscomError } : {}
  };
  const prevLog = (_q = existing.auditLog) != null ? _q : [];
  const newLog = [...prevLog, auditEntry];
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      auditLog: newLog,
      ...body.status === "approved" ? { syscomFolio, syscomData } : {}
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  if (body.status === "approved" || body.status === "rejected" || body.status === "cancelled") {
    const titles = {
      approved: "\u2705 Pedido aprobado",
      rejected: "\u274C Pedido rechazado",
      cancelled: "\u{1F6AB} Pedido cancelado"
    };
    const messages = {
      approved: `Tu pedido por ${updated.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} fue aprobado${syscomFolio ? ` \xB7 Folio SYSCOM: ${syscomFolio}` : ""}.`,
      rejected: `Tu pedido por ${updated.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} fue rechazado.`,
      cancelled: `Tu pedido por ${updated.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} fue cancelado.`
    };
    await prisma.notification.create({
      data: {
        userId: existing.userId,
        type: "order",
        title: titles[body.status],
        message: messages[body.status],
        orderId: id
      }
    });
  }
  return {
    order: {
      id: updated.id,
      userId: updated.userId,
      userName: updated.user.name,
      userEmail: updated.user.email,
      status: updated.status,
      items: updated.items,
      total: updated.total,
      priority: updated.priority,
      notes: updated.notes,
      syscomFolio: updated.syscomFolio,
      cfdiUid: updated.cfdiUid,
      auditLog: updated.auditLog,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    },
    syscomError
  };
});

const _id__patch$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch$2
}, Symbol.toStringTag, { value: 'Module' }));

const retrySyscom_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const session = requireSession(event);
  if (session.role !== "admin" && session.role !== "approver") {
    throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
  }
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  if (order.status !== "approved") throw createError({ statusCode: 400, message: "Solo se puede reintentar en \xF3rdenes aprobadas" });
  if (order.syscomFolio) throw createError({ statusCode: 400, message: "Esta orden ya tiene folio SYSCOM" });
  const user = await prisma.user.findUnique({
    where: { id: order.userId },
    select: {
      name: true,
      fiscalRazonSocial: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCodpos: true,
      fiscalCiudad: true,
      fiscalEstado: true,
      fiscalPais: true,
      fiscalTelefono: true,
      fiscalUsocfdi: true
    }
  });
  const result = await generateSyscomOrder({
    tipo_entrega: "domicilio",
    direccion: {
      atencion_a: (_b = (_a = user == null ? void 0 : user.fiscalRazonSocial) != null ? _a : user == null ? void 0 : user.name) != null ? _b : "N/A",
      calle: (_c = user == null ? void 0 : user.fiscalCalle) != null ? _c : "",
      num_ext: (_d = user == null ? void 0 : user.fiscalNumExt) != null ? _d : "S/N",
      num_int: (_e = user == null ? void 0 : user.fiscalNumInt) != null ? _e : "",
      colonia: (_f = user == null ? void 0 : user.fiscalColonia) != null ? _f : "",
      codigo_postal: (_g = user == null ? void 0 : user.fiscalCodpos) != null ? _g : "",
      ciudad: (_h = user == null ? void 0 : user.fiscalCiudad) != null ? _h : "",
      estado: (_i = user == null ? void 0 : user.fiscalEstado) != null ? _i : "",
      pais: (_j = user == null ? void 0 : user.fiscalPais) != null ? _j : "MEX",
      telefono: (_k = user == null ? void 0 : user.fiscalTelefono) != null ? _k : ""
    },
    metodo_pago: (_l = process.env.SYSCOM_METODO_PAGO) != null ? _l : "03",
    productos: order.items.map((i) => ({ id: Number(i.productId), tipo: "nuevo", cantidad: i.quantity })),
    uso_cfdi: (_m = user == null ? void 0 : user.fiscalUsocfdi) != null ? _m : "G03",
    ordenar: process.env.SYSCOM_ORDENAR === "true"
  });
  if (result.error && !result.folio) {
    throw createError({ statusCode: 502, message: result.error });
  }
  const updated = await prisma.order.update({
    where: { id },
    data: { syscomFolio: result.folio, syscomData: (_n = result.data) != null ? _n : void 0 }
  });
  return { folio: updated.syscomFolio, syscomError: result.error };
});

const retrySyscom_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: retrySyscom_post
}, Symbol.toStringTag, { value: 'Module' }));

function isDelivered(estatus) {
  const s = (estatus != null ? estatus : "").toLowerCase();
  return s.includes("entrega") || s.includes("recib");
}
const syscomTrack_get = defineEventHandler(async (event) => {
  var _a;
  const session = requireSession(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  if (order.userId !== session.userId && session.role !== "admin" && session.role !== "approver") {
    throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
  }
  if (!order.syscomFolio) {
    throw createError({ statusCode: 400, message: "Este pedido no tiene folio SYSCOM" });
  }
  const token = await getSyscomToken();
  const res = await fetch(
    `https://developers.syscom.mx/api/v1/pedidos/${encodeURIComponent(order.syscomFolio)}`,
    { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } }
  );
  if (!res.ok) {
    const msg = res.status === 404 ? "Folio no encontrado en SYSCOM" : `SYSCOM respondi\xF3 con error ${res.status}`;
    throw createError({ statusCode: res.status === 404 ? 404 : 502, message: msg });
  }
  const tracking = await res.json();
  let statusUpdated = false;
  if (isDelivered((_a = tracking.estatus) != null ? _a : tracking.estado) && order.status !== "delivered") {
    await prisma.order.update({
      where: { id },
      data: { status: "delivered" }
    });
    statusUpdated = true;
  }
  return { tracking, statusUpdated };
});

const syscomTrack_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: syscomTrack_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$2 = defineEventHandler(async (event) => {
  var _a, _b;
  const session = requireSession(event);
  const isManager = session.role === "admin" || session.role === "approver";
  const q = getQuery$1(event);
  const page = Math.max(1, Number((_a = q.page) != null ? _a : 1));
  const perPage = Math.min(100, Math.max(1, Number((_b = q.per_page) != null ? _b : 30)));
  const status = q.status ? String(q.status) : void 0;
  const search = q.search ? String(q.search) : void 0;
  const where = {
    ...isManager ? {} : { userId: session.userId },
    ...status ? { status } : {},
    ...search ? {
      OR: [
        { id: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { syscomFolio: { contains: search } }
      ]
    } : {}
  };
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { user: { select: { id: true, name: true, email: true } } }
    }),
    prisma.order.count({ where })
  ]);
  return {
    orders: orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      userName: o.user.name,
      userEmail: o.user.email,
      status: o.status,
      items: o.items,
      total: o.total,
      priority: o.priority,
      notes: o.notes,
      syscomFolio: o.syscomFolio,
      cfdiUid: o.cfdiUid,
      auditLog: o.auditLog,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString()
    })),
    pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
  };
});

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$2 = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const session = requireSession(event);
  const body = await readBody(event);
  if (!((_a = body.items) == null ? void 0 : _a.length)) {
    throw createError({ statusCode: 400, message: "El carrito est\xE1 vac\xEDo" });
  }
  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: "\xCDtem inv\xE1lido en el carrito" });
    if (!item.quantity || item.quantity <= 0) throw createError({ statusCode: 400, message: `Cantidad inv\xE1lida para "${item.name}"` });
    if (item.price === void 0 || item.price < 0) throw createError({ statusCode: 400, message: `Precio inv\xE1lido para "${item.name}"` });
  }
  const serverTotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.round(serverTotal * 100) / 100;
  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      items: body.items,
      total,
      priority: (_b = body.priority) != null ? _b : "normal",
      notes: (_c = body.notes) != null ? _c : null
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  const admins = await prisma.user.findMany({
    where: { role: "admin", status: "active" },
    select: { id: true }
  });
  if (admins.length) {
    await prisma.notification.createMany({
      data: admins.map((a) => ({
        userId: a.id,
        type: "order",
        title: "Nuevo pedido recibido",
        message: `${order.user.name} realiz\xF3 un pedido por ${total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} (${body.items.length} art.)`,
        orderId: order.id
      }))
    });
  }
  return {
    order: {
      id: order.id,
      userId: order.userId,
      userName: order.user.name,
      userEmail: order.user.email,
      status: order.status,
      items: order.items,
      total: order.total,
      priority: order.priority,
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }
  };
});

const index_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const SAFE = /^[a-zA-Z0-9_\-]+$/;
const serverCache = /* @__PURE__ */ new Map();
function ttlFor(path) {
  if (path === "/categorias" || path === "/marcas" || path === "/tipocambio") return 30 * 6e4;
  if (/^\/productos\/\d+/.test(path)) return 5 * 6e4;
  return 2 * 6e4;
}
const ____path_ = defineEventHandler(async (event) => {
  var _a, _b;
  requireSession(event);
  const segments = ((_a = getRouterParam(event, "path")) != null ? _a : "").split("/").filter(Boolean);
  if (!segments.length || segments.length > 8 || !segments.every((s) => s.length > 0 && s.length < 120 && SAFE.test(s))) {
    throw createError({ statusCode: 400, message: "Ruta inv\xE1lida" });
  }
  const path = "/" + segments.join("/");
  const method = getMethod(event);
  const qs = getQuery$1(event);
  const url = new URL(`https://developers.syscom.mx/api/v1${path}`);
  Object.entries(qs).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const cacheKey = url.toString();
  if (method === "GET") {
    const hit = serverCache.get(cacheKey);
    if (hit && hit.exp > Date.now()) return hit.data;
  }
  const token = await getSyscomToken();
  let reqBody;
  if (method !== "GET" && method !== "HEAD") {
    const raw = await readBody(event).catch(() => null);
    if (raw != null) reqBody = JSON.stringify(raw);
  }
  const upstream = await fetch(cacheKey, {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: reqBody
  });
  const text = await upstream.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  setResponseStatus(event, upstream.status);
  if (!upstream.ok) {
    throw createError({ statusCode: upstream.status, data, message: (_b = data == null ? void 0 : data.message) != null ? _b : `SYSCOM ${upstream.status}` });
  }
  if (method === "GET") {
    if (serverCache.size > 600) {
      const now = Date.now();
      for (const [k, v] of serverCache) if (v.exp < now) serverCache.delete(k);
    }
    serverCache.set(cacheKey, { data, exp: Date.now() + ttlFor(path) });
  }
  return data;
});

const ____path_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: ____path_
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores pueden eliminar usuarios" });
  const id = getRouterParam(event, "id");
  if (id === session.userId) {
    throw createError({ statusCode: 400, message: "No puedes eliminar tu propia cuenta" });
  }
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  await prisma.user.delete({ where: { id } });
  return { ok: true };
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  if (body.email && typeof body.email === "string") {
    const dup = await prisma.user.findFirst({ where: { email: body.email.toLowerCase(), NOT: { id } } });
    if (dup) throw createError({ statusCode: 409, message: "Ya existe un usuario con ese correo" });
  }
  const data = {};
  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email.toLowerCase();
  if (body.role) data.role = body.role;
  if (body.status) data.status = body.status;
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true }
  });
  return { user };
});

const _id__patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch
}, Symbol.toStringTag, { value: 'Module' }));

const fiscal_patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") {
    throw createError({ statusCode: 403, message: "Solo administradores pueden editar datos fiscales de otros usuarios" });
  }
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const body = await readBody(event);
  const { rfc, razonSocial, codpos, email, regimen, pais } = body;
  if (!rfc || !razonSocial || !codpos || !email || !regimen || !pais) {
    throw createError({ statusCode: 400, message: "Faltan campos requeridos: RFC, Raz\xF3n Social, C\xF3digo Postal, Email, R\xE9gimen y Pa\xEDs" });
  }
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  const user = await prisma.user.update({
    where: { id },
    data: {
      fiscalCompleted: true,
      fiscalRfc: rfc.toUpperCase(),
      fiscalRazonSocial: razonSocial,
      fiscalCodpos: codpos,
      fiscalEmail: email.toLowerCase(),
      fiscalUsocfdi: body.usocfdi || null,
      fiscalRegimen: regimen,
      fiscalPais: pais.toUpperCase(),
      fiscalCalle: body.calle || null,
      fiscalNumExt: body.numeroExterior || null,
      fiscalNumInt: body.numeroInterior || null,
      fiscalColonia: body.colonia || null,
      fiscalCiudad: body.ciudad || null,
      fiscalDelegacion: body.delegacion || null,
      fiscalLocalidad: body.localidad || null,
      fiscalEstado: body.estado || null,
      fiscalNumregidtrib: body.numregidtrib || null,
      fiscalNombre: body.nombre || null,
      fiscalApellidos: body.apellidos || null,
      fiscalTelefono: body.telefono || null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
      facturaUid: true,
      fiscalCompleted: true,
      fiscalRfc: true,
      fiscalRazonSocial: true,
      fiscalCodpos: true,
      fiscalEmail: true,
      fiscalUsocfdi: true,
      fiscalRegimen: true,
      fiscalPais: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCiudad: true,
      fiscalDelegacion: true,
      fiscalLocalidad: true,
      fiscalEstado: true,
      fiscalNumregidtrib: true,
      fiscalNombre: true,
      fiscalApellidos: true,
      fiscalTelefono: true
    }
  });
  return { user };
});

const fiscal_patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: fiscal_patch
}, Symbol.toStringTag, { value: 'Module' }));

const fiscalData_patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const body = await readBody(event);
  const { rfc, razonSocial, codpos, email, regimen, pais } = body;
  if (!rfc || !razonSocial || !codpos || !email || !regimen || !pais) {
    throw createError({ statusCode: 400, message: "Faltan campos requeridos: RFC, Raz\xF3n Social, C\xF3digo Postal, Email, R\xE9gimen Fiscal y Pa\xEDs" });
  }
  const rfcClean = rfc.trim().toUpperCase();
  const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  if (!RFC_RE.test(rfcClean)) {
    throw createError({ statusCode: 400, message: `RFC inv\xE1lido: "${rfcClean}". Debe tener el formato SAT (ej: XAXX010101000 o GOME820101H25).` });
  }
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      fiscalCompleted: true,
      fiscalRfc: rfc.toUpperCase(),
      fiscalRazonSocial: razonSocial,
      fiscalCodpos: codpos,
      fiscalEmail: email.toLowerCase(),
      fiscalUsocfdi: body.usocfdi || null,
      fiscalRegimen: regimen,
      fiscalPais: pais.toUpperCase(),
      fiscalCalle: body.calle || null,
      fiscalNumExt: body.numeroExterior || null,
      fiscalNumInt: body.numeroInterior || null,
      fiscalColonia: body.colonia || null,
      fiscalCiudad: body.ciudad || null,
      fiscalDelegacion: body.delegacion || null,
      fiscalLocalidad: body.localidad || null,
      fiscalEstado: body.estado || null,
      fiscalNumregidtrib: body.numregidtrib || null,
      fiscalNombre: body.nombre || null,
      fiscalApellidos: body.apellidos || null,
      fiscalTelefono: body.telefono || null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
      facturaUid: true,
      fiscalCompleted: true,
      fiscalRfc: true,
      fiscalRazonSocial: true,
      fiscalCodpos: true,
      fiscalEmail: true,
      fiscalUsocfdi: true,
      fiscalRegimen: true,
      fiscalPais: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCiudad: true,
      fiscalDelegacion: true,
      fiscalLocalidad: true,
      fiscalEstado: true,
      fiscalNumregidtrib: true,
      fiscalNombre: true,
      fiscalApellidos: true,
      fiscalTelefono: true
    }
  });
  let facturaUid = user.facturaUid;
  let facturaError;
  try {
    const payload = {
      rfc: rfc.toUpperCase(),
      razons: razonSocial,
      codpos,
      email: email.toLowerCase(),
      regimen,
      pais: pais.toUpperCase(),
      usocfdi: body.usocfdi || void 0,
      calle: body.calle || void 0,
      numero_exterior: body.numeroExterior || void 0,
      numero_interior: body.numeroInterior || void 0,
      colonia: body.colonia || void 0,
      ciudad: body.ciudad || void 0,
      delegacion: body.delegacion || void 0,
      localidad: body.localidad || void 0,
      estado: body.estado || void 0,
      numregidtrib: body.numregidtrib || void 0,
      nombre: body.nombre || void 0,
      apellidos: body.apellidos || void 0,
      telefono: body.telefono || void 0
    };
    let cliente;
    if (facturaUid) {
      cliente = await actualizarCliente(facturaUid, payload);
    } else {
      const existente = await obtenerCliente(rfc.toUpperCase());
      if (existente == null ? void 0 : existente.UID) {
        facturaUid = existente.UID;
        cliente = await actualizarCliente(facturaUid, payload);
      } else {
        cliente = await crearCliente(payload);
        facturaUid = cliente.UID;
      }
    }
    if (facturaUid !== user.facturaUid) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { facturaUid }
      });
    }
  } catch (e) {
    facturaError = e instanceof Error ? e.message : "Error al sincronizar con Factura.com";
  }
  return { user: { ...user, facturaUid }, facturaError };
});

const fiscalData_patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: fiscalData_patch
}, Symbol.toStringTag, { value: 'Module' }));

const fiscal_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const users = await prisma.user.findMany({
    where: { role: { not: "admin" } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      fiscalCompleted: true,
      fiscalRfc: true,
      fiscalRazonSocial: true,
      fiscalCodpos: true,
      fiscalEmail: true,
      fiscalUsocfdi: true,
      fiscalRegimen: true,
      fiscalPais: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCiudad: true,
      fiscalDelegacion: true,
      fiscalLocalidad: true,
      fiscalEstado: true,
      fiscalNumregidtrib: true,
      fiscalNombre: true,
      fiscalApellidos: true,
      fiscalTelefono: true,
      facturaUid: true
    }
  });
  return { users };
});

const fiscal_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: fiscal_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  requireSession(event);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true }
  });
  return { users };
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const body = await readBody(event);
  const { name, email, password, role, status } = body;
  if (!name || !email || !password || !role || !status) {
    throw createError({ statusCode: 400, message: "Faltan campos requeridos" });
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, message: "La contrase\xF1a debe tener al menos 8 caracteres" });
  }
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw createError({ statusCode: 409, message: "Ya existe un usuario con ese correo" });
  const avatar = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hash,
      role,
      status,
      createdAt: today,
      avatar
    },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true }
  });
  return { user };
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}

function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const handler = defineRenderHandler((event) => {
	
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	
	const ssrContext = createSSRContext(event);
	
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		setSSRError(ssrContext, ssrError);
	}
	
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	
	!ssrContext.noSSR && (NUXT_RUNTIME_PAYLOAD_EXTRACTION);
	const isRenderingPayload = (routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
	}
	
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		
		
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	
	
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	if (ssrContext["~preloadManifest"] && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			fetchpriority: "low",
			crossorigin: "anonymous",
			href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`)
		}] }, {
			...headEntryOptions,
			tagPriority: "low"
		});
	}
	
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		
		
		
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		
		
		
		if (ssrContext["~lazyHydratedModules"]) {
			for (const id of ssrContext["~lazyHydratedModules"]) {
				ssrContext.modules?.delete(id);
			}
		}
		
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		
		ssrContext.head.push({ script: renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			
			
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
