/*
** Use this file to download model file from hugginface if you don't use hugginface cache for models
** It supports download resume also.
*/

import fs from 'fs';
import axios from 'axios';

const SITE = 'https://huggingface.co/';
const DST = './models/';

const api = axios.create();

api.interceptors.response.use(
  response => response,
  error => {
    console.log('Axios error');
    error.response = null;
    throw error;
  }
);


downloadModel('eachadea/ggml-vicuna-13b-1.1', 'ggml-vic13b-q5_1.bin');
// downloadModel('TheBloke/wizard-vicuna-13B-GGML', 'wizard-vicuna-13B.ggml.q5_1.bin');

async function downloadModel(repo_id, file) {
  try {
    const downloadUrl = `${SITE}${repo_id}/resolve/main/${file}`;

    const lfsInfo = await genLfsInfo(repo_id, file);
    if (!lfsInfo) {
      console.log('Could not get LFS info.');
      return;
    }

    const fileSize = getFileSizeOrNull(file);

    if (fileSize && fileSize > 0) {
      if (parseInt(lfsInfo.size) === fileSize) {
        console.log('File already downloaded.');
        return;
      }
    }

    return downloadWithResume(downloadUrl, file);
  } catch (error) {
    console.log('Error downloading:', error.message);
  }
}

function getFullDestination(file) {
  return `${DST}${file}`;
}

function getFileSizeOrNull(file) {
  const destination = getFullDestination(file);
  if (fs.existsSync(destination)) {
    const { size: fileSize } = fs.statSync(destination);
    return fileSize;
  }
  return null;
}

async function downloadWithResume(url, file) {
  let downloadedBytes = 0;

  const fileSize = getFileSizeOrNull(file);

  if (fileSize && fileSize > 0) {
    downloadedBytes = fileSize;
    console.log('Resuming download from byte position:', downloadedBytes);
  }

  const headers = { Range: `bytes=${downloadedBytes}-` };
  const response = await api.get(url, { headers, responseType: 'stream' });

  if (!response.headers['accept-ranges']) {
    console.log('Resumable downloads are not supported for this file.');
    return;
  }
  const totalSize = parseInt(response.headers['content-length']) + downloadedBytes;
  const fileStream = fs.createWriteStream(getFullDestination(file), { flags: downloadedBytes > 0 ? 'a' : 'w' });

  response.data.on('data', (chunk) => {
    fileStream.write(chunk);

    downloadedBytes += chunk.length;
    const progress = (downloadedBytes / totalSize) * 100;
    // eslint-disable-next-line no-undef
    process.stdout.write(`\rProgress: ${progress.toFixed(2)}%`);
  });

  response.data.on('end', () => {
    fileStream.close();
    console.log('\nDownload complete.');
  });

  response.data.on('error', (error) => {
    console.log('\nError downloading:', error.message);
    fileStream.close();
  });

}

async function genLfsInfo(repo_id, file) {
  const gitLfsPointerUrl = `${SITE}${repo_id}/raw/main/${file}`;

  const response = await api.get(gitLfsPointerUrl);

  const regex = /oid sha256:(\w+)\s+size\s+(\d+)/;
  const matches = response.data.match(regex);

  if (!matches || matches.length < 3) {
    throw new Error('Could not parse LFS info.');
  }

  const oid = matches[1];
  const size = matches[2];

  return { oid, size };
}

