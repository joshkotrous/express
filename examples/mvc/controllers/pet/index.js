'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

// Helper function to sanitize input and prevent XSS
function sanitizeInput(input) {
  // Return empty string if input is not a string
  if (typeof input !== 'string') {
    return '';
  }
  
  // Trim whitespace
  input = input.trim();
  
  // HTML encode special characters to prevent XSS
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

exports.before = function(req, res, next){
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next('route');
  req.pet = pet;
  next();
};

exports.show = function(req, res, next){
  res.render('show', { pet: req.pet });
};

exports.edit = function(req, res, next){
  res.render('edit', { pet: req.pet });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.pet.name = sanitizeInput(body.pet.name);
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};