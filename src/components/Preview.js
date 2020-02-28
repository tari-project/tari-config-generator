/* global Blob */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Preview.css';

import Importer from './Importer';

import { joinPath, basePath } from '../system';
import data from '../data.compiled.json';
// TODO [ToDr] move to some common?
import {fillDescription} from './Editor';

class Preview extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    defaults: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  generateConfig = () => {
    const {settings, defaults} = this.props;
    const data = toToml(settings, defaults);
    const filename = 'config.toml';
    const blob = new Blob([data], {type: 'text/toml'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }

  render () {
    const {settings, defaults} = this.props;
    return (
      <div className='mdl-card mdl-shadow--2dp preview-card'>
        <div className='mdl-card__title'>
          <div className='preview-title mdl-card__title-text'>
            config.toml
          </div>
        </div>
        <div className='mdl-card__actions mdl-card--border'>
          <textarea className='preview-editor' readOnly value={toToml(settings, defaults)} />
        </div>
        <div className='mdl-card__menu'>
          <Importer defaults={defaults} onChange={this.props.onChange} onError={this.props.onError} />
          <a
            className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-efect'
            target='_blank'
            href={window.location.toString()}>
            <i className='material-icons' id='link'>link</i>
            <span className='mdl-tooltip' htmlFor='link'>Link to this Config File</span>
          </a>
          <button
            className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-efect'
            onClick={this.generateConfig}>
            <i className='material-icons' id='download'>cloud_download</i>
            <span className='mdl-tooltip' htmlFor='download'>Download Config File</span>
          </button>
        </div>
      </div>
    );
  }
}

function toToml (settings, defaults) {
  const toml = Object.keys(settings)
    .filter(section => section !== '__internal')
    .reduce((acc, section) => {
      // for old configs the section might be missing in defaults
      defaults[section] = defaults[section] || {};

      data[section] = data[section] || {};
      const sectionName = data[section].section || section;
      const sectionDescription = data[section].description || "";

      acc = acc.concat(toSectionHeader(sectionName, 120));
      acc.push(split_comment_at(sectionDescription, 118));

      const vals = Object.keys(settings[section])
        .filter(key => !isEqual(settings[section][key], defaults[section][key]))
        .map(key => {
          const val = settings[section][key];
          const comment = toComment(settings, section, key, val);
          const setting = `${key} = ${toVal(val)}`;
          return `\n${comment}\n${setting}`;
        });

      if (vals.length) {
        acc.push(`\n[${section}]`);
      }

      return acc.concat(vals);
    }, []);

  if (!toml.length) {
    toml.push(
      '',
      '',
      '# All values you use are defaults. Config is not needed.'
    );
  }

  const { platform } = settings.__internal || defaults.__internal;
  const configPath = joinPath([basePath(platform), 'config.toml'], platform);
  toml.unshift(
    '# This config should be placed in following path:',
    `#   ${configPath}`,
  );

  return toml.join('\n');
}

function isEqual (a, b) {
  // TODO [todr] optimize
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Splits a string at word boundaries so that each line is at most `line_length` long, and then prefixes each line
 * with a comment character
 */
function split_comment_at(multi_comment, line_length) {
  const split = (comment) => {
    const lines = [];
    const words = comment.split(/\s/);
    while (words.length > 0) {
      let line = "#";
      while (words.length > 0 && (line.length + words[0].length < line_length)) {
        line += " " + words.shift();
      }
      lines.push(line);
    }
    return lines.join('\n');
  };
  const comments = multi_comment.split('\n');
  return comments.map(split).join('\n');
}

function toSectionHeader(heading, width) {
  const banner = "#".repeat(width);
  const inner = `#${" ".repeat(width-2)}#`;
  const left_pad = Math.floor((width-2 - heading.length) / 2);
  const right_pad = width - heading.length - 2 - left_pad;
  let title = `#${" ".repeat(left_pad)}${heading}${" ".repeat(right_pad)}#`;
  return [banner, inner, title, inner, banner];
}

function toComment (settings, section, key, value) {
  // for old configs the section might be missing in defaults
  data[section] = data[section] || {};
  data[section][key] = data[section][key] || {};

  let comment;
  if (typeof data[section][key].description === 'object') {
    if ('suggestions' in data[section][key] && !(value in data[section][key].description)) {
      comment = `Custom ${key.toLowerCase()}`;
    }
    comment = fillDescription(data[section][key].description[value], value);
  } else {
    comment = fillDescription(data[section][key].description, value);
  }
  return split_comment_at(comment, 118);
}

function toVal (val) {
  if (typeof val === 'boolean') {
    return `${val}`;
  }

  if (typeof val === 'number') {
    return `${val}`;
  }

  if (Array.isArray(val)) {
    return `[${val.map(v => toVal(v)).join(', ')}]`;
  }

  // Escape windows paths
  val = val ? val.replace(/\\([^\\])/g, '\\\\$1') : val;
  return `"${val}"`;
}

export default Preview;
