#!/usr/bin/env node
import { run } from './cli';

run({
  argv: process.argv,
  programName: 'fuels-contracts',
}).catch(() => {
  process.exit(0);
});