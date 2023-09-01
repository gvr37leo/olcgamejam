class Vector {
    constructor(...vals) {
        this.vals = vals;
    }
    map(callback) {
        for (var i = 0; i < this.vals.length; i++) {
            callback(this.vals, i);
        }
        return this;
    }
    mul(v) {
        return this.map((arr, i) => arr[i] *= v.vals[i]);
    }
    div(v) {
        return this.map((arr, i) => arr[i] /= v.vals[i]);
    }
    floor() {
        return this.map((arr, i) => arr[i] = Math.floor(arr[i]));
    }
    ceil() {
        return this.map((arr, i) => arr[i] = Math.ceil(arr[i]));
    }
    round() {
        return this.map((arr, i) => arr[i] = Math.round(arr[i]));
    }
    add(v) {
        return this.map((arr, i) => arr[i] += v.vals[i]);
    }
    sub(v) {
        return this.map((arr, i) => arr[i] -= v.vals[i]);
    }
    scale(s) {
        return this.map((arr, i) => arr[i] *= s);
    }
    length() {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * arr[i]);
        return Math.pow(sum, 0.5);
    }
    normalize() {
        return this.scale(1 / this.length());
    }
    to(v) {
        return v.c().sub(this);
    }
    lerp(v, weight) {
        return this.c().add(this.to(v).scale(weight));
    }
    c() {
        return Vector.fromArray(this.vals.slice());
    }
    overwrite(v) {
        return this.map((arr, i) => arr[i] = v.vals[i]);
    }
    dot(v) {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * v.vals[i]);
        return sum;
    }
    angle2d(b) {
        return Math.acos(this.dot(b) / (this.length() + b.length()));
    }
    rotate2d(turns) {
        var radians = turns * Math.PI * 2;
        var cost = Math.cos(radians);
        var sint = Math.sin(radians);
        var x = this.x * cost - this.y * sint;
        var y = this.x * sint + this.y * cost;
        this.x = x;
        this.y = y;
        return this;
    }
    rotate3d(axis, radians) {
        var cost = Math.cos(radians);
        var sint = Math.sin(radians);
        var res = this.c().scale(cost);
        res.add(axis.cross(this).scale(sint));
        res.add(axis.c().scale(axis.dot(this) * (1 - cost)));
        this.overwrite(res);
        return this;
    }
    anglediff3d(v) {
        return Math.acos(this.dot(v) / (this.length() * v.length()));
    }
    projectOnto(v) {
        // https://www.youtube.com/watch?v=fjOdtSu4Lm4&list=PLImQaTpSAdsArRFFj8bIfqMk2X7Vlf3XF&index=1
        var vnormal = v.c().normalize();
        return vnormal.scale(this.dot(vnormal));
    }
    static reflect(normalout, vecin) {
        var vecout = vecin.c().scale(-1);
        var center = vecout.projectOnto(normalout);
        var vec2center = vecout.to(center);
        var refl = vecout.add(vec2center.scale(2));
        return refl;
    }
    wedge(v) {
        // https://www.youtube.com/watch?v=tjTRXzwdU6A&list=PLImQaTpSAdsArRFFj8bIfqMk2X7Vlf3XF&index=7
        return this.x * v.y - this.y * v.x;
    }
    //wedge can be used for collission detection
    //https://www.youtube.com/watch?v=tjTRXzwdU6A&list=PLImQaTpSAdsArRFFj8bIfqMk2X7Vlf3XF&index=8
    //1:18:06
    area(v) {
        return this.wedge(v) / 2;
    }
    loop(callback) {
        var counter = this.c();
        counter.vals.fill(0);
        while (counter.compare(this) == -1) {
            callback(counter);
            if (counter.incr(this)) {
                break;
            }
        }
    }
    compare(v) {
        for (var i = this.vals.length - 1; i >= 0; i--) {
            if (this.vals[i] < v.vals[i]) {
                continue;
            }
            else if (this.vals[i] == v.vals[i]) {
                return 0;
            }
            else {
                return 1;
            }
        }
        return -1;
    }
    equal(v) {
        return this.x == v.x && this.y == v.y;
    }
    incr(comparedTo) {
        for (var i = 0; i < this.vals.length; i++) {
            if ((this.vals[i] + 1) < comparedTo.vals[i]) {
                this.vals[i]++;
                return false;
            }
            else {
                this.vals[i] = 0;
            }
        }
        return true;
    }
    project(v) {
        return v.c().scale(this.dot(v) / v.dot(v));
    }
    get(i) {
        return this.vals[i];
    }
    set(i, val) {
        this.vals[i] = val;
    }
    get x() {
        return this.vals[0];
    }
    get y() {
        return this.vals[1];
    }
    get z() {
        return this.vals[2];
    }
    set x(val) {
        this.vals[0] = val;
    }
    set y(val) {
        this.vals[1] = val;
    }
    set z(val) {
        this.vals[2] = val;
    }
    draw(ctxt) {
        var width = 10;
        var halfwidth = width / 2;
        ctxt.fillRect(this.x - halfwidth, this.y - halfwidth, width, width);
    }
    cross(v) {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
    static fromArray(vals) {
        var x = new Vector();
        x.vals = vals;
        return x;
    }
    loop2d(callback) {
        var counter = new Vector(0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                callback(counter);
            }
        }
    }
    loop3d(callback) {
        var counter = new Vector(0, 0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                for (counter.z = 0; counter.z < this.z; counter.z++) {
                    callback(counter);
                }
            }
        }
    }
}
// (window as any).devtoolsFormatters = [
//     {
//         header: function(obj, config){
//             if(!(obj instanceof Vector)){
//                 return null
//             }
//             if((obj.vals.length == 2)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y}`]
//             }
//             if((obj.vals.length == 3)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y} z:${obj.z}`]
//             }
//         },
//         hasBody: function(obj){
//             return false
//         },
//     }
// ]
class RNG {
    constructor(seed) {
        this.seed = seed;
        this.mod = 4294967296;
        this.multiplier = 1664525;
        this.increment = 1013904223;
    }
    next() {
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod;
        return this.seed;
    }
    norm() {
        return this.next() / this.mod;
    }
    range(min, max) {
        return lerp(min, max, this.norm());
    }
    rangeCenter(center, dif) {
        return this.range(center - dif, center + dif);
    }
    rangeFloor(min, max) {
        return Math.floor(this.range(min, max));
    }
    choose(arr) {
        return arr[this.rangeFloor(0, arr.length)];
    }
    shuffle(arr) {
        for (var end = arr.length; end > 0; end--) {
            swap(arr, this.rangeFloor(0, end), end);
        }
        return arr;
    }
}
class Store {
    constructor() {
        this.map = new Map();
        this.counter = 0;
    }
    get(id) {
        return this.map.get(id);
    }
    add(item) {
        item.id = this.counter++;
        this.map.set(item.id, item);
    }
    list() {
        return Array.from(this.map.values());
    }
    remove(id) {
        var val = this.map.get(id);
        this.map.delete(id);
        return val;
    }
}
var TAU = Math.PI * 2;
function map(val, from1, from2, to1, to2) {
    return lerp(to1, to2, inverseLerp(val, from1, from2));
}
function inverseLerp(val, a, b) {
    return to(a, val) / to(a, b);
}
function inRange(min, max, value) {
    if (min > max) {
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}
function min(a, b) {
    if (a < b)
        return a;
    return b;
}
function max(a, b) {
    if (a > b)
        return a;
    return b;
}
function clamp(val, min, max) {
    return this.max(this.min(val, max), min);
}
function rangeContain(a1, a2, b1, b2) {
    return max(a1, a2) >= max(b1, b2) && min(a1, a2) <= max(b1, b2);
}
function startMouseListen(localcanvas) {
    var mousepos = new Vector(0, 0);
    document.addEventListener('mousemove', (e) => {
        mousepos.overwrite(getMousePos(localcanvas, e));
    });
    return mousepos;
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}
function createCanvas(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas);
    var ctxt = canvas.getContext('2d');
    return { ctxt: ctxt, canvas: canvas };
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
var lastUpdate = Date.now();
function loop(callback) {
    var now = Date.now();
    callback((now - lastUpdate) / 1000);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}
function mod(number, modulus) {
    return ((number % modulus) + modulus) % modulus;
}
var keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
function getMoveInput() {
    var dir = new Vector(0, 0);
    if (keys['a'])
        dir.x--; //left
    if (keys['w'])
        dir.y++; //up
    if (keys['d'])
        dir.x++; //right
    if (keys['s'])
        dir.y--; //down
    return dir;
}
function getMoveInputYFlipped() {
    var input = getMoveInput();
    input.y *= -1;
    return input;
}
function loadTextFiles(strings) {
    var promises = [];
    for (var string of strings) {
        var promise = fetch(string)
            .then(resp => resp.text())
            .then(text => text);
        promises.push(promise);
    }
    return Promise.all(promises);
}
function loadImages(urls) {
    var promises = [];
    for (var url of urls) {
        promises.push(new Promise((res, rej) => {
            var image = new Image();
            image.onload = e => {
                res(image);
            };
            image.src = url;
        }));
    }
    return Promise.all(promises);
}
function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0]);
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i]);
        if (score > bestscore) {
            bestscore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}
