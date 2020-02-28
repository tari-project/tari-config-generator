export function detectPlatform () {
  if (window.navigator.userAgent.indexOf('Windows') !== -1) {
    return 'Windows';
  }

  if (window.navigator.userAgent.indexOf('Mac') !== -1) {
    return 'Mac OS';
  }

  return 'Linux';
}

export function joinPath (path, platform) {
  if (platform === 'Windows') {
    return path.join('\\');
  }

  return path.join('/');
}

export function localPath (platform) {
  if (platform === 'Windows') {
    return joinPath([
      '%UserProfile%',
      'AppData',
      'Local',
      'Tari',
    ], platform);
  }

  return '$BASE';
}

export function basePath (platform) {
  if (platform === 'Windows') {
    return joinPath([
      '%AppData%',
      'tari',
    ], platform);
  }

  if (platform === 'Mac OS') {
    return joinPath([
      '$HOME',
      '.tari',
    ], platform);
  }

  return joinPath([
    '~',
    '.tari',
  ], platform);
}
