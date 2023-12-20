
const { version } = require('../../../package.json')

import simpleGit, { SimpleGit } from 'simple-git';

export async function index(req, h) {

  const { hash: revision, date } = await getLatestCommitHash();

  return h.response({ version, revision, date }).code(200)

}


async function getLatestCommitHash(): Promise<{hash: string, date: string}> {
  const git: SimpleGit = simpleGit();

  // Get the commit log
  const logInfo: any = await git.log();

  console.log(logInfo)

  // Get the latest commit hash
  const {hash, date} = logInfo.all[0];

  return { hash, date};
}

