import * as wasm from './minimint_bridge_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1ff97572398b8875(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_31(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hdc8c4626431b2604(arg0, arg1);
}

function __wbg_adapter_38(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h53c9ab9c234a0062(arg0, arg1);
}

function __wbg_adapter_41(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hef08cca110e1bab3(arg0, arg1, addHeapObject(arg2));
}

/**
* If this returns Some, user has joined a federation. Otherwise they haven't.
* @returns {boolean}
*/
export function init() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.init(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
function __wbg_adapter_150(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h7ac01f719b35e8a0(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class WasmClient {

    static __wrap(ptr) {
        const obj = Object.create(WasmClient.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmclient_free(ptr);
    }
    /**
    * @param {string} _user_dir
    * @param {string} config_url
    * @returns {Promise<WasmClient>}
    */
    static join_federation(_user_dir, config_url) {
        const ptr0 = passStringToWasm0(_user_dir, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(config_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmclient_join_federation(ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    */
    leave_federation() {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmclient_leave_federation(retptr, ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Promise<any>}
    */
    balance() {
        const ret = wasm.wasmclient_balance(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {string} bolt11
    * @returns {Promise<any>}
    */
    pay(bolt11) {
        const ptr0 = passStringToWasm0(bolt11, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmclient_pay(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {bigint} amount
    * @returns {Promise<any>}
    */
    invoice(amount) {
        uint64CvtShim[0] = amount;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        const ret = wasm.wasmclient_invoice(this.ptr, low0, high0);
        return takeObject(ret);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_wasmclient_new(arg0) {
    const ret = WasmClient.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_bigint_new(arg0, arg1) {
    const ret = BigInt(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_fetch_b1379d93c1e2b015(arg0) {
    const ret = fetch(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export function __wbg_readyState_2c7569d8a3262845(arg0) {
    const ret = getObject(arg0).readyState;
    return ret;
};

export function __wbg_setonopen_87e4796bee3b823d(arg0, arg1) {
    getObject(arg0).onopen = getObject(arg1);
};

export function __wbg_setonerror_52d0cdb1d128ff9d(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

export function __wbg_setonclose_0e1e667ba7eb3401(arg0, arg1) {
    getObject(arg0).onclose = getObject(arg1);
};

export function __wbg_setonmessage_1c191b24460ef803(arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1);
};

export function __wbg_setbinaryType_48e8443aa2d614d4(arg0, arg1) {
    getObject(arg0).binaryType = takeObject(arg1);
};

export function __wbg_new_6553602c5dd43c85() { return handleError(function (arg0, arg1) {
    const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_close_62a759ac0e1fd096() { return handleError(function (arg0) {
    getObject(arg0).close();
}, arguments) };

export function __wbg_send_78d653e63982c7dc() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getStringFromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_send_dcd78e23aff3b58a() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_instanceof_Response_e928c54c1025470c(arg0) {
    const ret = getObject(arg0) instanceof Response;
    return ret;
};

export function __wbg_url_0f82030e7245954c(arg0, arg1) {
    const ret = getObject(arg1).url;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_status_5b4a574de7c5bbfe(arg0) {
    const ret = getObject(arg0).status;
    return ret;
};

export function __wbg_headers_1dc1ef92ba3d32b1(arg0) {
    const ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

export function __wbg_text_5cb78830c1a11c5b() { return handleError(function (arg0) {
    const ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_483f23f84dfd2751() { return handleError(function () {
    const ret = new Headers();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_append_fcf64231455390c4() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_wasClean_556c1f08b0d99213(arg0) {
    const ret = getObject(arg0).wasClean;
    return ret;
};

export function __wbg_code_790e295d8679c12a(arg0) {
    const ret = getObject(arg0).code;
    return ret;
};

export function __wbg_reason_37f66f7f8b4f5c3c(arg0, arg1) {
    const ret = getObject(arg1).reason;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_fetch_8c28485eb2d6317d(arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_data_751f064cdd700ef0(arg0) {
    const ret = getObject(arg0).data;
    return addHeapObject(ret);
};

export function __wbg_newwithstrandinit_41c86e821f771b24() { return handleError(function (arg0, arg1, arg2) {
    const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export const __wbg_clearTimeout_65417660fe82f08d = typeof clearTimeout == 'function' ? clearTimeout : notDefined('clearTimeout');

export function __wbg_setTimeout_131fc254e1bd5624() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1);
    return ret;
}, arguments) };

export function __wbg_process_e56fd54cf6319b6c(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_versions_77e21455908dad33(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

export function __wbg_node_0dd25d832e4785d5(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

export function __wbg_crypto_b95d7173266618a9(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export function __wbg_msCrypto_5a86d77a66230f81(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export function __wbg_static_accessor_NODE_MODULE_26b231378c1be7dd() {
    const ret = module;
    return addHeapObject(ret);
};

export function __wbg_require_0db1598d9ccecb30() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getRandomValues_b14734aa289bc356() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

export function __wbg_randomFillSync_91e2b39becca6147() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg_newnoargs_971e9a5abe185139(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_next_726d1c2255989269(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
};

export function __wbg_next_3d0c4cc33e7418c9() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_done_e5655b169bb04f60(arg0) {
    const ret = getObject(arg0).done;
    return ret;
};

export function __wbg_value_8f901bca1014f843(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};

export function __wbg_iterator_22ed2b976832ff0c() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
};

export function __wbg_get_72332cd2bc57924c() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_33d7bcddbbfa394a() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_e6a9fecc2bf26696() {
    const ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_self_fd00a1ef86d1b2ed() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_6f6e346d8bbd61d7() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_3348936ac49df00a() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_67175caf56f55ca9() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_02bbeeb60438c785(arg0) {
    const ret = getObject(arg0) instanceof ArrayBuffer;
    return ret;
};

export function __wbg_instanceof_Error_2082612c1902c887(arg0) {
    const ret = getObject(arg0) instanceof Error;
    return ret;
};

export function __wbg_new_3ee7ebe9952c1fbd(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_message_924b46658b69b295(arg0) {
    const ret = getObject(arg0).message;
    return addHeapObject(ret);
};

export function __wbg_name_e88a3b3a0f6b23c2(arg0) {
    const ret = getObject(arg0).name;
    return addHeapObject(ret);
};

export function __wbg_toString_dc4768002eeae1b0(arg0) {
    const ret = getObject(arg0).toString();
    return addHeapObject(ret);
};

export function __wbg_call_65af9f665ab6ade5() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_52205195aa880fc2(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_150(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_resolve_0107b3a501450ba0(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_then_18da6e5453572fc8(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_then_e5489f796341454b(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_buffer_34f5ec9f8a838ba0(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_88fdad741db1b182(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_new_cda198d9dbc6d7ea(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_1a930cfcda1a8067(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_length_51f19f73d6d9eff3(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_newwithlength_66e5530e7079ea1b(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_subarray_270ff8dd5582c1ac(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_has_3be27932089d278e() { return handleError(function (arg0, arg1) {
    const ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_set_2762e698c2f5b7e0() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbg_stringify_d8d1ee75d5b55ce4() { return handleError(function (arg0) {
    const ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper1713(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 647, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper1715(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 647, __wbg_adapter_31);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper1717(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 647, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper1719(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 647, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper2920(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 951, __wbg_adapter_38);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper2961(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 974, __wbg_adapter_41);
    return addHeapObject(ret);
};

