import * as migration_20261103_211102_initial from './20261103_211102_initial';
import * as migration_20261103_212454_testing_fleet from './20261103_212454_testing_fleet';

export const migrations = [
  {
    up: migration_20261103_211102_initial.up,
    down: migration_20261103_211102_initial.down,
    name: '20261103_211102_initial',
  },
  {
    up: migration_20261103_212454_testing_fleet.up,
    down: migration_20261103_212454_testing_fleet.down,
    name: '20261103_212454_testing_fleet'
  },
];
