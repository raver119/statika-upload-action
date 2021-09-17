import {EndpointSchemaType} from "statika/build/"
import {parseURL} from "whatwg-url"

export function parseStorage(address: string): {
  schema: EndpointSchemaType
  host: string
  port: number
  path: string
} {
  const parsed = parseURL(address)
  if (parsed === null) throw new Error(`failed to parse address: [${address}]`)

  if (parsed.scheme !== "http" && parsed.scheme !== "https") throw new Error(`Unsupported protocol: ${parsed.scheme}`)

  // default ports should be processed separately
  let port = parsed.port
  if (port === null) port = parsed.scheme === "http" ? 80 : 443

  // path shouldn't be longer than 1 element at this point
  if (parsed.path.length > 1) throw new Error(`Got multiple buckets: ${JSON.stringify(parsed.path)}`)

  return {
    schema: parsed.scheme,
    host: parsed.host as string,
    port: port,
    path: parsed.path[0],
  }
}
