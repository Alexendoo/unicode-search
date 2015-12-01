// Generated from ray-master.flat_js by fjsc 0.5; github.com/lars-t-hansen/flatjs
/* -*- mode: javascript -*- */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Author: Lars T Hansen, lth@acm.org / lhansen@mozilla.com
 */

/*
 * Ray tracer, largely out of Shirley & Marschner 3rd Ed.
 * Traces a scene and writes to a canvas.
 *
 * This is written in FlatJS (github.com/lars-t-hansen/flatjs),
 * holding the scene graph in flat shared memory and rendering in
 * parallel into a flat shared array.  The computation is otherwise
 * straight JS and exactly the same as the sequential program.
 *
 * Parameters and FlatJS types that are shared with the worker are in
 * ray-common.flat_js.  Computation is in ray-worker.flat_js.
 */

function main() {
    const RAW_MEMORY = new SharedArrayBuffer(g_height*g_width*int32.SIZE + 65536);
    FlatJS.init(RAW_MEMORY, 0, RAW_MEMORY.byteLength, true);

    // Input: the scene graph, in shared memory
    const [eye, light, background, world] = setStage();

    // Output: the bitmap, in shared memory
    const bits = Bitmap.init(Bitmap.initInstance(FlatJS.allocOrThrow(16,4)), g_height, g_width, DL3(152.0/256.0, 251.0/256.0, 152.0/256.0));

    // Note, numWorkers is set by the .html document.
    const Par = new MasterPar(new Int32Array(new SharedArrayBuffer(MasterPar.NUMINTS * Int32Array.BYTES_PER_ELEMENT)),
			      0, numWorkers, "ray-worker.js", doneParInit);

    function doneParInit() {
	Par.broadcast(doneSetup, "setup", RAW_MEMORY);
    }

    var then, now;
    function doneSetup() {
	then = Date.now();
	Par.invoke(doneTrace, "trace", [[0, g_height], [0, g_width]], eye, light, background, world, bits);
    }

    function doneTrace() {
	var now = Date.now();
	var mycanvas = document.getElementById("mycanvas");
	var cx = mycanvas.getContext('2d');
	var id  = cx.createImageData(g_width, g_height);
	id.data.set(new Uint8Array(RAW_MEMORY, _mem_int32[(bits + 4) >> 2], g_width*g_height*4));
	cx.putImageData(id, 0, 0);
	document.getElementById("mycaption").innerHTML = "Time=" + (now - then) + "ms";
    }
}

// Colors: http://kb.iu.edu/data/aetf.html

const paleGreen = DL3(152.0/256.0, 251.0/256.0, 152.0/256.0);
const darkGray = DL3(169.0/256.0, 169.0/256.0, 169.0/256.0);
const yellow = DL3(1.0, 1.0, 0.0);
const red = DL3(1.0, 0.0, 0.0);
const blue = DL3(0.0, 0.0, 1.0);

// Not restricted to a rectangle, actually
function rectangle(world, m, v1, v2, v3, v4) {
    world.push(Triangle.init(Triangle.initInstance(FlatJS.allocOrThrow(168,8)), m, v1, v2, v3));
    world.push(Triangle.init(Triangle.initInstance(FlatJS.allocOrThrow(168,8)), m, v1, v3, v4));
}

// Vertices are for front and back faces, both counterclockwise as seen
// from the outside.
// Not restricted to a cube, actually.
function cube(world, m, v1, v2, v3, v4, v5, v6, v7, v8) {
    rectangle(world, m, v1, v2, v3, v4);  // front
    rectangle(world, m, v2, v5, v8, v3);  // right
    rectangle(world, m, v6, v1, v4, v7);  // left
    rectangle(world, m, v5, v5, v7, v8);  // back
    rectangle(world, m, v4, v3, v8, v7);  // top
    rectangle(world, m, v6, v5, v2, v1);  // bottom
}

