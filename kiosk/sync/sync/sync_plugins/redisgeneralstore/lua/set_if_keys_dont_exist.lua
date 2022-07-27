---
--- checks that no keys with none of the given prefixes exist. Only if none exist,
--- and if requested, a different list of key prefixes will be set either as they
--- are or as keys + a unique identifier, if given.
---
--- input: KEYS[1]: string with the keys to check as a string, separated by "$"
---        KEYS[2]: optional another $-separated string with keys that will be set only, but not checked
---        ARGS[1]: the value that will be set for the keys
---        ARGS[2]: optional: the unique identifier that will be added to keys. Use an empty string if you don't want that.
---        ARGS[3]: optional. A timeout in second for those keys.
---
--- return: "ok": all was good
---         otherwise: an error occurred, most likely a  "LUA: key already exists" error.

local function split(s, sep)
    if sep == nil then
        sep = "%s"
    end
    local t = {}
    for str in string.gmatch(s, "([^" .. sep .. "]+)") do
        table.insert(t, str)
    end
    return t
end

local function is_empty(s)
    return s == nil or s == ''
end

local check_keys = split(KEYS[1], "$")
local value = ARGV[1]
local uid = ARGV[2]
local timeout = ARGV[3]
local rc
local set_keys
local key_pattern
local keys_found

rc = "ok"

if uid == nil then
    uid = ""
end

if timeout == 0 then
    timeout = nil
end

if not is_empty(KEYS[2]) then
    set_keys = split(KEYS[2], "$")
end

for i, key in ipairs(check_keys) do
    key_pattern = key .. "*"

    keys_found = redis.call('keys', key_pattern)
    if table.getn(keys_found) > 0 then
        rc = "LUA: key already exists: " .. key
        break
    end
end

if rc == "ok" and not (set_keys == nil) then
    for i, key in ipairs(set_keys) do
        if timeout == nil then
            redis.call('set', key .. uid, value)
        else
            redis.call('set', key .. uid, value, "EX", timeout)
        end
    end
end
return rc
