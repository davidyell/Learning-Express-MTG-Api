/* eslint-disable no-console */
import util from 'node:util';

const execFile = util.promisify(require('node:child_process').execFile);

const setup = async () => {
  console.log('> Creating testing database...');
  await execFile('./infrastructure/setup-db.sh', [], (error: Error, stdout: string | Buffer, stderr: string | Buffer) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
};
export default setup;
