(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.animht = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var container = document.querySelector(".container");

for (var i = 0; i <= 135; i++) {
  var heart = document.createElement('div');
  heart.classList.add('heart');
  container.appendChild(heart);
}

(function animateHeart() {
  anime({
    targets: '.heart',
    translateX: function translateX() {
      return anime.random(-900, 900);
    },
    translateY: function translateY() {
      return anime.random(-500, 500);
    },
    rotate: 45,
    scale: function scale() {
      return anime.random(1, 3);
    },
    easing: 'easeInOutBack',
    duration: 5000,
    delay: anime.stagger(10),
    complete: animateHeart
  });
})();

},{}]},{},[1])(1)
});
