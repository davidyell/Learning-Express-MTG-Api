import fsPromise from 'node:fs/promises';

const teardown = async () => {
  await fsPromise.unlink(process.env.DATABASE_URL as string);
};

export default teardown;
