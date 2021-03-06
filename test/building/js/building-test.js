'use strict';

var Game = require( '../../../src/js/game' );
var Color = require( '../../../src/js/math/color' );
var Geometry = require( '../../../src/js/geometry/geometry' );
var Material = require( '../../../src/js/materials/material' );
var LambertMaterial = require( '../../../src/js/materials/lambert-material' );
var LambertGlowMaterial = require( '../../../src/js/materials/lambert-glow-material' );
var Mesh = require( '../../../src/js/objects/mesh' );
var DirectionalLight = require( '../../../src/js/lights/directional-light' );

var Controls = require( '../../main/controls' );

// Generate building geometry.
// Origin is at the center of the bottom face.
function addBoxGeometry( geometry, width, height, depth, dx, dy, dz ) {
  dx = dx || 0;
  dy = dy || 0;
  dz = dz || 0;

  var halfWidth = width / 2,
      halfDepth = depth / 2;

  var vertices = [
    // Counterclockwise from far left.
    // Bottom.
    -halfWidth, 0, -halfDepth,
    -halfWidth, 0,  halfDepth,
    halfWidth,  0,  halfDepth,
    halfWidth,  0, -halfDepth,
    // Top.
    -halfWidth, height, -halfDepth,
    -halfWidth, height,  halfDepth,
    halfWidth,  height,  halfDepth,
    halfWidth,  height, -halfDepth
  ];

  for ( var i = 0, il = vertices.length; i < il; i += 3 ) {
    vertices[ i     ] += dx;
    vertices[ i + 1 ] += dy;
    vertices[ i + 2 ] += dz;
  }

  var faces = [
    // Sides.
    [ 0, 1, 5, 4 ],
    [ 1, 2, 6, 5 ],
    [ 2, 3, 7, 6 ],
    [ 3, 0, 4, 7 ],

    // Top.
    [ 4, 5, 6, 7 ]
  ];

  return geometry.push( vertices, faces );
}

window.BuildingTest = function() {
  var game = new Game( 568, 320 );
  document.body.appendChild( game.canvas );

  var scene = game.scene;

  var boxGeometry = new Geometry();
  addBoxGeometry( boxGeometry, 1, 2.5, 1 );
  addBoxGeometry( boxGeometry, 1, 3, 1, 2, 0, 0 );
  addBoxGeometry( boxGeometry, 1.5, 2, 1, -2, 0, 0 );
  addBoxGeometry( boxGeometry, 4, 1.5, 1, 0, 0, 2 );
  boxGeometry.computeFaceNormals();

  var material = new LambertGlowMaterial({
    color: new Color( 0.9, 0.9, 0.9 ),
    ambient: new Color( 0.5, 0.5, 0.5 ),
    diffuse: new Color( 0.5, 0.5, 0.5 ),
    shadowColor: new Color( 1, 1, 1 ),
    shadowBlur: 16
  });

  var mesh = new Mesh( boxGeometry, material );
  scene.add( mesh );

  var light = new DirectionalLight( new Color( 0.5, 0.5, 0.5 ) );
  light.position.set( -10, 0, 5 );
  light.filter.maskBits = 0;
  scene.add( light );

  var light2 = new DirectionalLight( new Color( 1, 1, 1 ) );
  light2.position.set( 0, 10, 0 );
  scene.add( light2 );

  game.ambient.setRGB( 0.2, 0.2, 0.2 );

  game.camera.position.set( -2, 5, -4 );
  game.camera.lookAt( mesh.position );
  game.camera.updateProjectionMatrix();

  var controls = new Controls( game.camera );

  game.play();
};

exports.addBoxGeometry = addBoxGeometry;