function lerp(a, b, r) {
    return a + to(a, b) * r;
}
function to(a, b) {
    return b - a;
}
function swap(arr, a = 0, b = 1) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
function first(arr) {
    return arr[0];
}
function last(arr) {
    return arr[arr.length - 1];
}
function create2DArray(size, filler) {
    var result = new Array(size.y);
    for (var i = 0; i < size.y; i++) {
        result[i] = new Array(size.x);
    }
    size.loop2d(v => {
        result[v.y][v.x] = filler(v);
    });
    return result;
}
function get2DArraySize(arr) {
    return new Vector(arr[0].length, arr.length);
}
function index2D(arr, i) {
    return arr[i.x][i.y];
}
function copy2dArray(arr) {
    return create2DArray(get2DArraySize(arr), pos => index2D(arr, pos));
}
function round(number, decimals) {
    var mul = 10 ** decimals;
    return Math.round(number * mul) / mul;
}
var rng = new RNG(0);
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(rng.norm() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
class StopWatch {
    constructor() {
        this.starttimestamp = Date.now();
        this.pausetimestamp = Date.now();
        this.pausetime = 0;
        this.paused = true;
    }
    get() {
        var currentamountpaused = 0;
        if (this.paused) {
            currentamountpaused = to(this.pausetimestamp, Date.now());
        }
        return to(this.starttimestamp, Date.now()) - (this.pausetime + currentamountpaused);
    }
    start() {
        this.paused = false;
        this.starttimestamp = Date.now();
        this.pausetime = 0;
    }
    continue() {
        if (this.paused) {
            this.paused = false;
            this.pausetime += to(this.pausetimestamp, Date.now());
        }
    }
    pause() {
        if (this.paused == false) {
            this.paused = true;
            this.pausetimestamp = Date.now();
        }
    }
    reset() {
        this.paused = true;
        this.starttimestamp = Date.now();
        this.pausetimestamp = Date.now();
        this.pausetime = 0;
    }
}
class Rule {
    constructor(message, cb) {
        this.message = message;
        this.cb = cb;
    }
}
class Ability {
    constructor(cb) {
        this.cb = cb;
        // ammo:number = 1
        // maxammo:number = 1
        // ammorechargerate:number = 1000
        // casttime:number = 2000
        // channelduration:number = 3000
        this.cooldown = 1000;
        this.lastfire = Date.now();
        this.rules = [
            new Rule('not ready yet', () => (this.lastfire + this.cooldown) < Date.now()),
        ];
        this.stopwatch = new StopWatch();
        this.ventingtime = 0;
        this.onCastFinished = new EventSystem();
        this.shots = 0;
        this.firing = false;
    }
    //positive if you need to wait 0 or negative if you can call it
    timeTillNextPossibleActivation() {
        return to(Date.now(), this.lastfire + this.cooldown);
    }
    canActivate() {
        return this.rules.every(r => r.cb());
    }
    callActivate() {
        this.cb();
    }
    fire() {
        if (this.firing == false) {
            this.startfire();
        }
        else {
            this.holdfire();
        }
    }
    releasefire() {
        this.firing = false;
    }
    tapfire() {
        this.startfire();
        this.releasefire();
    }
    startfire() {
        if (this.rules.some(r => r.cb())) {
            this.firing = true;
            this.ventingtime = 0;
            this.stopwatch.start();
            this.ventingtime -= this.cooldown;
            this.shots = 1;
            this.lastfire = Date.now();
            this.cb();
        }
    }
    holdfire() {
        this.ventingtime += this.stopwatch.get();
        this.stopwatch.start();
        this.shots = Math.ceil(this.ventingtime / this.cooldown);
        this.ventingtime -= this.shots * this.cooldown;
        this.lastfire = Date.now();
        if (this.shots > 0) {
            this.cb();
        }
    }
}
var AnimType;
(function (AnimType) {
    AnimType[AnimType["once"] = 0] = "once";
    AnimType[AnimType["repeat"] = 1] = "repeat";
    AnimType[AnimType["pingpong"] = 2] = "pingpong";
    AnimType[AnimType["extend"] = 3] = "extend";
})(AnimType || (AnimType = {}));
class Anim {
    constructor() {
        this.animType = AnimType.once;
        this.reverse = false;
        this.duration = 1000;
        this.stopwatch = new StopWatch();
        this.begin = 0;
        this.end = 1;
    }
    get() {
        var cycles = this.stopwatch.get() / this.duration;
        switch (this.animType) {
            case AnimType.once:
                return clamp(lerp(this.begin, this.end, cycles), this.begin, this.end);
            case AnimType.repeat:
                return lerp(this.begin, this.end, mod(cycles, 1));
            case AnimType.pingpong:
                var pingpongcycle = mod(cycles, 2);
                if (pingpongcycle <= 1) {
                    return lerp(this.begin, this.end, pingpongcycle);
                }
                else {
                    return lerp(this.end, this.begin, pingpongcycle - 1);
                }
            case AnimType.extend:
                var distPerCycle = to(this.begin, this.end);
                return Math.floor(cycles) * distPerCycle + lerp(this.begin, this.end, mod(cycles, 1));
        }
    }
}
class Rect {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    static fromsize(pos, size) {
        return new Rect(pos.c(), pos.c().add(size));
    }
    static fromCenter(center, size) {
        var halfsize = size.c().scale(0.5);
        var pos = center.c().sub(halfsize);
        return new Rect(pos.c(), pos.c().add(size));
    }
    collidePoint(point) {
        for (var i = 0; i < this.min.vals.length; i++) {
            if (!inRange(this.min.vals[i], this.max.vals[i], point.vals[i])) {
                return false;
            }
        }
        return true;
    }
    size() {
        return this.min.to(this.max);
    }
    collideBox(other) {
        var x = rangeOverlap(this.min.x, this.max.x, other.min.x, other.max.x);
        var y = rangeOverlap(this.min.y, this.max.y, other.min.y, other.max.y);
        return x && y;
    }
    getPoint(relativePos) {
        return this.min.c().add(this.size().mul(relativePos));
    }
    draw(ctxt) {
        var size = this.size();
        ctxt.fillRect(this.min.x, this.min.y, size.x, size.y);
    }
    moveTo(pos) {
        var size = this.size();
        this.min = pos.c();
        this.max = this.min.c().add(size);
    }
    moveToCentered(pos) {
        var halfsize = this.size().scale(0.5);
        this.moveTo(pos.c().sub(halfsize));
    }
    loop(callback) {
        var temp = this.max.c();
        this.size().loop(v2 => {
            temp.overwrite(v2);
            temp.add(this.min);
            callback(temp);
        });
    }
}
function rangeOverlap(range1A, range1B, range2A, range2B) {
    return range1A <= range2B && range2A <= range1B;
}
class EventQueue {
    constructor() {
        this.idcounter = 0;
        this.onProcessFinished = new EventSystem();
        this.onRuleBroken = new EventSystem();
        this.rules = [];
        this.discoveryidcounter = 0;
        this.listeners = [];
        this.events = [];
    }
    // listenDiscovery(type:string,megacb:(data:any,cb:(cbdata:any) => void) => void){
    //     this.listen(type,(dataAndCb:{data:any,cb:(ads:any) => void}) => {
    //         megacb(dataAndCb.data,dataAndCb.cb)
    //     })
    // }
    // startDiscovery(type:string,data: any, cb: (cbdata: any) => void) {
    //     this.addAndTrigger(type,{data,cb})
    // }
    listenDiscovery(type, cb) {
        this.listen(type, (discovery) => {
            cb(discovery.data, discovery.id);
        });
    }
    startDiscovery(type, data, cb) {
        let createdid = this.discoveryidcounter++;
        let listenerid = this.listen('completediscovery', (discovery) => {
            if (discovery.data.id == createdid) {
                this.unlisten(listenerid);
                cb(discovery.data.data);
            }
        });
        this.addAndTrigger(type, { data, id: createdid });
    }
    completeDiscovery(data, id) {
        this.addAndTrigger('completediscovery', { data, id });
    }
    listen(type, cb) {
        var id = this.idcounter++;
        this.listeners.push({
            id: id,
            type: type,
            cb,
        });
        return id;
    }
    listenOnce(type, cb) {
        let id = this.listen(type, (data) => {
            this.unlisten(id);
            cb(data);
        });
        return id;
    }
    unlisten(id) {
        var index = this.listeners.findIndex(o => o.id == id);
        this.listeners.splice(index, 1);
    }
    process() {
        while (this.events.length > 0) {
            let currentEvent = this.events.shift();
            let listeners = this.listeners.filter(l => l.type == currentEvent.type);
            let brokenrules = this.rules.filter(r => r.type == currentEvent.type && r.rulecb(currentEvent.data) == false);
            if (brokenrules.length == 0) {
                for (let listener of listeners) {
                    listener.cb(currentEvent.data);
                }
            }
            else {
                console.log(first(brokenrules).error);
                this.onRuleBroken.trigger({ event: currentEvent, error: first(brokenrules).error });
            }
        }
        this.onProcessFinished.trigger(0);
    }
    add(type, data) {
        this.events.push({
            type: type,
            data: data,
        });
    }
    addAndTrigger(type, data) {
        this.add(type, data);
        this.process();
    }
    addRule(type, error, rulecb) {
        this.rules.push({ type, error, rulecb });
    }
}
class EventSystem {
    constructor() {
        this.idcounter = 0;
        this.listeners = [];
    }
    listen(cb) {
        var listener = {
            id: this.idcounter++,
            cb: cb,
        };
        this.listeners.push(listener);
        return listener.id;
    }
    unlisten(id) {
        var index = this.listeners.findIndex(o => o.id == id);
        this.listeners.splice(index, 1);
    }
    trigger(val) {
        for (var listener of this.listeners) {
            listener.cb(val);
        }
    }
}
class Camera {
    constructor(ctxt) {
        this.ctxt = ctxt;
        this.pos = new Vector(0, 0);
        this.scale = new Vector(1, 1);
    }
    begin() {
        ctxt.save();
        var m = this.createMatrixScreen2World().inverse();
        ctxt.transform(m.a, m.b, m.c, m.d, m.e, m.f);
    }
    end() {
        ctxt.restore();
    }
    createMatrixScreen2World() {
        var a = new DOMMatrix([
            1, 0, 0, 1, -screensize.x / 2, -screensize.y / 2
        ]);
        var b = new DOMMatrix([
            this.scale.x, 0, 0, this.scale.y, this.pos.x, this.pos.y
        ]);
        return b.multiply(a);
    }
    screen2world(pos) {
        var dompoint = this.createMatrixScreen2World().transformPoint(new DOMPoint(pos.x, pos.y));
        return new Vector(dompoint.x, dompoint.y);
    }
    world2screen(pos) {
        var dompoint = this.createMatrixScreen2World().inverse().transformPoint(new DOMPoint(pos.x, pos.y));
        return new Vector(dompoint.x, dompoint.y);
    }
}
class NetEntity {
    constructor(init) {
        this.id = null;
        this.parent = null;
        this.type = '';
        this.name = '';
        this.children = [];
        // ordercount = 0
        // sortorder = 0
        this.synced = false;
        Object.assign(this, init);
        this.type = 'entity';
    }
    setChild(child) {
        //remove child from old parent
        var oldparent = NetEntity.globalEntityStore.get(child.parent);
        if (oldparent != null) {
            remove(oldparent.children, child.id);
        }
        this.children.push(child.id);
        child.parent = this.id;
        // child.sortorder = this.ordercount++
    }
    setParent(parent) {
        if (parent == null) {
            this.parent = null;
        }
        else {
            parent.setChild(this);
        }
    }
    getParent() {
        return NetEntity.globalEntityStore.get(this.parent);
    }
    descendant(cb) {
        return this.descendants(cb)[0];
    }
    descendants(cb) {
        var children = this._children(cb);
        var grandchildren = children.flatMap(c => c.descendants(cb));
        return children.concat(grandchildren);
    }
    child(cb) {
        return this._children(cb)[0];
    }
    _children(cb) {
        return this.children.map(id => NetEntity.globalEntityStore.get(id)).filter(cb);
    }
    allChildren() {
        return this._children(() => true);
    }
    remove() {
        remove(this.getParent().children, this.id);
        NetEntity.globalEntityStore.remove(this.id);
        this.removeChildren();
        return this;
    }
    inject(parent) {
        NetEntity.globalEntityStore.add(this);
        this.setParent(parent);
        return this;
    }
    removeChildren() {
        this.descendants(() => true).forEach(e => NetEntity.globalEntityStore.remove(e.id));
        this.children = [];
    }
    ancestor(cb) {
        var current = this;
        while (current != null && cb(current) == false) {
            current = NetEntity.globalEntityStore.get(current.parent);
        }
        return current;
    }
}
/*
class ServerClient{
    
    output = new EventSystem<any>()
    sessionid: number = null

    constructor(public socket, public id){


        this.socket.on('message',(data) => {
            this.output.trigger(data)
        })
    }

    input(type,data){
        this.socket.emit('message',{type,data})
    }
}

class Server{
    // gamemanager: GameManager;
    output = new EventSystem<{type:string,data:any}>()
    clients = new Store<ServerClient>()
    sessionidcounter = 0

    onBroadcast = new EventSystem<{type:string,data:any}>()

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.addAndTrigger('init',null)

        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.updateClients()
            set synced status of updated entities to true
        })

        this.gamemanager.broadcastEvent.listen((event) => {
            for(var client of this.clients.list()){
                client.input(event.type,event.data)
            }
        })

        this.gamemanager.sendEvent.listen((event) => {
            this.clients.list().filter(c => c.sessionid == event.sessionid).forEach(c => c.input(event.type,event.data))
        })

        setInterval(() => {
            var longdcedplayers = this.gamemanager.helper.getPlayers().filter(p => p.disconnected == true && (Date.now() - p.dctimestamp) > 5_000 )
            longdcedplayers.forEach(p => {
                console.log(`removed disconnected player:${p.name}`)
                p.remove()
            })
            if(longdcedplayers.length > 0){
                this.updateClients()
            }
        },5000)
    }

    updateClients(){
        this.gamemanager.broadcastEvent.trigger({type:'update',data:this.gamemanager.entityStore.list()})
    }

    connect(client:ServerClient){
        this.clients.add(client)
        let players = this.gamemanager.helper.getPlayers()

        //client does a handshake
        //if client sends sessionID look for a player with that sessionid
        //if not found or client sends no sessionid create a new player with a new sessionid
        //finish handshake by sending client and sessionid
        //when a client disconnects flag player as dc'ed and set dc timestamp after 2 min delete dc'ed players

        //client should connect, check for sessionid in localstore/sessionstorage
        //then initiate handshake send found sessionid
        //save session and client id on client and look in database for player with sessionid = client.sessionid
        client.socket.on('handshake',(data,fn) => {
            
            let sessionid = data.sessionid
            if(sessionid == null){
               sessionid = this.sessionidcounter++
            }
            this.sessionidcounter = Math.max(sessionid,this.sessionidcounter)//should create random guid instead
            client.sessionid = sessionid
            console.log(`user connected:${client.sessionid}`)

            let foundplayer = players.find(p => p.sessionid == sessionid)
            if(foundplayer == null){
                let player = new Player({clientid:client.id,sessionid:sessionid})
                player.inject(this.gamemanager.helper.getPlayersNode())
                
            }else{
                foundplayer.clientid = client.id
                foundplayer.disconnected = false
                //reconnection dont create new player but do change the pointer to the new client
            }

            fn({
                clientid:client.id,
                sessionid:sessionid,
            })
            this.updateClients()
        })

        
        

        client.socket.on('disconnect',() => {
            //watch out for multiple connected clients
            this.clients.remove(client.id)
            var sessionplayer = this.gamemanager.helper.getSessionPlayer(client.sessionid)
            console.log(`user disconnected:${client.sessionid}`)
            //this often goes wrong for some reason
            //maybe when multiple clients are connected the old player's clientid gets overwritten
            //also goes wrong when a second tab connects and disconnects
            // check if other clients use the same sessionid
            
            var connectedclients = this.clients.list().filter(c => c.sessionid == client.sessionid)
            if(connectedclients.length == 0){
                sessionplayer.disconnected = true
                sessionplayer.dctimestamp = Date.now()
            }
            
            this.updateClients()
        })

        client.output.listen(e => {
            server.input(e.type,{clientid:client.id,sessionid:client.sessionid,data:e.data})
        })
    }

    input(type,data){
        this.gamemanager.eventQueue.addAndTrigger(type,data)
    }

    serialize(){
        //only serialize unsynced entitys
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    
}

*/ 
var contextStack = [[document.body]];
function currentContext() {
    return last(contextStack);
}
function startContext(element) {
    contextStack.push([element]);
}
function endContext() {
    contextStack.pop();
}
function scr(tag, attributes = {}) {
    flush();
    return cr(tag, attributes);
}
function cr(tag, attributes = {}) {
    var parent = peek();
    var element = document.createElement(tag);
    if (parent) {
        parent.appendChild(element);
    }
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    currentContext().push(element);
    return element;
}
function crend(tag, textstring, attributes = {}) {
    cr(tag, attributes);
    text(textstring);
    return end();
}
function text(data) {
    peek().textContent = data;
    return peek();
}
function html(html) {
    peek().innerHTML = html;
}
function end(endelement = null) {
    var poppedelement = currentContext().pop();
    if (endelement != null && endelement != poppedelement) {
        console.warn(poppedelement, ' doesnt equal ', endelement);
    }
    return poppedelement;
}
HTMLElement.prototype.on = function (event, cb) {
    this.addEventListener(event, cb);
    return this;
};
function peek() {
    var context = currentContext();
    return last(context);
}
function flush() {
    var context = currentContext();
    var root = context[0];
    context.length = 0;
    return root;
}
function div(options = {}) {
    return cr('div', options);
}
function a(options = {}) {
    return cr('a', options);
}
function button(text, options = {}) {
    return crend('button', text, options);
}
function input(options = {}) {
    return crend('input', options);
}
function img(options = {}) {
    return crend('img', options);
}
function stringToHTML(str) {
    var temp = document.createElement('template');
    temp.innerHTML = str;
    return temp.content.firstChild;
}
function upsertChild(parent, child) {
    if (parent.firstChild) {
        parent.replaceChild(child, parent.firstChild);
    }
    else {
        parent.appendChild(child);
    }
}
function qs(element, query) {
    if (typeof element == 'string') {
        return document.body.querySelector(element);
    }
    return element.querySelector(query);
}
function qsa(element, query) {
    return Array.from(element.querySelectorAll(query));
}
class KeyFrame {
    constructor(data) {
        this.value = 0;
        this.timestamp = 0;
        Object.assign(this, data);
    }
}
class Sequencer {
    constructor(data) {
        this.keyframes = [];
        this.current = 0;
        Object.assign(this, data);
    }
    anim(val, time) {
        this.keyframes.push(new KeyFrame({
            value: val,
            timestamp: this.current + time,
        }));
        this.last = last(this.keyframes);
        this.current += time;
        return this;
    }
    show(time) {
        this.anim(0, 0);
        this.anim(1, time);
        return this;
    }
    hide(time) {
        this.anim(1, 0);
        this.anim(0, time);
        return this;
    }
    pause(time) {
        this.current += time;
        return this;
    }
    wait() {
        this.current = this.last.timestamp;
    }
    waitAndPause(time) {
        this.wait();
        this.pause(time);
        return this;
    }
    branch() {
        var seq = new Sequencer(this);
        seq.keyframes = this.keyframes.slice();
    }
    seek(time) {
        if (time <= first(this.keyframes).timestamp) {
            return first(this.keyframes).value;
        }
        if (time >= last(this.keyframes).timestamp) {
            return last(this.keyframes).value;
        }
        for (var i = 0; i < this.keyframes.length; i++) {
            var a = this.keyframes[i];
            var b = this.keyframes[i + 1];
            if (inRange(a.timestamp, b.timestamp, time)) {
                return map(time, a.timestamp, b.timestamp, a.value, b.value);
            }
        }
        return 0;
    }
    seekRel(ratio) {
        return this.seek(ratio * this.last.timestamp);
    }
    curve(x, a, b) {
        return (a + b - 2) * x * x * x + (3 - 2 * a - b) * x * x + a * x;
    }
}
// public class SeqAnim {
//     public string name;
//     public float value;
//     public float timestamp;
//     public Action cb = () => { };
//     public Action update = () => { };
//     public bool hit = false;
// }
// public class Sequencer {
//     //ordered list of values and timestamps
//     //public List callbacks
//     public Dictionary<string,List<SeqAnim>> anims = new Dictionary<string, List<SeqAnim>>();
//     public float current = 0;
//     public float time;
//     public SeqAnim last;
//     public Sequencer Anim(float val, float time, string name) {
//         if(anims.ContainsKey(name) == false) {
//             anims[name] = new List<SeqAnim>();
//         }
//         anims[name].Add(new SeqAnim() {
//             name = name,
//             value = val,
//             timestamp = current + time,
//         });
//         last = anims[name].Last();
//         return this;
//     }
//     public Sequencer Show(float time, string name) {
//         Anim(0,0,name);
//         Anim(1,time,name);
//         return this;
//     }
//     public Sequencer Hide(float time, string name) {
//         Anim(1, 0, name);
//         Anim(0, time, name);
//         return this;
//     }
//     //public Sequencer Listen(string name, string type, Action cb) {
//     //    anims["_cbevent"].Add(new SeqAnim() {
//     //        name = "_cbevent",
//     //        timestamp = current,
//     //        cb = cb,
//     //    });
//     //    return this;
//     //}
//     public void Listen(Action cb) {
//         last.cb = cb;
//     }
//     public void OnUpdate(Action cb) {
//         last.update = cb;
//     }
//     //wait before starting the next animation
//     public Sequencer Pause(float time) {
//         current += time;
//         return this;
//     }
//     //wait for current animation to finish then continue with remaining animations
//     public Sequencer Wait() {
//         current = last.timestamp;
//         return this;
//     }
//     public Sequencer WaitAndPause(float time) {
//         Wait();
//         Pause(time);
//         return this;
//     }
//     //multiple current pointers adding to the same anims list
//     public Sequencer Branch() {
//         var seq = new Sequencer();
//         seq.current = current;
//         seq.keyframes = anims;
//         return seq;
//     }
//     public float Seek(float time, string name) {
//         var vals = anims[name].Where(a => a.name == name).ToList();
//         if(time < vals.First().timestamp) {
//             return vals.First().value;
//         }
//         if(time > vals.Last().timestamp) {
//             return vals.Last().value;
//         }
//         for(int i = 0; i < vals.Count; i++) {
//             var a = vals[i];
//             var b = vals[i + 1];
//             if (inRange(time, a.timestamp, b.timestamp)) {
//                 return map(time, a.timestamp, b.timestamp, a.value, b.value);
//             }
//         }
//         return 0;
//     }
//     public float Curve(float x, float a, float b) {
//         return (a + b - 2) * x * x * x + (3 - 2 * a - b) * x * x + a * x;
//     }
//     public void Update(float dt) {
//         time += dt;
//         foreach (var pair in anims) {
//             if (inRange(time, pair.Value.First().timestamp, pair.Value.Last().timestamp)) {
//                 pair.Value.Last().update();
//             }
//             foreach (var anim in pair.Value.Where(a => a.hit == false && time <= a.timestamp)) {
//                 anim.hit = true;
//                 anim.cb();
//             }
//         }
//     }
// }
function initBits(pos, array, vertical = false, start = 0, end = -1) {
    if (end == -1) {
        end = array.length;
    }
    pos = pos.c();
    var res = [];
    for (var i = start; i < array.length && i < end; i++) {
        entitys.push(new Entity({
            pos: pos.c(),
            rect: Rect.fromsize(pos, tilesize),
            type: 'bit',
            updatecb(self) {
            },
            drawcb(self) {
                var bit = self.data;
                ctxt.textAlign = 'center';
                ctxt.textBaseline = 'middle';
                ctxt.font = '30px Arial';
                ctxt.fillStyle = bit.get() ? 'white' : 'black';
                fillRect(self.pos, tilesize);
                ctxt.fillStyle = bit.get() ? 'black' : 'white';
                ctxt.fillText(bit.get().toString(), self.pos.x + halfsize.x, self.pos.y + halfsize.y + 3);
            },
            data: new Bit({
                array,
                index: i,
            })
        }));
        if (vertical) {
            pos.y += tilesize.y;
        }
        else {
            pos.x += tilesize.x;
        }
        res.push(last(entitys));
    }
    return res;
}
function fillRect(pos, size, centered = false) {
    if (centered) {
        pos = pos.c().sub(size.c().scale(0.5));
    }
    ctxt.fillRect(pos.x, pos.y, size.x + 1, size.y + 1);
}
class Particle {
    constructor(data) {
        Object.assign(this, data);
    }
}
function spawnBitParticles(pos) {
    var lifespan = 2;
    for (var i = 0; i < 20; i++) {
        entitys.push(new Entity({
            pos: pos.c(),
            createdAt: time,
            updatecb: (self) => {
                var particle = self.data;
                particle.vel.add(particle.acc.c().scale(globaldt));
                self.pos.add(particle.vel.c().scale(globaldt));
                var age = to(self.createdAt, time);
                if (age > lifespan) {
                    self.markedForDeletion = true;
                }
            },
            drawcb: (self) => {
                var age = to(self.createdAt, time);
                var completion = inverseLerp(age, 0, lifespan);
                ctxt.fillStyle = 'white';
                ctxt.font = '16px Arial';
                ctxt.globalAlpha = 1 - tween(completion, 0, 0);
                ctxt.fillText(self.data.text, self.pos.x, self.pos.y);
            },
            data: new Particle({
                vel: new Vector(rng.range(-50, 50), rng.range(-50, 50)),
                acc: new Vector(0, 0),
                text: rng.choose(['0', '1']),
            })
        }));
    }
}
function spawnFireParticles(pos, vel) {
    var lifespan = 2;
    for (var i = 0; i < 20; i++) {
        entitys.push(new Entity({
            pos: pos.c(),
            createdAt: time,
            updatecb: (self) => {
                var particle = self.data;
                particle.vel.add(particle.acc.c().scale(globaldt));
                self.pos.add(particle.vel.c().scale(globaldt));
                var age = to(self.createdAt, time);
                if (age > lifespan) {
                    self.markedForDeletion = true;
                }
            },
            drawcb: (self) => {
                var age = to(self.createdAt, time);
                var completion = inverseLerp(age, 0, lifespan);
                ctxt.globalAlpha = 1 - tween(completion, 0, 0);
                drawAnimation(self.pos, fireballAnimation, time);
            },
            data: new Particle({
                vel: new Vector(rng.rangeCenter(0, 20), rng.range(0, 20)).add(vel.c().scale(0.1)),
                acc: new Vector(0, -50),
            })
        }));
    }
}
var dustsprite = loadImage('animations/dust.png');
var seq = new Sequencer({});
seq.show(0.1);
seq.pause(1);
seq.hide(0.2);
function spawnDustParticles(pos, vel) {
    var lifespan = 2;
    for (var i = 0; i < 1; i++) {
        entitys.push(new Entity({
            pos: pos.c(),
            createdAt: time,
            depth: 0,
            updatecb: (self) => {
                var particle = self.data;
                particle.vel.add(particle.acc.c().scale(globaldt));
                self.pos.add(particle.vel.c().scale(globaldt));
                var age = to(self.createdAt, time);
                if (age > lifespan) {
                    self.markedForDeletion = true;
                }
            },
            drawcb: (self) => {
                var age = to(self.createdAt, time);
                var completion = inverseLerp(age, 0, lifespan);
                // ctxt.globalAlpha = 1 - tween(completion,0,0)
                ctxt.globalAlpha = seq.seekRel(completion);
                drawImage(dustsprite, self.pos, new Vector(40, 34).scale(0.5), true);
            },
            data: new Particle({
                vel: new Vector(rng.rangeCenter(0, 20), rng.rangeCenter(0, 20)).add(vel.c().scale(0.2)),
                acc: new Vector(0, -20),
            })
        }));
    }
}
function collissionCheck(rect, type) {
    return collissionCheckWorld(rect) || collisionCheckEntitys(rect, type);
}
function collissionCheckWorld(rect) {
    var _a;
    var tl = rect.getPoint(new Vector(0, 0)).div(tilesize).floor();
    var br = rect.getPoint(new Vector(1, 1)).div(tilesize).floor();
    for (var layer of tiledmap.layers) {
        if (layer.type == 'objectgroup') {
            continue;
        }
        for (var x = tl.x; x <= br.x; x++) {
            for (var y = tl.y; y <= br.y; y++) {
                if (x < 0 || y < 0) {
                    continue;
                }
                var gid = layer.data[y * layer.width + x];
                if (gid == 0 || gid == undefined) {
                    continue;
                }
                var { lid, tileset } = gid2local(gid, tiledmap.tilesets);
                if ((_a = tileset.tilesdict[lid]) === null || _a === void 0 ? void 0 : _a.isSolid) {
                    return true;
                }
            }
        }
    }
    return false;
}
function collisionCheckEntitys(rect, type) {
    var _a;
    var fentitys = entitys.filter(e => e.type == type);
    for (var entity of fentitys) {
        if ((_a = entity.rect) === null || _a === void 0 ? void 0 : _a.collideBox(rect)) {
            return entity;
        }
    }
    return null;
}
function rotStart(center, turns) {
    ctxt.save();
    ctxt.translate(center.x, center.y);
    ctxt.rotate(turns * TAU);
    ctxt.translate(-center.x, -center.y);
}
function rotEnd() {
    ctxt.restore();
}
function drawImage(image, pos, size, centered = false) {
    if (centered) {
        var halfsize = size.c().scale(0.5);
        pos = pos.c().sub(halfsize);
    }
    // image.width
    // image.height
    ctxt.drawImage(image, pos.x, pos.y, size.x + 1, size.y + 1);
}
function drawImage2(image, src, dst) {
    var srcsize = src.size();
    var dstsize = dst.size();
    ctxt.drawImage(image, src.min.x, src.min.y, srcsize.x, srcsize.y, dst.min.x - 0.5, dst.min.y - 0.5, dstsize.x + 1, dstsize.y + 1);
}
function loadImage(src) {
    var image = new Image();
    image.src = src;
    return image;
}
function index2Vector(index, width) {
    return new Vector(index % width, Math.floor(index / width));
}
function vector2index(v, width) {
    return v.y * width + v.x;
}
function tween(x, a, b) {
    return (a + b - 2) * x * x * x + (3 - 2 * a - b) * x * x + a * x;
}
class Bit {
    constructor(data) {
        Object.assign(this, data);
    }
    get() {
        return this.array[this.index];
    }
    set(val) {
        this.array[this.index] = val;
    }
    flip() {
        this.set(1 - this.get());
    }
}
class Enemy {
    constructor(incdata) {
        this.data = [];
        this.attackcd = new Cooldown(1);
        this.deadTimeStamp = 0;
        this.isDead = false;
        this.flipx = false;
        this.props = [
            new Prop({
                name: 'damage',
                size: 4,
            }),
            new Prop({
                name: 'speed',
                size: 4,
            }),
            new Prop({
                name: 'health',
                size: 6,
            }),
        ];
        Object.assign(this, incdata);
        this.data = new Array(12);
        for (var key in incdata) {
            this.setProp(key, incdata[key]);
        }
    }
    setProp(name, value) {
        var offset = 0;
        for (var prop of this.props) {
            if (prop.name == name) {
                var bits = number2Bits(value, prop.size);
                this.data.splice(offset, prop.size, ...bits);
            }
            offset += prop.size;
        }
    }
    getProp(name) {
        var offset = 0;
        for (var prop of this.props) {
            if (prop.name == name) {
                var bits = this.data.slice(offset, offset + prop.size);
                return bits2Number(bits);
            }
            offset += prop.size;
        }
    }
}
class Cooldown {
    constructor(maxcooldown) {
        this.cooldown = 0;
        this.maxcooldown = maxcooldown;
    }
    isready() {
        return this.cooldown <= 0;
    }
    tryfire() {
        if (this.isready()) {
            this.cooldown = this.maxcooldown;
            return true;
        }
        return false;
    }
    update(dt) {
        this.cooldown -= dt;
        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
    }
}
class Prop {
    constructor(data) {
        Object.assign(this, data);
    }
}
class Gun {
    constructor(incdata) {
        this.data = [];
        this.props = [
            new Prop({
                name: 'ammo',
                size: 8,
            }),
            new Prop({
                name: 'firerate',
                size: 4,
            }),
        ];
        this.data = new Array(12);
        for (var key in incdata) {
            this.setProp(key, incdata[key]);
        }
    }
    inc(name) {
        this.setProp(name, this.getProp(name) + 1);
    }
    decr(name) {
        this.setProp(name, this.getProp(name) - 1);
    }
    setProp(name, value) {
        this[name] = value;
        var offset = 0;
        for (var prop of this.props) {
            if (prop.name == name) {
                var bits = number2Bits(value, prop.size);
                this.data.splice(offset, prop.size, ...bits);
            }
            offset += prop.size;
        }
    }
    getProp(name) {
        var offset = 0;
        for (var prop of this.props) {
            if (prop.name == name) {
                var bits = this.data.slice(offset, prop.size);
                return bits2Number(bits);
            }
            offset += prop.size;
        }
    }
}
function number2Bits(number, maxbits) {
    var res = [];
    for (var i = 0; i < maxbits; i++) {
        res.unshift(number % 2 === 1 ? 1 : 0);
        number = Math.floor(number / 2);
    }
    return res;
}
function bits2Number(bits) {
    var res = 0;
    for (var i = bits.length - 1, j = 0; i >= 0; i--, j++) {
        if (bits[i] == 1) {
            res += Math.pow(2, j);
        }
    }
    return res;
}
class Entity {
    constructor(data) {
        this.depth = 0;
        this.markedForDeletion = false;
        Object.assign(this, data);
    }
}
class SpriteAnimation {
    constructor(data) {
        Object.assign(this, data);
    }
}
function drawAnimation(pos, animation, time, flipx = false, centered = true, loop = true) {
    if (centered) {
        pos = pos.c().sub(animation.spritesize.c().scale(0.5));
    }
    if (loop == false) {
        time = clamp(time, 0, animation.duration - 0.0001);
    }
    var frame = clamp(Math.floor(map(time % animation.duration, 0, animation.duration, 0, animation.framecount)), 0, animation.framecount);
    if (flipx) {
        var center = pos.c().add(animation.spritesize.c().scale(0.5));
        ctxt.save();
        ctxt.translate(center.x, center.y);
        ctxt.scale(-1, 1);
        ctxt.translate(-center.x, -center.y);
    }
    drawAtlasImage(pos, animation.startpos.c().add(animation.direction.c().scale(frame)), animation.spritesize, animation.imageatlas);
    if (flipx) {
        ctxt.restore();
    }
}
function drawAtlasImage(absdstpos, srctile, tilesize, image) {
    var abssrc = srctile.c().mul(tilesize);
    ctxt.drawImage(image, abssrc.x, abssrc.y, tilesize.x, tilesize.y, absdstpos.x, absdstpos.y, tilesize.x, tilesize.y);
}
class Bullet {
    constructor() {
        this.isBitBullet = false;
    }
}
class Player {
    constructor(data) {
        this.isDead = false;
        this.health = 1;
        this.inBitWorld = false;
        this.guncooldown = new Cooldown(0.1);
        this.gun = new Gun({
            ammo: 0b11111111,
            firerate: 0b0100,
            bulletspeed: 0b100,
        });
        Object.assign(this, data);
    }
    updatecb(self) {
        var dir = new Vector(0, 0);
        if (keys['w'] || keys['ArrowUp']) {
            dir.y--;
        }
        if (keys['s'] || keys['ArrowDown']) {
            dir.y++;
        }
        if (keys['a'] || keys['ArrowLeft']) {
            dir.x--;
            flipx = true;
        }
        if (keys['d'] || keys['ArrowRight']) {
            dir.x++;
            flipx = false;
        }
        if (dir.length() > 0) {
            dir.normalize();
            var oldpos = self.pos.c();
            moveEntity(self, dir.c().scale(self.data.speed * globaldt));
            var newpos = self.pos.c();
            currentanimation = witchRunAnimation;
            if (self.data.inBitWorld == false) {
                dustCooldown.update(globaldt);
                if (dustCooldown.tryfire()) {
                    spawnDustParticles(self.pos.c().add(new Vector(0, 20)), oldpos.equal(newpos) ? new Vector(0, 0) : dir.c().scale(self.data.speed));
                }
            }
        }
        else {
            currentanimation = witchIdleAnimation;
        }
        camera.pos.overwrite(globalplayer.pos);
        self.data.guncooldown.update(globaldt);
        if (mousebuttonsPressed[0] && self.data.gun.getProp('ammo') > 0 && self.data.guncooldown.tryfire()) {
            self.data.gun.decr('ammo');
            if (self.data.inBitWorld) {
                lasersound.play();
            }
            else {
                fireballsound.play();
            }
            var mouse = camera.screen2world(mousepos);
            var bulletspeed = 400;
            entitys.push(new Entity({
                pos: self.pos.c(),
                type: 'bullet',
                createdAt: time,
                updatecb(self) {
                    var age = to(self.createdAt, time);
                    if (age > 2) {
                        self.markedForDeletion = true;
                        return;
                    }
                    self.pos.add(self.data.vel.c().scale(globaldt));
                    var bulletrect = Rect.fromCenter(self.pos, new Vector(5, 5));
                    var hitbit = collisionCheckEntitys(bulletrect, 'bit');
                    var hitenemy = collisionCheckEntitys(bulletrect, 'enemy');
                    if (collissionCheckWorld(bulletrect)) {
                        self.markedForDeletion = true;
                    }
                    if (hitbit) {
                        self.markedForDeletion = true;
                        hitbit.data.flip();
                    }
                    if (hitenemy) {
                        hitenemy.data.setProp('health', hitenemy.data.getProp('health') - 1); //todo use gun damage 
                        self.markedForDeletion = true;
                        if (hitenemy.data.getProp('health') <= 0) {
                            hitenemy.data.isDead = true;
                            hitenemy.data.deadTimeStamp = time;
                            hitenemy.rect = null;
                            // hitenemy.markedForDeletion = true
                            //spawnparticles
                            //play sound
                        }
                    }
                    if (self.markedForDeletion) {
                        if (self.data.isBitBullet) {
                            spawnBitParticles(self.pos);
                        }
                        else {
                            spawnFireParticles(self.pos, self.data.vel);
                        }
                    }
                },
                drawcb(self) {
                    if (self.data.isBitBullet) {
                        ctxt.font = '30px Arial';
                        ctxt.fillStyle = 'white';
                        ctxt.fillText('!', self.pos.x, self.pos.y);
                    }
                    else {
                        ctxt.fillStyle = 'red';
                        drawAnimation(self.pos, fireballAnimation, time, false, true);
                        // fillRect(self.pos,new Vector(5,5),true)
                    }
                },
                data: {
                    vel: self.pos.to(mouse).normalize().scale(bulletspeed),
                    isBitBullet: self.data.inBitWorld
                }
            }));
        }
    }
    drawcb(self) {
        if (self.data.inBitWorld) {
            ctxt.strokeStyle = 'white';
            drawRectBorder(self.rect);
        }
        else {
            drawAnimation(self.pos, currentanimation, time, flipx, true);
        }
    }
}
function renderTiled(tiledData) {
    var _a;
    //now the code is looping over all the id's
    //optimization could be only loop over visible tiles
    var tl = camera.screen2world(new Vector(0, 0)).div(tiledData.tilesize).floor();
    var br = camera.screen2world(screensize).div(tiledData.tilesize).floor();
    tl.x = max(0, tl.x);
    tl.y = max(0, tl.y);
    br.x = min(tiledData.size.x - 1, br.x);
    br.y = min(tiledData.size.y - 1, br.y);
    for (var x = tl.x; x <= br.x; x++) {
        for (var y = tl.y; y <= br.y; y++) {
            var index = y * tiledData.size.x + x;
            for (var layer of tiledData.layers) {
                if (layer.data) {
                    var gid = layer.data[index];
                    if (gid == 0) {
                        continue;
                    }
                    var FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
                    var FLIPPED_VERTICALLY_FLAG = 0x40000000;
                    var FLIPPED_DIAGONALLY_FLAG = 0x20000000;
                    var ROTATED_HEXAGONAL_120_FLAG = 0x10000000;
                    var horflag = gid & FLIPPED_HORIZONTALLY_FLAG;
                    var verflag = gid & FLIPPED_VERTICALLY_FLAG;
                    var diagflag = gid & FLIPPED_DIAGONALLY_FLAG;
                    var hexflag = gid & ROTATED_HEXAGONAL_120_FLAG;
                    gid &= ~(FLIPPED_HORIZONTALLY_FLAG |
                        FLIPPED_VERTICALLY_FLAG |
                        FLIPPED_DIAGONALLY_FLAG |
                        ROTATED_HEXAGONAL_120_FLAG);
                    //gid first 4 bits are flags
                    var { lid, tileset } = gid2local(gid, tiledData.tilesets);
                    var tile = tileset.tilesdict[lid];
                    if (tile === null || tile === void 0 ? void 0 : tile.animation) {
                        var animduration = tile.animation.reduce((p, c) => p + c.duration, 0) / 1000;
                        var localtime = time % animduration;
                        var frame = Math.floor(localtime / 0.1);
                        lid = tile.animation[frame].tileid;
                    }
                    var srcabspos = index2Vector(lid, tileset.columns).mul(tileset.tilesize);
                    var dstabspos = index2Vector(index, tiledData.size.x).mul(tileset.tilesize);
                    var srcrect = Rect.fromsize(srcabspos, tileset.tilesize);
                    var dstrect = Rect.fromsize(dstabspos, tileset.tilesize);
                    // if(horflag){
                    //     srcrect.width *= -1
                    // }
                    // if(verflag){
                    //     srcrect.height *= -1
                    // }
                    // if(diagflag){
                    //     //todo, have to do some wizarding shit with custom defined vertices and uvs
                    // }
                    drawImage2(tileset.texture, srcrect, dstrect);
                }
            }
        }
    }
    for (var layer of tiledData.layers) {
        if (layer.objects) {
            for (var object of layer.objects) {
                if (object.text) {
                    ctxt.fillStyle = 'black';
                    if (object.text.color) {
                        ctxt.fillStyle = object.text.color;
                    }
                    var fontsize = (_a = object.text.pixelsize) !== null && _a !== void 0 ? _a : 16;
                    ctxt.font = `${fontsize}px Arial`;
                    ctxt.textAlign = 'center';
                    ctxt.textBaseline = 'middle';
                    var center = new Vector(object.x, object.y).add(new Vector(object.width, object.height).scale(0.5));
                    ctxt.fillText(object.text.text, center.x, center.y);
                }
                else {
                    if (drawdebuggraphics) {
                        ctxt.fillStyle = 'green';
                        fillRect(object.pos, tiledData.tilesize, true);
                    }
                }
            }
        }
    }
}
async function preprocessTiledMap(tiledmap) {
    var _a;
    tiledmap.tilesize = new Vector(tiledmap.tilewidth, tiledmap.tileheight);
    tiledmap.size = new Vector(tiledmap.width, tiledmap.height);
    for (var layer of tiledmap.layers) {
        if (layer.data) {
            layer.backup = layer.data.slice();
        }
        if (layer.objects) {
            for (var object of layer.objects) {
                object.pos = new Vector(object.x, object.y);
                object.size = new Vector(object.width, object.height);
                embedProperties(object);
            }
        }
    }
    for (var tileset of tiledmap.tilesets) {
        tileset.texture = loadImage(tileset.image);
        tileset.tilesdict = {};
        tileset.tilesize = new Vector(tileset.tilewidth, tileset.tileheight);
        for (var tile of (_a = tileset.tiles) !== null && _a !== void 0 ? _a : []) {
            tileset.tilesdict[tile.id] = tile;
            embedProperties(tile);
        }
    }
}
function gid2local(gid, tilesets) {
    for (var i = tilesets.length - 1; i >= 0; i--) {
        if (tilesets[i].firstgid <= gid) {
            return {
                tileset: tilesets[i],
                lid: gid - tilesets[i].firstgid
            };
        }
    }
}
function embedProperties(object) {
    if (object.properties) {
        for (var prop of object.properties) {
            object[prop.name] = prop.value;
        }
    }
}
// var level1memory1 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// var level1memory2 = [1,1,1,1,1,1,1,1,1,1,1]
// var level1memory3 = [1,1,1,1,1,1,1,1,1,1,1]
// var level1memory4 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// var level1memory5 = [1,1,1,1,1,1,1,1,1,1,1]
function loadLevel1() {
    //have 5 arrays of memory
    //corresponding to the 5 walls in game
    loadWallsIntoBits(findObjectWithName('mark1').pos, findObjectWithName('mark2').pos, findObjectWithName('ref1').pos, 348, 1);
    var player = spawnPlayer();
    loadTeleports();
    loadFlags();
    player.data.gun.setProp('ammo', 0b11111111);
}
function spawnPlayer() {
    var player = new Entity({
        type: 'player',
        pos: findObjectsOfType('spawn')[0].pos.c(),
        rect: Rect.fromsize(new Vector(0, 0), new Vector(20, 20)),
        depth: 1,
        updatecb(self) {
            self.data.updatecb(self);
        },
        drawcb(self) {
            self.data.drawcb(self);
        },
        data: new Player({
            speed: 200,
        })
    });
    entitys.push(player);
    globalplayer = player;
    return player;
}
var spiralimage = loadImage('animations/spiral.png');
function loadTeleports() {
    var tpcooldown = new Cooldown(4);
    for (let object of findObjectsOfType('teleporter')) {
        entitys.push(new Entity({
            type: 'teleporter',
            pos: object.pos.c(),
            rect: Rect.fromCenter(object.pos.c(), tilesize),
            updatecb(self) {
                tpcooldown.update(globaldt);
                if (globalplayer.rect.collideBox(self.rect) && tpcooldown.tryfire()) {
                    teleportsound.play();
                    globalplayer.pos = findObjectWithId(object.dst).pos.c();
                    globalplayer.rect.moveToCentered(globalplayer.pos);
                    globalplayer.data.inBitWorld = !globalplayer.data.inBitWorld;
                    if (globalplayer.data.inBitWorld) {
                        bitmusic.play();
                        normalmusic.pause();
                    }
                    else {
                        bitmusic.pause();
                        normalmusic.play();
                    }
                }
            },
            drawcb(self) {
                rotStart(self.pos, time);
                drawImage(spiralimage, self.pos, tilesize, true);
                // drawAtlasImage(self.pos.c().sub(halfsize),new Vector(1,2),tilesize,memoryimage)
                rotEnd();
            },
        }));
    }
}
function loadFlags() {
    var res = [];
    for (let flagobject of findObjectsOfType('flag')) {
        let flagpos = flagobject.pos;
        flagobject.enabled = true;
        entitys.push(new Entity({
            type: 'flag',
            pos: flagpos,
            rect: Rect.fromCenter(flagpos, tilesize),
            updatecb(self) {
                if (self.data.enabled && self.rect.collideBox(globalplayer.rect)) {
                    switchLevel(self.data.dstlevel);
                    levelunlocked[self.data.dstlevel] = true;
                }
            },
            drawcb(self) {
                if (self.data.enabled) {
                    drawAtlasImage(self.pos.c().sub(halfsize), new Vector(2, 2), tilesize, memoryimage);
                }
                else {
                    drawAtlasImage(self.pos.c().sub(halfsize), new Vector(0, 2), tilesize, memoryimage);
                }
                // fillRect(self.pos,tilesize,true)
            },
            data: flagobject
        }));
        res.push(last(entitys));
    }
    return res;
}
function switchLevel(index) {
    //reset mapdata
    for (var entity of entitys) {
        entity.markedForDeletion = true;
    }
    entitys = [];
    tiledmap = levels[index];
    tiledmap.layers[0].data = tiledmap.layers[0].backup.slice();
    loadlevelcallbacks[index]();
}
function loadWallsIntoBits(wallstl, wallsbr, destination, wallgid, grassgid) {
    var res = [];
    wallstl.to(wallsbr).div(tilesize).add(new Vector(1, 1)).loop(v => {
        var absrel = v.c().mul(tilesize);
        var abspos = absrel.c().add(wallstl);
        var index = vector2index(abspos.c().div(tilesize), tiledmap.width);
        var gid = tiledmap.layers[0].data[index];
        if (gid != wallgid) {
            return;
        }
        var bitpos = destination.c().add(v.c().mul(tilesize));
        entitys.push(new Entity({
            pos: bitpos,
            rect: Rect.fromsize(bitpos, tilesize),
            type: 'bit',
            updatecb(self) {
                var index = vector2index(abspos.c().div(tilesize), tiledmap.width);
                tiledmap.layers[0].data[index] = self.data.get() == 1 ? wallgid : grassgid;
            },
            drawcb(self) {
                var bit = self.data;
                ctxt.textAlign = 'center';
                ctxt.textBaseline = 'middle';
                ctxt.font = '30px Arial';
                ctxt.fillStyle = bit.get() ? 'white' : 'black';
                fillRect(self.pos, tilesize);
                ctxt.fillStyle = bit.get() ? 'black' : 'white';
                ctxt.fillText(bit.get().toString(), self.pos.x + halfsize.x, self.pos.y + halfsize.y + 3);
            },
            data: new Bit({
                array: [1],
                index: 0,
            })
        }));
        res.push(last(entitys));
    });
    return res;
}
function findObjectsOfType(type) {
    var _a;
    var res = [];
    for (var layer of tiledmap.layers) {
        for (var object of (_a = layer.objects) !== null && _a !== void 0 ? _a : []) {
            if (object.class == type) {
                res.push(object);
            }
        }
    }
    return res;
}
function findObjectWithId(id) {
    var _a;
    for (var layer of tiledmap.layers) {
        for (var object of (_a = layer.objects) !== null && _a !== void 0 ? _a : []) {
            if (object.id == id) {
                return object;
            }
        }
    }
    return null;
}
function findObjectWithName(name) {
    var _a;
    for (var layer of tiledmap.layers) {
        for (var object of (_a = layer.objects) !== null && _a !== void 0 ? _a : []) {
            if (object.name == name) {
                return object;
            }
        }
    }
    return null;
}
//make 2 guns 1 for overworld, 1 for bitworld
//lets do enemys first
//only show 1 variable with 4 bits, speed
//makes it more obvious what is what
//in a second level also add health
function loadLevel2() {
    var player = spawnPlayer();
    loadTeleports();
    // initBits(findObjectWithName('gunbits').pos,normalgun.data)
    var dummy = new Enemy({});
    // loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    var enemys = loadEnemys();
    initBits(findObjectWithName('enemybits').pos, enemys[0].data.data, false, 8, 14);
    loadFlags();
    player.data.gun.setProp('ammo', 0b11111111);
}
function loadEnemys() {
    var res = [];
    var enemys = findObjectsOfType('enemy');
    for (let object of enemys) {
        entitys.push(new Entity({
            type: 'enemy',
            pos: object.pos.c(),
            rect: Rect.fromCenter(object.pos.c(), new Vector(26, 50)),
            updatecb(self) {
                if (self.data.isDead) {
                    return;
                }
                var playerdir = self.pos.to(globalplayer.pos);
                self.data.flipx = playerdir.x < 0 ? true : false;
                self.data.attackcd.update(globaldt);
                if (globalplayer.data.inBitWorld == false) {
                    var oldpos = self.pos.c();
                    moveEntity(self, self.pos.to(globalplayer.pos).normalize().scale(150 * globaldt));
                    self.data.changepos = oldpos.to(self.pos);
                }
                if (globalplayer.rect.collideBox(self.rect) && self.data.attackcd.tryfire()) {
                    globalplayer.data.health -= self.data.getProp('damage');
                    if (globalplayer.data.health <= 0) {
                        switchLevel(menulevel);
                    }
                }
            },
            drawcb(self) {
                if (self.data.isDead) {
                    drawAnimation(self.pos, skeletonDieAnimation, to(self.data.deadTimeStamp, time), self.data.flipx, true, false);
                }
                else {
                    if (self.data.changepos.length() > 0.05) {
                        drawAnimation(self.pos, skeletonWalkAnimation, time, self.data.flipx, true);
                    }
                    else {
                        drawAnimation(self.pos, skeletonIdleAnimation, time, self.data.flipx, true);
                    }
                }
            },
            data: new Enemy({
                damage: 0b0100,
                speed: 0b0110,
                health: 0b111111,
                changepos: new Vector(0, 0),
            })
        }));
        res.push(last(entitys));
    }
    return res;
}
//change ammo and firerate
function loadLevel3() {
    var player = spawnPlayer();
    player.data.gun.setProp('ammo', 0b00000100);
    loadTeleports();
    var enemys = loadEnemys();
    for (var enemy of enemys) {
        enemy.data.setProp('health', 9);
    }
    initBits(findObjectWithName('gunbits').pos, globalplayer.data.gun.data, false, 0, 8);
    loadWallsIntoBits(findObjectWithName('mark1').pos, findObjectWithName('mark2').pos, findObjectWithName('ref1').pos, 92, 1);
    loadFlags();
}
function loadLevel4() {
    var player = spawnPlayer();
    player.data.gun.setProp('ammo', 0b11111111);
    loadTeleports();
    loadWallsIntoBits(findObjectWithName('mark1').pos, findObjectWithName('mark2').pos, findObjectWithName('ref1').pos, 92, 1);
    loadFlags();
}
function loadMenulevel() {
    spawnPlayer();
    loadTeleports();
    var enemys = loadEnemys();
    // initBits(findObjectWithName('gunbits').pos,normalgun.data)
    // initBits(findObjectWithName('enemybits').pos,enemys[0].data.data,false,8,12)
    // loadWallsIntoBits(findObjectWithName('mark1').pos,findObjectWithName('mark2').pos,findObjectWithName('ref1').pos,92,1)
    var flags = loadFlags();
    var i = 0;
    for (var flag of flags) {
        flag.data.enabled = levelunlocked[i];
        i++;
    }
}
function loadFinishedLevel() {
    spawnPlayer();
    loadTeleports();
    loadFlags();
}
/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/networking/entity.ts" />
/// <reference path="libs/networking/server.ts" />
/// <reference path="libs/utils/domutils.js" />
/// <reference path="src/sequencer.ts" />
/// <reference path="src/utils.ts" />
/// <reference path="src/bit.ts" />
/// <reference path="src/enemy.ts" />
/// <reference path="src/cooldown.ts" />
/// <reference path="src/gun.ts" />
/// <reference path="src/entity.ts" />
/// <reference path="src/animation.ts" />
/// <reference path="src/player.ts" />
/// <reference path="src/tiled.js" />
/// <reference path="src/level1.ts" />
/// <reference path="src/level2.ts" />
/// <reference path="src/level3.ts" />
/// <reference path="src/menulevel.ts" />
/// <reference path="src/finishedlevel.ts" />
//todo setup a template project for a future gamejam
// var drawdebuggraphics = location.hostname === "localhost"
var drawdebuggraphics = false;
var memoryimage = loadImage('res/memoryworld.png');
var TileMaps;
var levels = [TileMaps.level1, TileMaps.level2, TileMaps.level3, TileMaps.level4, TileMaps.menulevel, TileMaps.finished];
var loadlevelcallbacks = [loadLevel1, loadLevel2, loadLevel3, loadLevel4, loadMenulevel, loadFinishedLevel];
var menulevel = 4;
var levelindex = menulevel;
var tiledmap = levels[levelindex];
var levelunlocked = drawdebuggraphics ? [true, true, true, true, true] : [true, false, false, true, false];
for (var level of levels) {
    preprocessTiledMap(level);
}
var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
var crret = createCanvas(screensize.x, screensize.y);
var { canvas, ctxt } = crret;
console.log('here');
var tilesize = new Vector(tiledmap.tilewidth, tiledmap.tileheight);
var halfsize = tilesize.c().scale(0.5);
var riflesound = new Howl({
    src: ['sounds/rifle.wav'],
    volume: 0.5,
});
var lasersound = new Howl({
    src: ['sounds/laser.wav'],
    volume: 0.5,
});
var shotgunsound = new Howl({
    src: ['sounds/shotgun.wav'],
    volume: 0.5,
});
var pistolsound = new Howl({
    src: ['sounds/pistol.wav'],
    volume: 0.5,
});
var fireballsound = new Howl({
    src: ['sounds/fireball.wav'],
    volume: 1,
});
var bitmusic = new Howl({
    src: ['sounds/bitmusic.wav'],
    volume: 0.6,
    loop: true,
});
var normalmusic = new Howl({
    src: ['sounds/normalmusic.mp3'],
    volume: 0.6,
    loop: true,
});
var teleportsound = new Howl({
    src: ['sounds/teleport.wav'],
    volume: 0.6,
});
var witchRunAnimation = new SpriteAnimation({
    imageatlas: loadImage('animations/B_witch_run.png'),
    startpos: new Vector(0, 0),
    direction: new Vector(0, 1),
    framecount: 8,
    duration: 1,
    spritesize: new Vector(32, 48)
});
var witchIdleAnimation = new SpriteAnimation({
    imageatlas: loadImage('animations/B_witch_idle.png'),
    startpos: new Vector(0, 0),
    direction: new Vector(0, 1),
    framecount: 6,
    duration: 1,
    spritesize: new Vector(32, 48)
});
var fireballAnimation = new SpriteAnimation({
    imageatlas: loadImage('animations/All_Fire_Bullet_Pixel_16x16.png'),
    startpos: new Vector(0, 14),
    direction: new Vector(1, 0),
    framecount: 5,
    duration: 0.4,
    spritesize: new Vector(16, 16)
});
var skeletonWalkAnimation = new SpriteAnimation({
    imageatlas: loadImage('animations/Skeleton enemy.png'),
    startpos: new Vector(0, 2),
    direction: new Vector(1, 0),
    framecount: 12,
    duration: 1,
    spritesize: new Vector(64, 64)
});
var skeletonIdleAnimation = new SpriteAnimation({
    imageatlas: loadImage('animations/Skeleton enemy.png'),
    startpos: new Vector(0, 3),
    direction: new Vector(1, 0),
    framecount: 4,
    duration: 1,
    spritesize: new Vector(64, 64)
});
var skeletonDieAnimation = new SpriteAnimation({
    imageatlas: loadImage('animations/Skeleton enemy.png'),
    startpos: new Vector(0, 1),
    direction: new Vector(1, 0),
    framecount: 13,
    duration: 1,
    spritesize: new Vector(64, 64)
});
var flipx = false;
var currentanimation = witchRunAnimation;
var entitys = [];
var camera = new Camera(ctxt);
var mousebuttons = [];
var mousebuttonsPressed = [];
var mousepos = new Vector(0, 0);
document.addEventListener('mousemove', e => {
    mousepos = getMousePos(canvas, e);
});
document.addEventListener('mousedown', e => {
    mousebuttonsPressed[e.button] = true;
    mousebuttons[e.button] = true;
});
document.addEventListener('mouseup', e => {
    mousebuttons[e.button] = false;
});
var globalplayer = null;
loadlevelcallbacks[levelindex]();
normalmusic.play();
var dustCooldown = new Cooldown(0.2);
var globaldt = 0;
var time = 0;
loop((dt) => {
    var _a, _b;
    dt = clamp(dt, 1 / 144, 1 / 30);
    globaldt = dt;
    time += dt;
    ctxt.fillStyle = 'gray';
    ctxt.fillRect(0, 0, screensize.x, screensize.y);
    entitys.sort((a, b) => a.depth - b.depth);
    var entitystemp = entitys.slice();
    for (var entity of entitystemp) {
        if (entity.markedForDeletion) {
            continue;
        }
        (_a = entity.updatecb) === null || _a === void 0 ? void 0 : _a.call(entity, entity);
    }
    entitys = entitys.filter(e => e.markedForDeletion == false);
    camera.begin();
    renderTiled(tiledmap);
    for (var entity of entitys) {
        ctxt.globalAlpha = 1;
        if (entity.markedForDeletion) {
            continue;
        }
        (_b = entity.drawcb) === null || _b === void 0 ? void 0 : _b.call(entity, entity);
    }
    if (drawdebuggraphics) {
        ctxt.globalAlpha = 1;
        ctxt.strokeStyle = 'magenta';
        for (var entity of entitys) {
            if (entity.rect) {
                drawRectBorder(entity.rect);
            }
        }
    }
    ctxt.globalAlpha = 1;
    ctxt.fillStyle = 'red';
    camera.end();
    mousebuttonsPressed.fill(false);
});
function drawRectBorder(rect) {
    ctxt.beginPath();
    ctxt.moveTo(rect.min.x + 0.5, rect.min.y + 0.5);
    ctxt.lineTo(rect.max.x + 0.5, rect.min.y + 0.5);
    ctxt.lineTo(rect.max.x + 0.5, rect.max.y + 0.5);
    ctxt.lineTo(rect.min.x + 0.5, rect.max.y + 0.5);
    ctxt.closePath();
    ctxt.stroke();
}
function moveEntity(entity, vel) {
    var oldpos = entity.pos.c();
    if (vel.x == 0 && vel.y == 0) {
        return;
    }
    entity.pos.x += vel.x;
    entity.rect.moveToCentered(entity.pos);
    if (collissionCheckWorld(entity.rect)) {
        entity.pos.x = oldpos.x;
        entity.rect.moveToCentered(entity.pos);
    }
    entity.pos.y += vel.y;
    entity.rect.moveToCentered(entity.pos);
    if (collissionCheckWorld(entity.rect)) {
        entity.pos.y = oldpos.y;
        entity.rect.moveToCentered(entity.pos);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJsaWJzL3V0aWxzL2NhbWVyYS50cyIsImxpYnMvbmV0d29ya2luZy9lbnRpdHkudHMiLCJsaWJzL25ldHdvcmtpbmcvc2VydmVyLnRzIiwibGlicy91dGlscy9kb211dGlscy5qcyIsInNyYy9zZXF1ZW5jZXIudHMiLCJzcmMvdXRpbHMudHMiLCJzcmMvYml0LnRzIiwic3JjL2VuZW15LnRzIiwic3JjL2Nvb2xkb3duLnRzIiwic3JjL2d1bi50cyIsInNyYy9lbnRpdHkudHMiLCJzcmMvYW5pbWF0aW9uLnRzIiwic3JjL3BsYXllci50cyIsInNyYy90aWxlZC5qcyIsInNyYy9sZXZlbDEudHMiLCJzcmMvbGV2ZWwyLnRzIiwic3JjL2xldmVsMy50cyIsInNyYy9tZW51bGV2ZWwudHMiLCJzcmMvZmluaXNoZWRsZXZlbC50cyIsIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxNQUFNO0lBR1IsWUFBWSxHQUFHLElBQWE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxRQUF3QztRQUN4QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7WUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7U0FDeEI7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNmLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzRCxD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QUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQTZCO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3JELENBQUM7SUFFRCxNQUFNLENBQUMsR0FBVTtRQUNiLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUN0QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3JDLENBQUM7SUFFRCxjQUFjLENBQUMsR0FBVTtRQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBeUI7UUFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUd2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEIsUUFBUSxDQUFDLElBQUks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