function setStage() {
    if (debug)
	console.log("Setstage start");

    const zzz = DL3(0,0,0);

    const m1 = makeMaterial(DL3(0.1, 0.2, 0.2), DL3(0.3, 0.6, 0.6), 10, DL3(0.05, 0.1, 0.1), 0);
    const m2 = makeMaterial(DL3(0.3, 0.3, 0.2), DL3(0.6, 0.6, 0.4), 10, DL3(0.1,0.1,0.05),   0);
    const m3 = makeMaterial(DL3(0.1,  0,  0), DL3(0.8,0,0),     10, DL3(0.1,0,0),     0);
    const m4 = makeMaterial(muli(darkGray,0.4), muli(darkGray,0.3), 100, muli(darkGray,0.3), 0.5);
    const m5 = makeMaterial(muli(paleGreen,0.4), muli(paleGreen,0.4), 10, muli(paleGreen,0.2), 1.0);
    const m6 = makeMaterial(muli(yellow,0.6), zzz, 0, muli(yellow,0.4), 0);
    const m7 = makeMaterial(muli(red,0.6), zzz, 0, muli(red,0.4), 0);
    const m8 = makeMaterial(muli(blue,0.6), zzz, 0, muli(blue,0.4), 0);

    var world = [];

    world.push(Sphere.init(Sphere.initInstance(FlatJS.allocOrThrow(128,8)), m1, DL3(-1, 1, -9), 1));
    world.push(Sphere.init(Sphere.initInstance(FlatJS.allocOrThrow(128,8)), m2, DL3(1.5, 1, 0), 0.75));
    world.push(Triangle.init(Triangle.initInstance(FlatJS.allocOrThrow(168,8)), m1, DL3(-1,0,0.75), DL3(-0.75,0,0), DL3(-0.75,1.5,0)));
    world.push(Triangle.init(Triangle.initInstance(FlatJS.allocOrThrow(168,8)), m3, DL3(-2,0,0), DL3(-0.5,0,0), DL3(-0.5,2,0)));
    rectangle(world, m4, DL3(-5,0,5), DL3(5,0,5), DL3(5,0,-40), DL3(-5,0,-40));
    cube(world, m5, DL3(1, 1.5, 1.5), DL3(1.5, 1.5, 1.25), DL3(1.5, 1.75, 1.25), DL3(1, 1.75, 1.5),
	 DL3(1.5, 1.5, 0.5), DL3(1, 1.5, 0.75), DL3(1, 1.75, 0.75), DL3(1.5, 1.75, 0.5));
    for ( var i=0 ; i < 30 ; i++ )
	world.push(Sphere.init(Sphere.initInstance(FlatJS.allocOrThrow(128,8)), m6, DL3((-0.6+(i*0.2)), (0.075+(i*0.05)), (1.5-(i*Math.cos(i/30.0)*0.5))), 0.075));
    for ( var i=0 ; i < 60 ; i++ )
	world.push(Sphere.init(Sphere.initInstance(FlatJS.allocOrThrow(128,8)), m7, DL3((1+0.3*Math.sin(i*(3.14/16))), (0.075+(i*0.025)), (1+0.3*Math.cos(i*(3.14/16)))), 0.025));
    for ( var i=0 ; i < 60 ; i++ )
	world.push(Sphere.init(Sphere.initInstance(FlatJS.allocOrThrow(128,8)), m8, DL3((1+0.3*Math.sin(i*(3.14/16))), (0.075+((i+8)*0.025)), (1+0.3*Math.cos(i*(3.14/16)))), 0.025));

    var eye        = DL3(0.5, 0.75, 5);
    var light      = DL3(g_left-1, g_top, 2);
    var background = DL3(25.0/256.0,25.0/256.0,112.0/256.0);

    if (debug)
	console.log("Setstage end");

    return [eye, light, background, Scene.init(Scene.initInstance(FlatJS.allocOrThrow(104,8)), world)];
}
