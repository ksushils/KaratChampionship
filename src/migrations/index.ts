import * as migration_20261103_211102_initial from './20261103_211102_initial';

export const migrations = [
  {
    up: migration_20261103_211102_initial.up,
    down: migration_20261103_211102_initial.down,
    name: '20261103_211102_initial'
  },
];
